import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiWifi, FiWifiOff } from 'react-icons/fi'

/**
 * CameraFeed - Shows user's own webcam + an opponent "slot".
 *
 * Props:
 *   userName       {string}  - Your display name
 *   opponentName   {string}  - Opponent display name (or "AI" for AI debates)
 *   isAI           {boolean} - If true, shows an animated AI avatar instead of camera
 *   opponentOnline {boolean} - If false, shows "disconnected" for opponent
 *   side           {string}  - "support" | "oppose"
 *   opponentSide   {string}
 */
export default function CameraFeed({
  userName = 'You',
  opponentName = 'Opponent',
  isAI = false,
  opponentOnline = true,
  side = 'support',
  opponentSide = 'oppose',
}) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const [cameraOn, setCameraOn] = useState(false)
  const [micOn, setMicOn] = useState(true)
  const [cameraError, setCameraError] = useState(null)
  const [requesting, setRequesting] = useState(false)

  // Start camera automatically on mount
  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    if (requesting) return
    setRequesting(true)
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCameraOn(true)
    } catch (err) {
      setCameraError(err.name === 'NotAllowedError' ? 'Camera permission denied' : 'Camera not available')
      setCameraOn(false)
    } finally {
      setRequesting(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    setCameraOn(false)
  }

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setCameraOn(videoTrack.enabled)
      }
    } else {
      startCamera()
    }
  }

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0]
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled
    setMicOn(prev => !prev)
  }

  const sideColor = side === 'support' ? '#22C55E' : '#EF4444'
  const oppSideColor = opponentSide === 'support' ? '#22C55E' : '#EF4444'

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Two camera tiles */}
      <div className="grid grid-cols-2 gap-3">

        {/* User's camera */}
        <div className="relative rounded-2xl overflow-hidden bg-bg-secondary border border-border aspect-video group">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
          />

          <AnimatePresence>
            {!cameraOn && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-secondary"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${sideColor}55, ${sideColor}22)`, border: `1px solid ${sideColor}44` }}
                >
                  {userName?.[0]?.toUpperCase() || 'U'}
                </div>
                {cameraError && (
                  <p className="text-[10px] text-error text-center px-2">{cameraError}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name tag */}
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[10px] font-semibold text-white truncate">{userName}</span>
            </div>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ color: sideColor, background: `${sideColor}22`, border: `1px solid ${sideColor}44` }}
            >
              {side}
            </span>
          </div>

          {/* Hover controls */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleCamera}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ background: cameraOn ? 'rgba(0,0,0,0.6)' : 'rgba(239,68,68,0.7)' }}
              title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {cameraOn ? <FiVideo size={11} /> : <FiVideoOff size={11} />}
            </button>
            <button
              onClick={toggleMic}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white transition-colors"
              style={{ background: micOn ? 'rgba(0,0,0,0.6)' : 'rgba(239,68,68,0.7)' }}
              title={micOn ? 'Mute' : 'Unmute'}
            >
              {micOn ? <FiMic size={11} /> : <FiMicOff size={11} />}
            </button>
          </div>

          {!micOn && (
            <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-error/80 flex items-center justify-center">
              <FiMicOff size={10} className="text-white" />
            </div>
          )}
        </div>

        {/* Opponent / AI slot */}
        <div className="relative rounded-2xl overflow-hidden bg-bg-secondary border border-border aspect-video">
          {isAI ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary/10 to-primary/10">
              <motion.div
                animate={{ scale: [1, 1.06, 1], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-12 h-12 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-xl"
              >
                🤖
              </motion.div>
              <div className="flex gap-1 items-end h-4">
                {[0.2, 0.5, 0.9, 0.4, 0.7, 0.3, 0.8].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1 rounded-full bg-secondary/60"
                    animate={{ height: [`${h * 12}px`, `${(1 - h) * 12 + 4}px`, `${h * 12}px`] }}
                    transition={{ duration: 0.8 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            </div>
          ) : opponentOnline ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-secondary">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white"
                style={{ background: `linear-gradient(135deg, ${oppSideColor}55, ${oppSideColor}22)`, border: `1px solid ${oppSideColor}44` }}
              >
                {opponentName?.[0]?.toUpperCase() || 'O'}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-text-muted">
                <FiWifi size={10} className="text-success" />
                <span>Connected</span>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bg-secondary">
              <FiWifiOff size={24} className="text-text-muted" />
              <span className="text-[10px] text-text-muted">Waiting to connect…</span>
            </div>
          )}

          {/* Opponent name tag */}
          <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${opponentOnline || isAI ? 'bg-success animate-pulse' : 'bg-error'}`} />
              <span className="text-[10px] font-semibold text-white truncate">{opponentName}</span>
            </div>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ color: oppSideColor, background: `${oppSideColor}22`, border: `1px solid ${oppSideColor}44` }}
            >
              {opponentSide}
            </span>
          </div>
        </div>
      </div>

      {/* Quick camera / mic controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={toggleCamera}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            cameraOn
              ? 'bg-bg-secondary border border-border text-text-secondary hover:border-primary/40'
              : 'bg-error/15 border border-error/30 text-error'
          }`}
        >
          {cameraOn ? <FiVideo size={12} /> : <FiVideoOff size={12} />}
          <span>{cameraOn ? 'Camera On' : 'Camera Off'}</span>
        </button>
        <button
          onClick={toggleMic}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
            micOn
              ? 'bg-bg-secondary border border-border text-text-secondary hover:border-primary/40'
              : 'bg-error/15 border border-error/30 text-error'
          }`}
        >
          {micOn ? <FiMic size={12} /> : <FiMicOff size={12} />}
          <span>{micOn ? 'Mic On' : 'Mic Off'}</span>
        </button>
      </div>
    </div>
  )
}
