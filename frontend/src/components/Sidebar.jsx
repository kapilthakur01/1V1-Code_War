import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  FiHome, FiCode, FiMessageCircle, FiAward, FiUser,
  FiSettings, FiLogOut
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', label: 'Home', icon: FiHome },
  { to: '/matchmaking', label: 'Coding', icon: FiCode },
  { to: '/debate', label: 'Debate', icon: FiMessageCircle },
  { to: '/history', label: 'Leaderboard', icon: FiAward },
  { to: '/debate/profile', label: 'Profile', icon: FiUser },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const isActive = (path) => location.pathname === path

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FiCode size={18} className="text-white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-brand">CodeClash</span>
          <span className="sidebar-tagline">Code · Debate · Grow</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-nav-item ${isActive(to) ? 'active' : ''}`}
          >
            {isActive(to) && (
              <motion.div
                layoutId="sidebar-active"
                className="sidebar-nav-active-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon size={18} className="sidebar-nav-icon" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {/* Bottom Items */}
      <div className="sidebar-bottom">
        {user?.isAdmin && (
          <Link
            to="/admin/problems"
            className={`sidebar-nav-item ${isActive('/admin/problems') ? 'active' : ''}`}
          >
            <FiSettings size={18} className="sidebar-nav-icon" />
            <span>Settings</span>
          </Link>
        )}
        <button onClick={handleLogout} className="sidebar-nav-item sidebar-logout">
          <FiLogOut size={18} className="sidebar-nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
