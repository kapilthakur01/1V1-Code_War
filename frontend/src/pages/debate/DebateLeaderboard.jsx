import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { FiArrowLeft, FiAward, FiTrendingUp, FiStar } from 'react-icons/fi'

export default function DebateLeaderboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [userRank, setUserRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/debate-leaderboard')
      .then(res => {
        setEntries(res.data.entries || [])
        setUserRank(res.data.userRank)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: '🥇', bg: 'bg-warning/15', border: 'border-warning/30' }
    if (rank === 2) return { icon: '🥈', bg: 'bg-text-muted/15', border: 'border-text-muted/30' }
    if (rank === 3) return { icon: '🥉', bg: 'bg-warning-dark/15', border: 'border-warning-dark/30' }
    return { icon: rank, bg: 'bg-bg-secondary', border: 'border-border' }
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={() => navigate('/debate')} className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1">
          <FiArrowLeft size={14} /> Back to Arena
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-warning/15 border border-warning/30 flex items-center justify-center text-warning">
            <FiStar size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">Global Leaderboard</h1>
            <p className="text-text-muted text-sm">Top debaters ranked by average score</p>
          </div>
        </div>
      </motion.div>

      {/* Your rank */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-border rounded-2xl p-5 mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold text-text-primary">{user?.username}</span>
                <p className="text-xs text-text-muted">Your Ranking</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-gradient">#{userRank.rank || '—'}</div>
              <p className="text-xs text-text-muted">Score: {userRank.score}%</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaderboard List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiAward size={40} className="text-text-muted mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-text-secondary mb-2">No rankings yet</h3>
          <p className="text-text-muted text-sm">Complete debates to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => {
            const badge = getRankBadge(entry.rank || i + 1)
            const isMe = entry.userId === user?._id
            return (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass-card p-4 flex items-center gap-4 ${isMe ? 'border-primary/40 bg-primary/5' : ''}`}
              >
                {/* Rank */}
                <div className={`w-10 h-10 rounded-xl ${badge.bg} border ${badge.border} flex items-center justify-center text-sm font-bold`}>
                  {typeof badge.icon === 'string' ? badge.icon : <span className="text-text-primary">{badge.icon}</span>}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary">{entry.username}</span>
                    {isMe && <span className="badge bg-primary/15 text-primary text-[10px]">You</span>}
                  </div>
                  <p className="text-xs text-text-muted">
                    {entry.totalDebates} debates · {entry.wins} wins · {entry.winRate}% win rate
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-lg font-black text-text-primary">{entry.score}%</div>
                  <p className="text-[10px] text-text-muted uppercase">Score</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
