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

  const reportViolation = useCallback((type, forceTerminate = false) => {
    if (isTerminated) return;
    
    setViolations(prev => {
      const newCount = prev + 1;
      if (newCount >= 3 || forceTerminate) {
        setIsTerminated(true);
        toast.error('Contest terminated due to proctoring violation.', { duration: 10000 });
      } else {
        toast.error(`Warning ${newCount}/3: ${type.replace('_', ' ')} detected!`, { duration: 5000 });
      }
      return newCount;
    });

    if (socket && roomId) {
      socket.emit('proctoring-violation', { roomId, violationType: type });
    }
  }, [socket, roomId, isTerminated]);

  // Request camera and load model
  useEffect(() => {
    let active = true;

    async function setup() {
      try {
        await tf.setBackend('webgl');
        const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
        const detectorConfig = { runtime: 'tfjs', maxFaces: 5 };
        const newDetector = await faceDetection.createDetector(model, detectorConfig);
        if (active) setDetector(newDetector);
      } catch (err) {
        console.error("TFJS face detection setup error:", err);
        toast.error("Failed to load face detection model.");
      }

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (active) {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        }
      } catch (err) {
        console.error("Camera access error:", err);
        // We handle camera permission denied in VerificationScreen
      }
    }

    setup();
    return () => {
      active = false;
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Face Detection Loop
  const detectFaces = useCallback(async () => {
    if (!detector || !videoRef.current || isTerminated) return;
    const video = videoRef.current;
    
    // Only detect if video is playing and ready
    if (video.readyState >= 2 && !video.paused && !video.ended) {
      try {
        const faces = await detector.estimateFaces(video);
        
        if (faces.length === 0) {
          // No face detected - buffer for 3 seconds before reporting
          if (Date.now() - lastFaceTimeRef.current > 3000) {
            reportViolation('no_face');
            lastFaceTimeRef.current = Date.now(); // reset to avoid spamming
          }
        } else if (faces.length > 1) {
           reportViolation('multiple_faces', true); // severe violation
           lastFaceTimeRef.current = Date.now();
        } else {
           // 1 face detected, all good
           lastFaceTimeRef.current = Date.now();
        }
      } catch (err) {
         // ignore estimateFaces errors
      }
    }
    
    if (isDetectingRef.current && !isTerminated) {
       loopRef.current = requestAnimationFrame(detectFaces);
    }
  }, [detector, reportViolation, isTerminated, videoRef]);

  // Start/Stop Detection
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

  // Environment monitoring
  useEffect(() => {
    if (isTerminated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportViolation('tab_switch');
      }
    };

    const handleBlur = () => {
      reportViolation('window_blur');
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      // reportViolation('context_menu'); // sometimes too strict, let's just prevent it
    };

    const handleKeyDown = (e) => {
      // F12 or Ctrl+Shift+I (DevTools)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        reportViolation('dev_tools', true); // severe
      }
      
      // Ctrl+C, Ctrl+V (Copy/Paste)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'C' || e.key === 'V')) {
        e.preventDefault();
        reportViolation('copy_paste');
      }
    };
    
    const handleBeforeUnload = (e) => {
       e.preventDefault();
       e.returnValue = '';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [reportViolation, isTerminated]);

  return { stream, violations, isTerminated };
}
