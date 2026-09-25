import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import {
  FiHome, FiCode, FiMessageSquare, FiAward, FiUser,
  FiBell, FiSearch, FiChevronDown, FiLogOut, FiClock
} from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'

const topNavLinks = [
  { to: '/dashboard', label: 'Home', icon: FiHome },
  { to: '/matchmaking', label: 'Coding', icon: FiCode },
  { to: '/debate', label: 'Debate', icon: FiMessageSquare },
  { to: '/history', label: 'Leaderboard', icon: FiAward },
  { to: '/debate/profile', label: 'Profile', icon: FiUser },
]

export default function Topbar() {
  const { user, logout } = useAuth()
  const { connected } = useSocket()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const initials = user?.username ? user.username[0].toUpperCase() : 'U'

  return (
    <header className="topbar">
      <nav className="topbar-nav">
        {topNavLinks.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="topbar-nav-link">
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <FiSearch size={14} className="topbar-search-icon" />
          <input type="text" placeholder="Search..." className="topbar-search-input" />
        </div>

        {/* Notifications */}
        <button className="topbar-icon-btn">
          <FiBell size={18} />
          <span className="topbar-notif-dot" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="topbar-profile-btn"
          >
            <div className="topbar-avatar">{initials}</div>
            <div className="topbar-profile-info">
              <span className="topbar-username">{user?.username}</span>
              <span className="topbar-rank">Beginner</span>
            </div>
            <FiChevronDown size={14} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="topbar-dropdown"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="topbar-dropdown-header">
                  <p className="font-semibold text-gray-800 text-sm">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="topbar-dropdown-item">
                  <FiUser size={14} /> My Dashboard
                </Link>
                <Link to="/history" onClick={() => setProfileOpen(false)} className="topbar-dropdown-item">
                  <FiClock size={14} /> Battle History
                </Link>
                <hr className="border-gray-100 my-1" />
                <button
                  onClick={() => { setProfileOpen(false); handleLogout() }}
                  className="topbar-dropdown-item topbar-dropdown-logout"
                >
                  <FiLogOut size={14} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
