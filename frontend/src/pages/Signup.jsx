import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { FiSword } from '../components/SwordIcon'
import toast from 'react-hot-toast'

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const passwordStrength = () => {
    const p = form.password
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^a-zA-Z0-9]/.test(p)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColor = ['', 'bg-error', 'bg-warning', 'bg-yellow-400', 'bg-success', 'bg-success']
  const strength = passwordStrength()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) return toast.error('All fields are required')
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      await signup(form.username, form.email, form.password)
      toast.success('Account created! Welcome to CodeClash!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 relative">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary items-center justify-center mb-4 shadow-glow-purple">
            <FiSword size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Join CodeClash</h1>
          <p className="text-text-secondary">Create your account and start battling</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="text"
                  className="input-field pl-10"
                  placeholder="coolcoder123"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  maxLength={20}
                  required
                />
              </div>
              <p className="text-xs text-text-muted mt-1">Letters, numbers, underscore only. 3–20 chars.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="email"
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-10 pr-10"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor[strength] : 'bg-bg-hover'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-1">{strengthLabel[strength]}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input
                  type="password"
                  className={`input-field pl-10 pr-10 ${
                    form.confirm && form.confirm !== form.password ? 'border-error/50' : ''
                  }`}
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                />
                {form.confirm && form.confirm === form.password && (
                  <FiCheck className="absolute right-3.5 top-1/2 -translate-y-1/2 text-success" size={16} />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
