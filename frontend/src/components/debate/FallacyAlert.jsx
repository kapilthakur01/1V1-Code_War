import { motion } from 'framer-motion'
import { FiAlertTriangle } from 'react-icons/fi'

const fallacyInfo = {
  'Ad Hominem': { emoji: '👤', color: 'border-error/40 bg-error/10' },
  'Hasty Generalization': { emoji: '⚡', color: 'border-warning/40 bg-warning/10' },
  'False Dilemma': { emoji: '🔀', color: 'border-primary/40 bg-primary/10' },
  'Circular Reasoning': { emoji: '🔄', color: 'border-secondary/40 bg-secondary/10' },
  'Straw Man': { emoji: '🌾', color: 'border-error/40 bg-error/10' },
  'Appeal to Authority': { emoji: '👑', color: 'border-warning/40 bg-warning/10' },
  'Red Herring': { emoji: '🐟', color: 'border-error/40 bg-error/10' },
  'Slippery Slope': { emoji: '⛷️', color: 'border-primary/40 bg-primary/10' },
}

export default function FallacyAlert({ fallacy }) {
  const info = fallacyInfo[fallacy.type] || { emoji: '⚠️', color: 'border-warning/40 bg-warning/10' }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`border rounded-xl p-3 ${info.color}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-lg">{info.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <FiAlertTriangle size={12} className="text-warning" />
            <span className="text-xs font-bold text-text-primary">{fallacy.type}</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{fallacy.explanation}</p>
        </div>
      </div>
    </motion.div>
  )
}
