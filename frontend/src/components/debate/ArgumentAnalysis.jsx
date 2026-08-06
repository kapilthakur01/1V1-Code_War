import { motion, AnimatePresence } from 'framer-motion'
import { FiTarget, FiBook, FiCpu, FiZap } from 'react-icons/fi'

export default function ArgumentAnalysis({ analysis }) {
  if (!analysis || !analysis.claim) return null

  const items = [
    { icon: <FiTarget size={14} />, label: 'Claim', value: analysis.claim, color: 'text-primary' },
    { icon: <FiBook size={14} />, label: 'Evidence', value: analysis.evidence, color: 'text-secondary' },
    { icon: <FiCpu size={14} />, label: 'Reasoning', value: analysis.reasoning, color: 'text-warning' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card p-4 mt-3"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
          <FiZap size={12} className="text-primary" />
          Argument Analysis
        </h4>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            analysis.strengthScore >= 75 ? 'bg-success' :
            analysis.strengthScore >= 50 ? 'bg-warning' : 'bg-error'
          }`} />
          <span className="text-xs font-bold text-text-primary">{analysis.strengthScore}/100</span>
        </div>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="flex items-start gap-2">
            <span className={`mt-0.5 ${item.color}`}>{item.icon}</span>
            <div>
              <span className="text-[10px] font-semibold text-text-muted uppercase">{item.label}</span>
              <p className="text-xs text-text-secondary leading-relaxed">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Strength bar */}
      <div className="mt-3 pt-2 border-t border-border/50">
        <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.strengthScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: analysis.strengthScore >= 75
                ? 'linear-gradient(90deg, #22C55E, #4ADE80)'
                : analysis.strengthScore >= 50
                  ? 'linear-gradient(90deg, #F59E0B, #FCD34D)'
                  : 'linear-gradient(90deg, #EF4444, #F87171)'
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}
