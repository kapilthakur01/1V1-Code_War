import { motion, AnimatePresence } from 'framer-motion'

export default function TypingIndicator({ isTyping, username }) {
  return (
    <AnimatePresence>
      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-xs text-secondary"
        >
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-secondary"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
          <span>{username} is coding...</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
