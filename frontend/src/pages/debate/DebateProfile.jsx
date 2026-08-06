import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import SkillsChart from '../../components/debate/SkillsChart'
import ScoreRadial from '../../components/debate/ScoreRadial'
import { FiArrowLeft, FiAward, FiTarget, FiTrendingUp, FiCpu, FiUsers, FiArrowRight, FiMap } from 'react-icons/fi'

export default function DebateProfile() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [coachData, setCoachData] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshUser()
    Promise.all([
      api.get('/debate-result/coach'),
      api.get('/debate/history?limit=10'),
    ])
      .then(([coachRes, histRes]) => {
        setCoachData(coachRes.data)
        setHistory(histRes.data.debates || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = user?.debateStats || {}
  const skills = user?.debateSkills || {}

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  const advice = coachData?.advice || {}

  return (
    <div className="page-container max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={() => navigate('/debate')} className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1">
          <FiArrowLeft size={14} /> Back to Arena
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-black text-white shadow-glow-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">{user?.username}'s Profile</h1>
            <p className="text-text-muted text-sm">AI Debate Coach & Personal Dashboard</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8"
      >
        {[
          { label: 'Total', value: stats.totalDebates || 0, color: 'text-primary' },
          { label: 'Wins', value: stats.wins || 0, color: 'text-success' },
          { label: 'Losses', value: stats.losses || 0, color: 'text-error' },
          { label: 'Draws', value: stats.draws || 0, color: 'text-warning' },
          { label: 'Avg Score', value: `${stats.averageScore || 0}%`, color: 'text-secondary' },
        ].map(s => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Skills Chart */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-4">
            <FiTarget size={18} className="text-primary" /> Skill Levels
          </h3>
          <SkillsChart skills={skills} />

          {/* Strength & Weakness */}
          <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-success font-semibold">Strongest</span>
              <p className="text-sm font-bold text-text-primary mt-0.5">
                {Object.entries(skills).sort(([,a], [,b]) => b - a)[0]?.[0]?.replace(/([A-Z])/g, ' $1').trim() || '—'}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-warning font-semibold">Needs Work</span>
              <p className="text-sm font-bold text-text-primary mt-0.5">
                {Object.entries(skills).sort(([,a], [,b]) => a - b)[0]?.[0]?.replace(/([A-Z])/g, ' $1').trim() || '—'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* AI Coach */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Roadmap */}
          <div className="gradient-border rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2 mb-3">
                <FiMap size={18} className="text-secondary" /> Personal Roadmap
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{advice.roadmap || 'Complete your first debate to get personalized advice!'}</p>
            </div>
          </div>

          {/* Focus Areas */}
          {advice.focusAreas?.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-warning mb-2 flex items-center gap-1.5">
                <FiTarget size={14} /> Focus Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                {advice.focusAreas.map((a, i) => (
                  <span key={i} className="badge bg-warning/15 text-warning">{a}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {advice.tips?.length > 0 && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-success mb-2 flex items-center gap-1.5">
                <FiTrendingUp size={14} /> Coach Tips
              </h4>
              <div className="space-y-2">
                {advice.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-success text-xs mt-0.5">💡</span>
                    <span className="text-xs text-text-secondary">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Challenge */}
          {advice.nextChallenge && (
            <div className="glass-card p-5">
              <h4 className="text-sm font-bold text-primary mb-2">🎯 Suggested Challenge</h4>
              <p className="text-xs text-text-secondary mb-3">{advice.nextChallenge}</p>
              <Link to="/debate/ai-setup" className="text-xs text-primary hover:text-primary-light font-medium flex items-center gap-1">
                Try it now <FiArrowRight size={12} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Debate History */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-bold text-text-primary mb-4">Debate History</h3>
        {history.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-text-muted text-sm">No debates yet. Start your first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(d => (
              <Link
                key={d._id}
                to={d.status === 'completed' ? `/debate/result/${d._id}` : `/debate/ai/${d._id}`}
                className="glass-card p-4 flex items-center gap-3 hover:border-primary/30 transition-colors block"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  d.type === 'AI_DEBATE' ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary'
                }`}>
                  {d.type === 'AI_DEBATE' ? <FiCpu size={14} /> : <FiUsers size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{d.topic}</p>
                  <p className="text-xs text-text-muted">
                    {d.category} · {new Date(d.createdAt).toLocaleDateString()}
                    {d.result ? ` · Score: ${d.result.overallScore}%` : ''}
                  </p>
                </div>
                <span className={`badge ${
                  d.status === 'completed'
                    ? d.winnerLabel === 'user' ? 'bg-success/15 text-success' : d.winnerLabel === 'draw' ? 'bg-warning/15 text-warning' : 'bg-error/15 text-error'
                    : 'bg-primary/15 text-primary'
                }`}>
                  {d.status === 'completed'
                    ? d.winnerLabel === 'user' ? 'Won' : d.winnerLabel === 'draw' ? 'Draw' : 'Lost'
                    : 'Active'
                  }
                </span>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
