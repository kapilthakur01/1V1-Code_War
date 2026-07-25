import { useEffect, useState } from 'react'
import { FiClock } from 'react-icons/fi'

export default function Timer({ startTime, duration = 30 * 60 * 1000, onTimeUp }) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    if (!startTime) return

    const calc = () => {
      const elapsed = Date.now() - new Date(startTime).getTime()
      const rem = Math.max(0, duration - elapsed)
      setRemaining(rem)
      if (rem === 0 && onTimeUp) onTimeUp()
    }

    calc()
    const interval = setInterval(calc, 1000)
    return () => clearInterval(interval)
  }, [startTime, duration, onTimeUp])

  const totalSeconds = Math.floor(remaining / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const percent = (remaining / duration) * 100

  const isUrgent = remaining < 5 * 60 * 1000 // < 5 minutes
  const isCritical = remaining < 60 * 1000 // < 1 minute

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
      isCritical
        ? 'border-error/50 bg-error/10 animate-pulse'
        : isUrgent
        ? 'border-warning/50 bg-warning/10'
        : 'border-border bg-bg-card'
    }`}>
      <FiClock
        size={16}
        className={isCritical ? 'text-error' : isUrgent ? 'text-warning' : 'text-text-secondary'}
      />
      <span className={`font-mono font-bold text-lg tabular-nums ${
        isCritical ? 'text-error' : isUrgent ? 'text-warning' : 'text-text-primary'
      }`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      {/* Progress bar */}
      <div className="w-16 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isCritical ? 'bg-error' : isUrgent ? 'bg-warning' : 'bg-primary'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
