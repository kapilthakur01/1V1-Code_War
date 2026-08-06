import { motion } from 'framer-motion'

export default function SkillsChart({ skills }) {
  const skillList = [
    { key: 'logic', label: 'Logic', color: '#7C3AED' },
    { key: 'communication', label: 'Communication', color: '#06B6D4' },
    { key: 'confidence', label: 'Confidence', color: '#22C55E' },
    { key: 'criticalThinking', label: 'Critical Thinking', color: '#F59E0B' },
    { key: 'evidence', label: 'Evidence', color: '#EF4444' },
  ]

  return (
    <div className="space-y-3">
      {skillList.map((skill, i) => {
        const value = skills?.[skill.key] || 0
        return (
          <div key={skill.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-text-secondary">{skill.label}</span>
              <span className="text-xs font-bold text-text-primary">{value}%</span>
            </div>
            <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${skill.color}, ${skill.color}88)`,
                  boxShadow: `0 0 8px ${skill.color}40`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
