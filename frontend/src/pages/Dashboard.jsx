import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import {
  FiCode, FiMessageCircle, FiTrendingUp, FiShield,
  FiArrowRight, FiEdit3, FiTarget, FiChevronRight,
  FiClock, FiAward, FiZap, FiUser, FiPlay
} from 'react-icons/fi'

// ─── helpers ────────────────────────────────────────────────────────────────

function Avatar({ name = 'U', size = 40, className = '' }) {
  const initials = name[0].toUpperCase()
  return (
    <div
      className={`dash-avatar ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

function DonutChart({ pct = 75, color = '#4F46E5', size = 110 }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#EEF2FF" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1E293B">
        {pct}%
      </text>
    </svg>
  )
}

const featureCards = [
  {
    icon: FiCode, label: 'Coding Battles', desc: 'Solve problems, beat opponents',
    color: '#4F46E5', bg: 'rgba(79,70,229,0.12)', to: '/matchmaking'
  },
  {
    icon: FiMessageCircle, label: 'AI Debate Arena', desc: 'Speak, argue, get evaluated',
    color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', to: '/debate'
  },
  {
    icon: FiTrendingUp, label: 'Performance Insights', desc: 'Track your growth',
    color: '#10B981', bg: 'rgba(16,185,129,0.12)', to: '/history'
  },
  {
    icon: FiShield, label: 'Secure & Fair', desc: 'Isolated execution environment',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', to: '/dashboard'
  },
]

const recentActivities = [
  { type: 'win', label: 'Coding Battle – Won', sub: 'vs. AryanSharma', score: 850, time: '2 hours ago', color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: FiCode },
  { type: 'done', label: 'Debate – Completed', sub: 'Topic: AI and Human Future', score: 760, time: '5 hours ago', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', icon: FiMessageCircle },
  { type: 'loss', label: 'Coding Battle – Lost', sub: 'vs. Rohit23', score: 420, time: '1 day ago', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: FiCode },
  { type: 'join', label: 'Joined Public Matchmaking', sub: 'Coding Battle', score: null, time: '1 day ago', color: '#4F46E5', bg: 'rgba(79,70,229,0.12)', icon: FiUser },
  { type: 'join', label: 'Joined Debate Arena', sub: 'Topic: Education vs. Technology', score: null, time: '2 days ago', color: '#7C3AED', bg: 'rgba(124,58,237,0.12)', icon: FiMessageCircle },
]

const upcomingMatches = [
  { label: 'Coding Battle', sub: 'Public Matchmaking', badge: 'Starts in 12 min', badgeColor: '#4F46E5', icon: FiCode },
  { label: 'Debate Arena', sub: 'Topic: Climate Change', badge: 'Starts in 1 hr', badgeColor: '#7C3AED', icon: FiMessageCircle },
]

// ─── main ────────────────────────────────────────────────────────────────────

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

  const wins      = user?.stats?.wins    || 0
  const battles   = user?.stats?.battles || 0
  const winStreak = user?.stats?.winStreak || 0
  const winRate   = battles > 0 ? Math.round((wins / battles) * 100) : 75
  const debateWinRate = 60 // placeholder until debate stats API exists

  return (
    <div className="dash-page">
      {/* ── Three-column grid ── */}
      <div className="dash-grid">

        {/* ══════ LEFT + CENTRE ══════ */}
        <div className="dash-main-col">

          {/* ── Hero ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="dash-hero"
          >
            <div className="dash-hero-text">
              <h1 className="dash-hero-title">
                Sharpen Your Skills,<br />
                <span className="dash-hero-gradient">Compete. Debate. Grow.</span>
              </h1>
              <p className="dash-hero-desc">
                Join real-time coding battles and intelligent debates.<br />
                Get AI-powered feedback, track your progress and<br />
                become a better version of yourself.
              </p>
              <div className="dash-hero-actions">
                <Link to="/matchmaking" className="dash-btn-primary">
                  <FiPlay size={15} /> Start Playing
                </Link>
                <Link to="/history" className="dash-btn-outline">
                  Learn More
                </Link>
              </div>
            </div>
            {/* Hero illustration */}
            <div className="dash-hero-illustration">
              <div className="dash-hero-vs">
                <div className="dash-hero-coder dash-hero-coder-left">
                  <div className="dash-hero-code-icon">
                    <FiCode size={28} className="text-white" />
                  </div>
                  <div className="dash-hero-person" style={{ background: 'linear-gradient(135deg,#4F46E5,#7C3AED)' }} />
                </div>
                <div className="dash-vs-badge">VS</div>
                <div className="dash-hero-coder dash-hero-coder-right">
                  <div className="dash-hero-chat-icon">
                    <FiMessageCircle size={28} className="text-white" />
                  </div>
                  <div className="dash-hero-person" style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Feature cards ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="dash-feature-row"
          >
            {featureCards.map((card) => (
              <Link key={card.label} to={card.to} className="dash-feature-card">
                <div className="dash-feature-icon" style={{ background: card.bg }}>
                  <card.icon size={22} style={{ color: card.color }} />
                </div>
                <div className="dash-feature-label">{card.label}</div>
                <div className="dash-feature-desc">{card.desc}</div>
                <div className="dash-feature-arrow" style={{ color: card.color }}>
                  <FiArrowRight size={16} />
                </div>
              </Link>
            ))}
          </motion.div>

          {/* ── Bottom three panels ── */}
          <div className="dash-bottom-row">

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="dash-card dash-recent"
            >
              <div className="dash-card-header">
                <span className="dash-card-title">Recent Activity</span>
                <Link to="/history" className="dash-view-all">View All</Link>
              </div>
              <div className="dash-activity-list">
                {(history.length > 0 ? history.slice(0, 5).map((b, i) => ({
                  type: b.outcome === 'Win' ? 'win' : b.outcome === 'Loss' ? 'loss' : 'done',
                  label: `Coding Battle – ${b.outcome}`,
                  sub: `vs. ${b.opponentResult?.username || '?'}`,
                  score: b.myResult?.score ?? null,
                  time: 'Recently',
                  color: b.outcome === 'Win' ? '#10B981' : b.outcome === 'Loss' ? '#EF4444' : '#4F46E5',
                  bg: b.outcome === 'Win' ? 'rgba(16,185,129,0.12)' : b.outcome === 'Loss' ? 'rgba(239,68,68,0.12)' : 'rgba(79,70,229,0.12)',
                  icon: FiCode,
                })) : recentActivities).map((act, i) => (
                  <div key={i} className="dash-activity-item">
                    <div className="dash-activity-icon" style={{ background: act.bg }}>
                      <act.icon size={15} style={{ color: act.color }} />
                    </div>
                    <div className="dash-activity-info">
                      <span className="dash-activity-label" style={{ color: act.color }}>{act.label}</span>
                      <span className="dash-activity-sub">{act.sub}</span>
                    </div>
                    <div className="dash-activity-meta">
                      {act.score !== null && <span className="dash-activity-score">Score: {act.score}</span>}
                      <span className="dash-activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="dash-card dash-perf"
            >
              <div className="dash-card-header">
                <span className="dash-card-title">Your Performance</span>
                <span className="dash-perf-period">Last 7 Days ▾</span>
              </div>
              <div className="dash-perf-charts">
                <div className="dash-perf-chart-item">
                  <DonutChart pct={winRate} color="#4F46E5" />
                  <div className="dash-perf-chart-label">
                    <strong>Coding Win Rate</strong>
                    <span>{wins} / {battles} Matches Won</span>
                  </div>
                </div>
                <div className="dash-perf-chart-item">
                  <DonutChart pct={debateWinRate} color="#A855F7" />
                  <div className="dash-perf-chart-label">
                    <strong>Debate Win Rate</strong>
                    <span>{Math.round(battles * 0.6)} / {battles} Debates Won</span>
                  </div>
                </div>
              </div>
              <div className="dash-perf-stats">
                <div className="dash-perf-stat">
                  <span className="dash-perf-stat-val">{user?.stats?.avgScore || 720}</span>
                  <span className="dash-perf-stat-lbl">Avg. Score</span>
                </div>
                <div className="dash-perf-stat">
                  <span className="dash-perf-stat-val">{winStreak} days</span>
                  <span className="dash-perf-stat-lbl">Streak</span>
                </div>
                <div className="dash-perf-stat">
                  <span className="dash-perf-stat-val">{battles}</span>
                  <span className="dash-perf-stat-lbl">Total Battles</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ══════ RIGHT SIDEBAR ══════ */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="dash-right-col"
        >
          {/* Profile card */}
          <div className="dash-profile-card">
            <div className="dash-profile-top">
              <Avatar name={user?.username || 'U'} size={48} />
              <div className="dash-profile-info">
                <span className="dash-profile-name">{user?.username || 'User'}</span>
                <span className="dash-profile-rank">Beginner</span>
              </div>
              <button className="dash-profile-edit"><FiEdit3 size={14} /></button>
            </div>
            <div className="dash-profile-stats">
              <div className="dash-profile-stat">
                <span className="dash-profile-stat-val">{battles}</span>
                <span className="dash-profile-stat-lbl">Battles</span>
              </div>
              <div className="dash-profile-divider" />
              <div className="dash-profile-stat">
                <span className="dash-profile-stat-val">3</span>
                <span className="dash-profile-stat-lbl">Debates</span>
              </div>
              <div className="dash-profile-divider" />
              <div className="dash-profile-stat">
                <span className="dash-profile-stat-val">{winStreak}</span>
                <span className="dash-profile-stat-lbl">Days Streak</span>
              </div>
            </div>
            <div className="dash-profile-quote">
              <span className="dash-quote-icon">❝</span>
              <span>"Small steps every day lead to big results."</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dash-card dash-quick-actions">
            <div className="dash-card-title" style={{ marginBottom: 14 }}>Quick Actions</div>
            <Link to="/matchmaking" className="dash-quick-btn dash-quick-primary">
              <FiCode size={16} /> Join Coding Battle
            </Link>
            <Link to="/debate" className="dash-quick-btn dash-quick-debate">
              <FiMessageCircle size={16} /> Join Debate Arena
            </Link>
            <Link to="/matchmaking" className="dash-quick-btn dash-quick-private">
              <FiUser size={16} /> Create Private Room
            </Link>
          </div>

          {/* Upcoming Matches */}
          <div className="dash-card">
            <div className="dash-card-header" style={{ marginBottom: 14 }}>
              <span className="dash-card-title">Upcoming Matches</span>
              <Link to="/matchmaking" className="dash-view-all">View All</Link>
            </div>
            {upcomingMatches.map((m, i) => (
              <div key={i} className="dash-upcoming-item">
                <div className="dash-upcoming-icon" style={{ background: 'rgba(79,70,229,0.12)' }}>
                  <m.icon size={16} style={{ color: m.badgeColor }} />
                </div>
                <div className="dash-upcoming-info">
                  <span className="dash-upcoming-label">{m.label}</span>
                  <span className="dash-upcoming-sub">{m.sub}</span>
                </div>
                <div className="dash-upcoming-badge" style={{ background: 'rgba(79,70,229,0.1)', color: m.badgeColor }}>
                  {m.badge}
                </div>
                <FiChevronRight size={16} className="dash-upcoming-arrow" />
              </div>
            ))}
          </div>

          {/* Journey Matters */}
          <div className="dash-journey-card">
            <div className="dash-journey-icon">
              <FiTarget size={22} style={{ color: '#4F46E5' }} />
            </div>
            <div className="dash-journey-text">
              <span className="dash-journey-title">Your Journey Matters</span>
              <span className="dash-journey-sub">Better skills. Higher scores. A smarter you.</span>
            </div>
            <Link to="/history" className="dash-journey-btn">
              View Progress
            </Link>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
