import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import api from '../api/axios'
import { FiSearch, FiLock, FiPlus, FiUsers, FiCopy, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi'
import { FiSword } from '../components/SwordIcon'
import toast from 'react-hot-toast'

const SEARCH_TIMEOUT_MS = 2 * 60 * 1000 // 2 minutes
const POLL_INTERVAL_MS = 3000

export default function Matchmaking() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()

  const [mode, setMode] = useState(null) // 'searching' | 'creating' | 'joining'
  const [joinCode, setJoinCode] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchTime, setSearchTime] = useState(0) // elapsed seconds
  const [copied, setCopied] = useState(false)
  const [timedOut, setTimedOut] = useState(false)

  const searchTimerRef = useRef(null)   // counts elapsed seconds
  const pollRef = useRef(null)          // polling interval
  const timeoutRef = useRef(null)       // 2-minute hard cutoff
  const isSearchingRef = useRef(false)  // guards against stale closures

  // ── Cleanup helper ─────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    clearInterval(searchTimerRef.current)
    clearInterval(pollRef.current)
    clearTimeout(timeoutRef.current)
  }, [])

  // ── Cancel search (also calls backend to remove from queue) ─
  const cancelSearch = useCallback(async (skipApiCall = false) => {
    isSearchingRef.current = false
    clearAllTimers()
    setSearching(false)
    setMode(null)
    setSearchTime(0)
    setTimedOut(false)
    if (!skipApiCall) {
      try { await api.post('/match/cancel') } catch (_) {}
    }
  }, [clearAllTimers])

  // ── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => {
    return () => {
      clearAllTimers()
      if (isSearchingRef.current) {
        api.post('/match/cancel').catch(() => {})
      }
    }
  }, [clearAllTimers])

  // ── Handle socket events ────────────────────────────────────
  useEffect(() => {
    if (!socket) return

    const handleMatched = (data) => {
      if (!isSearchingRef.current) return
      isSearchingRef.current = false
      clearAllTimers()
      toast.success(`⚔️ Matched! vs ${data.opponentUsername}`, { duration: 3000 })
      navigate(`/room/${data.roomId}`)
    }

    const handleMatchTimeout = ({ message }) => {
      if (!isSearchingRef.current) return
      isSearchingRef.current = false
      clearAllTimers()
      setSearching(false)
      setTimedOut(true)
      setMode('timeout')
      toast.error(message || 'No opponent found. Please try again.', { duration: 5000 })
    }

    socket.on('matched', handleMatched)
    socket.on('match-timeout', handleMatchTimeout)

    return () => {
      socket.off('matched', handleMatched)
      socket.off('match-timeout', handleMatchTimeout)
    }
  }, [socket, navigate, clearAllTimers])

  // ── Start matchmaking search ────────────────────────────────
  const startSearch = async () => {
    if (!socket?.id) {
      toast.error('Not connected to server. Please refresh the page.')
      return
    }

    setSearching(true)
    setMode('searching')
    setSearchTime(0)
    setTimedOut(false)
    isSearchingRef.current = true

    // Elapsed seconds counter
    searchTimerRef.current = setInterval(() => {
      setSearchTime(t => t + 1)
    }, 1000)

    // Hard 2-minute frontend timeout (backend also times out, this is a fallback)
    timeoutRef.current = setTimeout(async () => {
      if (!isSearchingRef.current) return
      isSearchingRef.current = false
      clearInterval(searchTimerRef.current)
      clearInterval(pollRef.current)
      setSearching(false)
      setTimedOut(true)
      setMode('timeout')
      try { await api.post('/match/cancel') } catch (_) {}
      toast.error('No opponent found within 2 minutes. Please try again.', { duration: 5000 })
    }, SEARCH_TIMEOUT_MS)

    try {
      const res = await api.post('/match/find', { socketId: socket.id })

      if (!isSearchingRef.current) return // was cancelled

      if (res.data.matched) {
        // Immediate match (REST response) — also handled by socket 'matched' event
        // But handle here too for redundancy
        isSearchingRef.current = false
        clearAllTimers()
        toast.success(`⚔️ Matched! vs ${res.data.opponentUsername}`, { duration: 3000 })
        navigate(`/room/${res.data.roomId}`)
      } else {
        // Now just wait — socket 'matched' or 'match-timeout' will fire
        // Also poll as fallback every 3 seconds
        pollRef.current = setInterval(async () => {
          if (!isSearchingRef.current) {
            clearInterval(pollRef.current)
            return
          }
          try {
            const r = await api.post('/match/find', { socketId: socket.id })
            if (!isSearchingRef.current) return
            if (r.data.matched) {
              isSearchingRef.current = false
              clearAllTimers()
              toast.success(`⚔️ Matched! vs ${r.data.opponentUsername}`, { duration: 3000 })
              navigate(`/room/${r.data.roomId}`)
            }
          } catch (_) {}
        }, POLL_INTERVAL_MS)
      }
    } catch (err) {
      if (!isSearchingRef.current) return
      toast.error(err.response?.data?.message || 'Search failed')
      cancelSearch(true)
    }
  }

  const createPrivate = async () => {
    setMode('creating')
    try {
      const res = await api.post('/match/create-private')
      navigate(`/room/${res.data.roomId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
      setMode(null)
    }
  }

  const joinPrivate = async (e) => {
    e.preventDefault()
    if (!joinCode.trim()) return toast.error('Enter a room code')
    try {
      const res = await api.post('/match/join-private', { roomCode: joinCode.toUpperCase() })
      toast.success('Joining room...')
      navigate(`/room/${res.data.roomId}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join room')
    }
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  // Progress percentage (out of 2 minutes)
  const progressPct = Math.min(100, (searchTime / 120) * 100)
  const timeRemaining = Math.max(0, 120 - searchTime)

  return (
    <div className="page-container max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Find a <span className="text-gradient">Battle</span>
        </h1>
        <p className="text-text-secondary">Choose your mode and face an opponent</p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── Searching state ── */}
        {mode === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 text-center"
          >
            {/* Radar animation */}
            <div className="relative w-28 h-28 mx-auto mb-7">
              <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDuration: '1.5s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
              <div className="relative w-28 h-28 rounded-full bg-primary/10 border border-primary/40 flex items-center justify-center">
                <FiSearch size={38} className="text-primary animate-pulse" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-1">Finding opponent…</h2>
            <p className="text-text-secondary mb-5 text-sm">Searching for a worthy challenger</p>

            {/* Time elapsed and remaining */}
            <div className="flex items-center justify-center gap-6 mb-5">
              <div className="text-center">
                <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Elapsed</p>
                <p className="text-4xl font-mono font-black text-primary">{formatTime(searchTime)}</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-xs text-text-muted mb-1 uppercase tracking-wider">Timeout in</p>
                <p className={`text-4xl font-mono font-black ${timeRemaining <= 30 ? 'text-error' : 'text-text-secondary'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>

            {/* Progress bar (fills as time runs out) */}
            <div className="w-full max-w-sm mx-auto h-2 bg-bg-secondary rounded-full overflow-hidden mb-7">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full"
                style={{
                  background: progressPct > 80
                    ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                    : progressPct > 50
                    ? 'linear-gradient(90deg, #F59E0B, #D97706)'
                    : 'linear-gradient(90deg, #7C3AED, #06B6D4)'
                }}
              />
            </div>

            {/* Waiting dots */}
            <p className="text-text-muted text-xs mb-6">
              You will be matched automatically once an opponent joins
            </p>

            <button
              onClick={() => cancelSearch(false)}
              className="btn-danger py-2.5 px-8"
            >
              <FiX size={16} /> Cancel Search
            </button>
          </motion.div>
        )}

        {/* ── Timed out state ── */}
        {mode === 'timeout' && (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 text-center border border-error/20"
          >
            <div className="w-20 h-20 rounded-full bg-error/10 border border-error/30 flex items-center justify-center mx-auto mb-5">
              <FiAlertCircle size={36} className="text-error" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">No Opponent Found</h2>
            <p className="text-text-secondary mb-7 text-sm max-w-xs mx-auto">
              We couldn't find a match within 2 minutes. The queue may be empty — try again soon!
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={startSearch}
                className="btn-primary py-2.5 px-8"
              >
                <FiSearch size={16} /> Try Again
              </button>
              <button
                onClick={() => setMode(null)}
                className="btn-ghost py-2.5 px-6"
              >
                Back
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Default options ── */}
        {!mode && (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Public matchmaking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-8 flex flex-col items-center text-center gap-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <FiUsers size={28} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-2">Public Match</h2>
                <p className="text-text-secondary text-sm">Join the matchmaking queue and get paired with a random opponent. Waits up to 2 minutes.</p>
              </div>
              <button id="find-battle-btn" onClick={startSearch} className="btn-primary w-full py-3">
                <FiSearch size={16} /> Find Battle
              </button>
            </motion.div>

            {/* Private room */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-8 flex flex-col gap-5"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                  <FiLock size={28} className="text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text-primary mb-2">Private Room</h2>
                  <p className="text-text-secondary text-sm">Create a private room or join one with a code.</p>
                </div>
              </div>

              <button onClick={createPrivate} className="btn-secondary w-full py-3">
                <FiPlus size={16} /> Create Room
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center"><span className="bg-bg-card px-3 text-xs text-text-muted">or join</span></div>
              </div>

              <form onSubmit={joinPrivate} className="flex gap-2">
                <input
                  type="text"
                  id="room-code-input"
                  className="input-field flex-1 uppercase font-mono tracking-widest"
                  placeholder="ROOM CODE"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={8}
                />
                <button type="submit" className="btn-primary py-3 px-4">
                  Join
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Battle Rules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-text-secondary mb-3 uppercase tracking-wider">Battle Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            ['🏆', 'First Accepted submission wins'],
            ['⚡', '30-minute synchronized timer'],
            ['💻', 'C++17 and Java 17 supported'],
            ['🔒', 'Code runs in isolated Docker containers'],
            ['📊', 'If tied — more test cases passed wins'],
            ['⏱️', '2-minute matchmaking window'],
          ].map(([icon, text]) => (
            <div key={text} className="flex items-center gap-2 text-sm text-text-muted">
              <span>{icon}</span> {text}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
