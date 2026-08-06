import { useState, useEffect, useRef } from 'react'
import { FiMic, FiMicOff } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function VoiceInput({ onTranscript, disabled }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      setTranscript(interimTranscript || finalTranscript)
      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      try { recognition.stop() } catch (_) {}
    }
  }, [onTranscript])

  const toggle = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setTranscript('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const supported = ('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)

  if (!supported) return null

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={disabled}
        className={`p-2.5 rounded-xl transition-all duration-200 ${
          isListening
            ? 'bg-error/20 border border-error/40 text-error shadow-glow-sm animate-pulse'
            : 'bg-bg-secondary border border-border text-text-muted hover:text-text-primary hover:border-primary/40'
        }`}
        title={isListening ? 'Stop recording' : 'Voice input'}
      >
        {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
      </button>

      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full mb-2 left-0 right-0 min-w-[200px] glass-card p-2 text-xs text-text-secondary"
          >
            <div className="flex items-center gap-1 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
              <span className="text-[10px] text-text-muted font-medium">Listening...</span>
            </div>
            {transcript}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
