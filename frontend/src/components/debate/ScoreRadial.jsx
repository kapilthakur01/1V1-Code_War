import { motion } from 'framer-motion'

export default function ScoreRadial({ score, label, size = 80, strokeWidth = 6, color }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const colorMap = {
    primary: { stroke: '#7C3AED', glow: 'rgba(124,58,237,0.3)' },
    secondary: { stroke: '#06B6D4', glow: 'rgba(6,182,212,0.3)' },
    success: { stroke: '#22C55E', glow: 'rgba(34,197,94,0.3)' },
    warning: { stroke: '#F59E0B', glow: 'rgba(245,158,11,0.3)' },
    error: { stroke: '#EF4444', glow: 'rgba(239,68,68,0.3)' },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg font-black text-text-primary"
          >
            {score}%
          </motion.span>
        </div>
      </div>
      {label && (
        <span className="text-xs font-medium text-text-muted text-center">{label}</span>
      )}
    </div>
  )
}
