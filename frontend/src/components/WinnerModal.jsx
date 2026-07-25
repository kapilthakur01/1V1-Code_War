import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiAward, FiX, FiZap } from 'react-icons/fi'

// Simple confetti trigger without library
function fireConfetti() {
  const colors = ['#7C3AED', '#06B6D4', '#22C55E', '#F59E0B']
  const end = Date.now() + 3000
  const frame = () => {
    if (Date.now() > end) return
    // Use canvas-confetti if available, otherwise skip
    requestAnimationFrame(frame)
  }
  frame()
}

export default function WinnerModal({ winnerId, winnerUsername, winReason, isDraw, currentUserId, onClose }) {
  const isWinner = !isDraw && winnerId?.toString() === currentUserId?.toString()
  const isLoser = !isDraw && !isWinner
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
    if (isWinner) {
      // Trigger celebration effect
      const canvas = document.createElement('canvas')
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
      document.body.appendChild(canvas)
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      const particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: -10,
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2,
        color: ['#7C3AED', '#06B6D4', '#22C55E', '#F59E0B'][Math.floor(Math.random() * 4)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }))

      let animId
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach((p) => {
          p.y += p.vy
          p.x += p.vx
          p.rotation += p.rotationSpeed
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          ctx.restore()
        })
        if (particles.some((p) => p.y < canvas.height)) {
          animId = requestAnimationFrame(animate)
        } else {
          document.body.removeChild(canvas)
        }
      }
      animate()
      return () => {
        cancelAnimationFrame(animId)
        if (canvas.parentNode) document.body.removeChild(canvas)
      }
    }
  }, [isWinner])

  const config = isDraw
    ? { icon: '🤝', title: "It's a Draw!", subtitle: 'Equal skills — well played!', color: 'text-warning', border: 'border-warning/30', bg: 'from-warning/10' }
    : isWinner
    ? { icon: '🏆', title: 'Victory!', subtitle: "You crushed it!", color: 'text-success', border: 'border-success/30', bg: 'from-success/10' }
    : { icon: '💀', title: 'Defeated', subtitle: 'Better luck next time!', color: 'text-error', border: 'border-error/30', bg: 'from-error/10' }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`glass-card p-8 max-w-md w-full mx-4 text-center border ${config.border} bg-gradient-to-b ${config.bg} to-transparent relative`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
              <FiX size={20} />
            </button>

            {/* Icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              {config.icon}
            </motion.div>

            {/* Title */}
            <h2 className={`text-3xl font-bold mb-2 ${config.color}`}>{config.title}</h2>
            <p className="text-text-secondary mb-6">{config.subtitle}</p>

            {/* Winner info */}
            {!isDraw && (
              <div className="glass-card p-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrophy className="text-warning" size={16} />
                  <span className="text-xs text-text-muted uppercase tracking-wider">Winner</span>
                </div>
                <p className="font-bold text-lg text-text-primary">{winnerUsername}</p>
                {winReason && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiZap size={12} className="text-secondary" />
                    <p className="text-sm text-text-muted">{winReason}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { onClose(); window.location.href = '/matchmaking' }}
                className="btn-primary flex-1 py-2.5"
              >
                Battle Again
              </button>
              <button
                onClick={() => { onClose(); window.location.href = '/history' }}
                className="btn-secondary flex-1 py-2.5"
              >
                View History
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
