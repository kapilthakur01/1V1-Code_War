import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX, FiLogOut } from 'react-icons/fi'

/**
 * QuitConfirmModal - Confirmation dialog before quitting a debate.
 *
 * Props:
 *   isOpen    {boolean}   - Whether the modal is visible
 *   onConfirm {function}  - Called when user confirms quit
 *   onCancel  {function}  - Called when user cancels
 *   loading   {boolean}   - Shows spinner while quitting
 */
export default function QuitConfirmModal({ isOpen, onConfirm, onCancel, loading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="glass-card p-8 max-w-sm w-full pointer-events-auto relative"
              style={{ boxShadow: '0 0 60px rgba(239,68,68,0.2), 0 4px 24px rgba(0,0,0,0.5)' }}
            >
              {/* Close X */}
              <button
                onClick={onCancel}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              >
                <FiX size={16} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-5">
                <motion.div
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-16 rounded-2xl bg-error/15 border border-error/30 flex items-center justify-center text-error"
                >
                  <FiAlertTriangle size={28} />
                </motion.div>
              </div>

              {/* Text */}
              <h2 className="text-xl font-black text-text-primary text-center mb-2">Quit Debate?</h2>
              <p className="text-sm text-text-secondary text-center leading-relaxed mb-6">
                Are you sure you want to quit? Your current progress and score will be forfeited and the debate will end immediately.
              </p>

              {/* Warning note */}
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-warning/10 border border-warning/20 mb-6">
                <FiAlertTriangle size={14} className="text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-warning leading-snug">
                  Quitting counts as a loss. The AI will still generate a result based on your arguments so far.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 btn-ghost border border-border rounded-xl py-2.5 text-sm font-semibold"
                >
                  Stay
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 btn-danger text-sm py-2.5 rounded-xl flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiLogOut size={15} />
                      Quit
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
