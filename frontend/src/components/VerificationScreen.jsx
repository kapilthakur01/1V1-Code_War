import { useState, useEffect, useRef } from 'react';
import { FiCamera, FiMic, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VerificationScreen({ onVerified }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  const requestPermissions = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error(err);
      toast.error('Camera access is mandatory to participate in this contest.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStart = () => {
    if (hasCameraPermission) {
      // Stop the stream so the proctoring hook can re-request it or we can pass it
      // Actually, to avoid double-requesting, we can let `useProctoring` request it again.
      // Most browsers will auto-allow if already granted in this session.
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      onVerified();
    }
  };

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-lg w-full p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-4">
          <FiAlertTriangle size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary">Proctoring Verification</h2>
        
        <div className="text-sm text-text-secondary space-y-4 text-left bg-bg-secondary p-4 rounded-lg border border-border">
          <p className="font-semibold text-text-primary">Strict Proctoring Rules Apply:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your camera must be active during the entire contest.</li>
            <li>Do not look away from the screen for extended periods.</li>
            <li>No multiple faces allowed in the frame.</li>
            <li>Do not switch tabs, minimize the window, or open Developer Tools.</li>
            <li>Copy and pasting is disabled.</li>
            <li><strong>3 violations will result in automatic disqualification.</strong></li>
          </ul>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          {hasCameraPermission ? (
            <div className="relative w-full max-w-sm aspect-video bg-black rounded-lg overflow-hidden border-2 border-success/30">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
              <div className="absolute bottom-2 left-2 bg-success/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                <FiCheckCircle /> Camera Verified
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm aspect-video bg-bg-secondary rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-text-muted gap-2">
              <FiCamera size={24} />
              <span>Camera preview will appear here</span>
            </div>
          )}

          {!hasCameraPermission ? (
             <button 
                onClick={requestPermissions}
                disabled={isLoading}
                className="btn-primary w-full py-3 mt-4"
             >
                {isLoading ? 'Requesting Permissions...' : 'Grant Camera & Microphone Access'}
             </button>
          ) : (
             <button 
                onClick={handleStart}
                className="btn-success w-full py-3 mt-4 text-lg font-bold shadow-lg shadow-success/20"
             >
                Acknowledge Rules & Join Room
             </button>
          )}
        </div>
      </div>
    </div>
  );
}
