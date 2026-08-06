import { motion } from 'framer-motion'

export default function DebateMessage({ argument, currentUserId }) {
  const isUser = argument.speakerType === 'user' && argument.userId === currentUserId
  const isAI = argument.speakerType === 'ai'
  const isModerator = argument.speakerType === 'moderator'
  const isOpponent = argument.speakerType === 'user' && argument.userId !== currentUserId

  const getAvatar = () => {
    if (isUser) return { letter: 'Y', gradient: 'from-primary to-primary-dark' }
    if (isAI) return { letter: 'AI', gradient: 'from-secondary to-secondary-dark' }
    if (isModerator) return { letter: 'M', gradient: 'from-warning to-warning-dark' }
    return { letter: argument.speakerName?.[0] || 'O', gradient: 'from-error to-error-dark' }
  }

  const avatar = getAvatar()
  const align = isUser ? 'flex-row-reverse' : 'flex-row'
  const bubbleBg = isUser
    ? 'bg-primary/15 border-primary/30'
    : isModerator
      ? 'bg-warning/10 border-warning/30'
      : isAI
        ? 'bg-secondary/10 border-secondary/30'
        : 'bg-error/10 border-error/30'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${align} gap-3 mb-4`}
    >
      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}>
        {avatar.letter}
      </div>
      <div className={`max-w-[75%] rounded-2xl border ${bubbleBg} p-4`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-text-secondary">
            {isUser ? 'You' : argument.speakerName || (isAI ? 'AI Opponent' : 'Opponent')}
          </span>
          {argument.round && (
            <span className="text-[10px] text-text-muted px-1.5 py-0.5 rounded-full bg-bg-secondary">
              Round {argument.round}
            </span>
          )}
        </div>
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {argument.message}
        </p>

        {/* Strength score badge */}
        {argument.analysis?.strengthScore > 0 && (
          <div className="mt-2 pt-2 border-t border-border/50 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                argument.analysis.strengthScore >= 75 ? 'bg-success' :
                argument.analysis.strengthScore >= 50 ? 'bg-warning' : 'bg-error'
              }`} />
              <span className="text-[10px] text-text-muted font-medium">
                Strength: {argument.analysis.strengthScore}/100
              </span>
            </div>
            {argument.analysis.fallacies?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-error/15 text-error font-medium">
                ⚠ {argument.analysis.fallacies.length} fallac{argument.analysis.fallacies.length > 1 ? 'ies' : 'y'}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
