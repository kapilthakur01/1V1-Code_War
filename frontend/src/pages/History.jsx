import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'
import { FiClock, FiChevronLeft, FiChevronRight, FiAward, FiXCircle, FiMinus } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'

function OutcomeBadge({ outcome }) {
  const map = {
    Win: { cls: 'bg-success/15 text-success', label: 'WIN' },
    Loss: { cls: 'bg-error/15 text-error', label: 'LOSS' },
    Draw: { cls: 'bg-warning/15 text-warning', label: 'DRAW' },
  }
  const c = map[outcome] || map.Loss
  return <span className={`badge font-bold tracking-wider ${c.cls}`}>{c.label}</span>
}

function VerdictText({ verdict }) {
  const color = {
    Accepted: 'text-success',
    'Wrong Answer': 'text-error',
    'Compilation Error': 'text-warning',
    'Runtime Error': 'text-warning',
    'Time Limit Exceeded': 'text-secondary',
    'Memory Limit Exceeded': 'text-error',
    'No submission': 'text-text-muted',
  }
  return <span className={`text-xs font-medium ${color[verdict] || 'text-text-muted'}`}>{verdict}</span>
}

export default function History() {
  const { user } = useAuth()
  const [battles, setBattles] = useState([])
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    api.get(`/history?page=${page}&limit=10`)
      .then(res => {
        setBattles(res.data.battles || [])
        setPagination(res.data.pagination || {})
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  const wins = user?.stats?.wins || 0
  const losses = user?.stats?.losses || 0
  const battles_count = user?.stats?.battles || 0
  const winRate = battles_count > 0 ? Math.round((wins / battles_count) * 100) : 0

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-1">
          Battle <span className="text-gradient">History</span>
        </h1>
        <p className="text-text-secondary">Your complete coding battle record</p>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="glass-card p-5 text-center border border-success/20">
          <div className="text-2xl font-black text-success">{wins}</div>
          <div className="text-xs text-text-muted mt-1">Wins</div>
        </div>
        <div className="glass-card p-5 text-center border border-error/20">
          <div className="text-2xl font-black text-error">{losses}</div>
          <div className="text-xs text-text-muted mt-1">Losses</div>
        </div>
        <div className="glass-card p-5 text-center border border-primary/20">
          <div className="text-2xl font-black text-gradient">{winRate}%</div>
          <div className="text-xs text-text-muted mt-1">Win Rate</div>
        </div>
      </motion.div>

      {/* Battle List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-20 w-full rounded-xl" />)}
          </div>
        ) : battles.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <FiClock size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-secondary mb-2">No battles yet</h3>
            <p className="text-text-muted">Start competing to build your history!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {battles.map((b, i) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                {/* Outcome */}
                <div className="flex-shrink-0 w-16 text-center">
                  <OutcomeBadge outcome={b.outcome} />
                </div>

                {/* Problem info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-primary truncate">
                      {b.problemId?.title || 'Unknown Problem'}
                    </h3>
                    <span className={`badge flex-shrink-0 ${
                      b.problemId?.difficulty === 'Easy' ? 'badge-easy' :
                      b.problemId?.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                    }`}>{b.problemId?.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <span>vs <span className="text-text-secondary font-medium">{b.opponentResult?.username || '?'}</span></span>
                    <span>My verdict: <VerdictText verdict={b.myResult?.verdict} /></span>
                    {b.myResult?.testsPassed !== undefined && (
                      <span>Tests: {b.myResult.testsPassed}/{b.myResult.totalTests ?? '?'}</span>
                    )}
                    {b.myResult?.executionTime > 0 && (
                      <span>{b.myResult.executionTime}ms</span>
                    )}
                  </div>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-xs text-text-muted text-right">
                  {b.createdAt && formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                </div>

                {/* Win reason */}
                {b.winReason && (
                  <div className="hidden lg:block flex-shrink-0 text-xs text-text-muted max-w-32 truncate" title={b.winReason}>
                    {b.winReason}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-30"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    p === page ? 'bg-primary text-white' : 'text-text-muted hover:bg-bg-hover'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="btn-ghost disabled:opacity-30"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
