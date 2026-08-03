import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import toast from 'react-hot-toast';

export default function useProctoring(roomId, videoRef) {
  const { socket } = useSocket();
  const [violations, setViolations] = useState(0);
  const [isTerminated, setIsTerminated] = useState(false);
  const [stream, setStream] = useState(null);
  const [detector, setDetector] = useState(null);

  const lastFaceTimeRef = useRef(Date.now());
  const loopRef = useRef(null);
  const isDetectingRef = useRef(false);
  const isTerminatedRef = useRef(false); // sync ref to avoid stale closures in callbacks
  const violationsRef = useRef(0);
  const lastViolationTimeRef = useRef({}); // cooldown per violation type

  // Keep ref in sync
  useEffect(() => {
    isTerminatedRef.current = isTerminated;
  }, [isTerminated]);

  const reportViolation = useCallback((type, forceTerminate = false) => {
    if (isTerminatedRef.current) return;

    // Cooldown: don't spam the same violation within 5 seconds
    const now = Date.now();
    const lastTime = lastViolationTimeRef.current[type] || 0;
    if (now - lastTime < 5000 && !forceTerminate) return;
    lastViolationTimeRef.current[type] = now;

    violationsRef.current += 1;
    const newCount = violationsRef.current;

    setViolations(newCount);

    if (newCount >= 3 || forceTerminate) {
      isTerminatedRef.current = true;
      setIsTerminated(true);
      toast.error('⚠️ Contest terminated due to repeated proctoring violations.', { duration: 10000, id: 'terminated' });
    } else {
      const label = type.replace(/_/g, ' ');
      toast.error(`⚠️ Warning ${newCount}/3: ${label} detected!`, { duration: 5000, id: `violation-${newCount}` });
    }

    if (socket && roomId) {
      socket.emit('proctoring-violation', { roomId, violationType: type });
    }
  }, [socket, roomId]);

  // Setup camera + face detection model (once when roomId becomes truthy)
  useEffect(() => {
    if (!roomId) return;
    let active = true;
    let localStream = null;

    async function setup() {
      // Load face detection model
      try {
        await tf.setBackend('webgl');
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = { runtime: 'tfjs', maxFaces: 5 };
        const newDetector = await faceDetection.createDetector(model, detectorConfig);
        if (active) setDetector(newDetector);
      } catch (err) {
        console.error('TFJS face detection setup error:', err);
        // Don't show toast — model loading may fail silently on some browsers
      }

      // Request camera — browser will auto-allow if permission already granted this session
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream = mediaStream;
        if (active) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } else {
          // Component unmounted before we got the stream — stop it immediately
          mediaStream.getTracks().forEach(t => t.stop());
        }
      } catch (err) {
        console.error('Camera access error in proctoring hook:', err);
        toast.error('Camera access is required for proctoring. Please allow camera access.', { duration: 8000 });
      }
    }

    setup();

    return () => {
      active = false;
      if (localStream) localStream.getTracks().forEach(t => t.stop());
    };
  // Only re-run when roomId changes (not on every render)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // Attach stream to video when both are available
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, videoRef]);

  // Face Detection Loop
  const detectFaces = useCallback(async () => {
    if (!detector || !videoRef.current || isTerminatedRef.current) return;
    const video = videoRef.current;

    if (video.readyState >= 2 && !video.paused && !video.ended) {
      try {
        const faces = await detector.estimateFaces(video);

        if (faces.length === 0) {
          // Buffer 3 seconds before reporting
          if (Date.now() - lastFaceTimeRef.current > 3000) {
            reportViolation('no_face');
            lastFaceTimeRef.current = Date.now();
          }
        } else if (faces.length > 1) {
          reportViolation('multiple_faces', true); // severe — immediate termination
          lastFaceTimeRef.current = Date.now();
        } else {
          lastFaceTimeRef.current = Date.now(); // 1 face, all good
        }
      } catch (_) {
        // Ignore estimateFaces errors silently
      }
    }

    if (isDetectingRef.current && !isTerminatedRef.current) {
      loopRef.current = requestAnimationFrame(detectFaces);
    }
  }, [detector, reportViolation, videoRef]);

  // Start/Stop Detection loop when detector + stream are ready
  useEffect(() => {
    if (detector && stream && videoRef.current) {
      isDetectingRef.current = true;
      lastFaceTimeRef.current = Date.now();
      loopRef.current = requestAnimationFrame(detectFaces);
    }
    return () => {
      isDetectingRef.current = false;
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, [detector, stream, detectFaces, videoRef]);

  // Environment monitoring — tab switching, window blur, DevTools, copy-paste
  useEffect(() => {
    if (!roomId || isTerminated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_switch');
      }
    };

    // window blur = user switched to another app or devtools
    let blurTimeout = null;
    const handleBlur = () => {
      // Small delay to avoid false positives from in-page focus moves
      blurTimeout = setTimeout(() => {
        if (!document.hasFocus()) {
          reportViolation('window_blur');
        }
      }, 300);
    };
    const handleFocus = () => {
      if (blurTimeout) clearTimeout(blurTimeout);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // F12 or Ctrl+Shift+I (DevTools)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault();
        reportViolation('dev_tools', true);
      }
      // Ctrl+Shift+J (Chrome DevTools console)
      if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        reportViolation('dev_tools', true);
      }
      // Ctrl+C, Ctrl+V (Copy/Paste)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'C' || e.key === 'V')) {
        e.preventDefault();
        reportViolation('copy_paste');
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        reportViolation('view_source', true);
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (blurTimeout) clearTimeout(blurTimeout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [reportViolation, roomId, isTerminated]);

  return { stream, violations, isTerminated };
}
