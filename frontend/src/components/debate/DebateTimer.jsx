import { useState, useEffect } from 'react'
import { FiClock } from 'react-icons/fi'

export default function DebateTimer({ seconds, onTimeUp, running = true }) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (!running || timeLeft <= 0) {
      if (timeLeft <= 0 && onTimeUp) onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (onTimeUp) onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [running, timeLeft, onTimeUp])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const pct = (timeLeft / seconds) * 100
  const isLow = timeLeft <= 30

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
      isLow ? 'border-error/40 bg-error/10' : 'border-border bg-bg-secondary'
    } transition-colors`}>
      <FiClock size={14} className={isLow ? 'text-error animate-pulse' : 'text-text-muted'} />
      <span className={`text-sm font-mono font-bold ${isLow ? 'text-error' : 'text-text-primary'}`}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
      <div className="w-16 h-1.5 bg-bg-primary rounded-full overflow-hidden hidden sm:block">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-error' : 'bg-primary'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
