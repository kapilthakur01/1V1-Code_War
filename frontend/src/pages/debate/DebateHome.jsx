import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import { FiCpu, FiUsers, FiTrendingUp, FiAward, FiArrowRight, FiZap, FiTarget, FiMessageCircle } from 'react-icons/fi'
import SkillsChart from '../../components/debate/SkillsChart'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function DebateHome() {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/debate/history?limit=5')
      .then(res => setHistory(res.data.debates || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = user?.debateStats || {}
  const skills = user?.debateSkills || {}

  const modes = [
    {
      to: '/debate/ai-setup',
      icon: <FiCpu size={28} />,
      title: 'AI Debate',
      desc: 'Practice with an AI opponent that challenges your arguments and identifies weaknesses.',
      color: 'text-primary',
      border: 'border-primary/30',
      bg: 'bg-primary/10',
      glow: 'group-hover:shadow-glow-purple',
    },
    {
      to: '/debate/live-setup',
      icon: <FiUsers size={28} />,
      title: 'Live Debate',
      desc: 'Create or join a room to debate in real-time with friends. AI moderates the match.',
      color: 'text-secondary',
      border: 'border-secondary/30',
      bg: 'bg-secondary/10',
      glow: 'group-hover:shadow-glow-cyan',
    },
    {
      to: '/debate/leaderboard',
      icon: <FiTrendingUp size={28} />,
      title: 'Leaderboard',
      desc: 'See where you rank globally. Compete for the top spot in debate ratings.',
      color: 'text-warning',
      border: 'border-warning/30',
      bg: 'bg-warning/10',
      glow: '',
    },
  ]

  const quickStats = [
    { label: 'Total Debates', value: stats.totalDebates || 0, icon: <FiMessageCircle size={18} />, color: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/5' },
    { label: 'Wins', value: stats.wins || 0, icon: <FiAward size={18} />, color: 'text-success', border: 'border-success/20', bg: 'bg-success/5' },
    { label: 'Avg Score', value: `${stats.averageScore || 0}%`, icon: <FiTarget size={18} />, color: 'text-secondary', border: 'border-secondary/20', bg: 'bg-secondary/5' },
    { label: 'Win Rate', value: stats.totalDebates > 0 ? `${Math.round(((stats.wins || 0) / stats.totalDebates) * 100)}%` : '0%', icon: <FiZap size={18} />, color: 'text-warning', border: 'border-warning/20', bg: 'bg-warning/5' },
  ]

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm">
            <FiMessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text-primary">
              <span className="text-gradient">AI Debate</span> Arena
            </h1>
            <p className="text-text-secondary text-sm">Sharpen your critical thinking and communication skills</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
      >
        {quickStats.map(s => (
          <motion.div key={s.label} variants={itemVariants} className={`stat-card border ${s.border}`}>
            <div className={`w-9 h-9 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center ${s.color} mb-2`}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-text-primary">{s.value}</div>
            <div className="text-xs text-text-muted">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Debate Modes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {modes.map(mode => (
          <motion.div key={mode.title} variants={itemVariants}>
            <Link
              to={mode.to}
              className={`glass-card-hover p-6 flex flex-col gap-4 group h-full ${mode.glow}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${mode.bg} border ${mode.border} flex items-center justify-center ${mode.color} group-hover:scale-110 transition-transform`}>
                {mode.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-primary mb-1">{mode.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{mode.desc}</p>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary group-hover:text-primary transition-colors">
                Get Started <FiArrowRight size={14} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Grid: Skills + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Your Skills</h2>
            <Link to="/debate/profile" className="text-xs text-primary hover:text-primary-light font-medium flex items-center gap-1">
              View Profile <FiArrowRight size={12} />
            </Link>
          </div>
          <SkillsChart skills={skills} />
        </motion.div>

        {/* Recent Debates */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Debates</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}
            </div>
          ) : history.length === 0 ? (
            <div className="glass-card p-10 text-center">
              <FiMessageCircle size={36} className="text-text-muted mx-auto mb-3" />
              <h3 className="text-base font-semibold text-text-secondary mb-2">No debates yet</h3>
              <p className="text-sm text-text-muted mb-5">Start your first debate to track your progress!</p>
              <Link to="/debate/ai-setup" className="btn-primary py-2.5 px-5 inline-flex text-sm">
                Start AI Debate <FiCpu size={14} />
              </Link>
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
                      {d.type === 'AI_DEBATE' ? 'vs AI' : 'vs User'} · {d.category}
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
    </div>
  )
}
