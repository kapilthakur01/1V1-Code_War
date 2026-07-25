export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="skeleton h-5 w-1/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-2/3" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="stat-card">
      <div className="skeleton h-4 w-20 mb-2" />
      <div className="skeleton h-8 w-16" />
    </div>
  )
}
