import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import { FiTrendingUp, FiAward, FiXCircle, FiClock, FiArrowRight, FiRefreshCw, FiZap, FiMessageCircle } from 'react-icons/fi'
import { FiSword } from '../components/SwordIcon'
import { StatSkeleton } from '../components/LoadingSkeleton'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

function VerdictBadge({ verdict }) {
  const map = {
    Win: 'badge bg-success/15 text-success',
    Loss: 'badge bg-error/15 text-error',
    Draw: 'badge bg-warning/15 text-warning',
  }
  return <span className={map[verdict] || 'badge bg-bg-hover text-text-muted'}>{verdict}</span>
}

export default function Dashboard() {
  const { user, refreshUser } = useAuth()
  const [history, setHistory] = useState([])
  const [histLoading, setHistLoading] = useState(true)

  useEffect(() => {
    refreshUser()
    api.get('/history?page=1&limit=5')
      .then(res => setHistory(res.data.battles || []))
      .catch(() => {})
      .finally(() => setHistLoading(false))
  }, [])

  const wins = user?.stats?.wins || 0
  const losses = user?.stats?.losses || 0
  const battles = user?.stats?.battles || 0
  const winStreak = user?.stats?.winStreak || 0
  const winRate = battles > 0 ? Math.round((wins / battles) * 100) : 0

  const stats = [
    { label: 'Total Battles', value: battles, icon: <FiSword size={20} />, color: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/5' },
    { label: 'Wins', value: wins, icon: <FiAward size={20} />, color: 'text-success', border: 'border-success/20', bg: 'bg-success/5' },
    { label: 'Win Streak', value: winStreak, icon: <FiZap size={20} />, color: 'text-warning', border: 'border-warning/20', bg: 'bg-warning/5' },
    { label: 'Win Rate', value: `${winRate}%`, icon: <FiTrendingUp size={20} />, color: 'text-secondary', border: 'border-secondary/20', bg: 'bg-secondary/5' },
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">
              Welcome back, <span className="text-gradient">{user?.username}</span> 👋
            </h1>
            <p className="text-text-secondary">Ready for your next coding battle?</p>
          </div>
          <Link to="/matchmaking" className="btn-primary hidden sm:inline-flex">
            Find Match <FiSword size={16} />
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={itemVariants} className={`stat-card border ${s.border}`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} mb-3`}>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-text-primary">{s.value}</div>
            <div className="text-sm text-text-muted">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Win rate progress bar */}
      {battles > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-secondary">Win Rate Progress</span>
            <span className="text-sm font-bold text-text-primary">{winRate}% ({wins}W / {losses}L)</span>
          </div>
          <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${winRate}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }}
            />
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
      >
        <Link to="/matchmaking" className="glass-card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:shadow-glow-sm transition-all">
            <FiSword size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary">Find a Match</h3>
            <p className="text-sm text-text-muted">Public matchmaking queue</p>
          </div>
          <FiArrowRight size={18} className="text-text-muted group-hover:text-primary transition-colors" />
        </Link>
        <Link to="/debate" className="glass-card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning group-hover:shadow-glow-sm transition-all">
            <FiMessageCircle size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary">Debate Arena</h3>
            <p className="text-sm text-text-muted">AI-powered debates</p>
          </div>
          <FiArrowRight size={18} className="text-text-muted group-hover:text-warning transition-colors" />
        </Link>
        <Link to="/history" className="glass-card-hover p-6 flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary group-hover:shadow-glow-cyan transition-all">
            <FiClock size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-text-primary">Battle History</h3>
            <p className="text-sm text-text-muted">View all past battles</p>
          </div>
          <FiArrowRight size={18} className="text-text-muted group-hover:text-secondary transition-colors" />
        </Link>
      </motion.div>

      {/* Recent Battles */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Recent Battles</h2>
          <Link to="/history" className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {histLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
          </div>
        ) : history.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FiSword size={40} className="text-text-muted mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-text-secondary mb-2">No battles yet</h3>
            <p className="text-text-muted mb-6">Jump into your first match to see results here.</p>
            <Link to="/matchmaking" className="btn-primary py-2.5 px-6 inline-flex">
              Find Match <FiSword size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((b) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-4 flex items-center gap-4"
              >
                <VerdictBadge verdict={b.outcome} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {b.problemId?.title || 'Unknown Problem'}
                  </p>
                  <p className="text-xs text-text-muted">
                    vs <span className="text-text-secondary">{b.opponentResult?.username || '?'}</span>
                    {' · '}
                    {b.myResult?.verdict || 'No submission'}
                  </p>
                </div>
                <span className={`badge ${
                  b.problemId?.difficulty === 'Easy' ? 'badge-easy' :
                  b.problemId?.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
                }`}>
                  {b.problemId?.difficulty}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
