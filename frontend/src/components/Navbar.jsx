import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import { FiMenu, FiX, FiUser, FiLogOut, FiClock, FiBookOpen, FiSettings, FiMessageCircle } from 'react-icons/fi'
import { FiSword } from './SwordIcon'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { connected } = useSocket()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: <FiUser size={16} /> },
        { to: '/matchmaking', label: 'Battle', icon: <FiSword size={16} /> },
        { to: '/debate', label: 'Debate', icon: <FiMessageCircle size={16} /> },
        { to: '/history', label: 'History', icon: <FiClock size={16} /> },
        ...(user.isAdmin ? [{ to: '/admin/problems', label: 'Admin', icon: <FiSettings size={16} /> }] : []),
      ]
    : []

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-bg-primary/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-purple transition-all duration-300">
              <FiSword size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg">
              <span className="text-gradient">Code</span>
              <span className="text-text-primary">Clash</span>
              <span className="text-xs text-text-muted ml-1 font-normal">1v1</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Connection status */}
            {user && (
              <div className="hidden sm:flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-error'}`} />
                <span className="text-xs text-text-muted">{connected ? 'Online' : 'Offline'}</span>
              </div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-bg-card border border-border hover:border-primary/40 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    {user.username[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-text-primary hidden sm:block">{user.username}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 glass-card py-2 z-50"
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-border mb-1">
                        <p className="text-sm font-semibold text-text-primary">{user.username}</p>
                        <p className="text-xs text-text-muted">{user.email}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        <FiUser size={14} /> My Dashboard
                      </Link>
                      <Link
                        to="/history"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        <FiClock size={14} /> Battle History
                      </Link>
                      <hr className="border-border my-1" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                      >
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">Sign up</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden btn-ghost p-2"
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {menuOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border py-3 space-y-1"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.to)
                      ? 'bg-primary/20 text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-error"
              >
                <FiLogOut size={14} /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
