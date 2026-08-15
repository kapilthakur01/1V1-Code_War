import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { io } from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import DebateMessage from '../../components/debate/DebateMessage'
import ArgumentAnalysis from '../../components/debate/ArgumentAnalysis'
import FallacyAlert from '../../components/debate/FallacyAlert'
import DebateTimer from '../../components/debate/DebateTimer'
import CameraFeed from '../../components/debate/CameraFeed'
import QuitConfirmModal from '../../components/debate/QuitConfirmModal'
import { FiSend, FiArrowLeft, FiUsers, FiCheck, FiCopy, FiLogOut } from 'react-icons/fi'

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || ''

export default function LiveDebateRoom() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState(null)
  const [debateId, setDebateId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [opponentTyping, setOpponentTyping] = useState(false)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [allFallacies, setAllFallacies] = useState([])
  const [debateStarted, setDebateStarted] = useState(false)
  const [currentRound, setCurrentRound] = useState(1)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const [quitting, setQuitting] = useState(false)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    loadRoom()
    connectSocket()
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [roomCode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadRoom = async () => {
    try {
      const res = await api.get(`/debate-room/${roomCode}`)
      setRoom(res.data.room)
      if (res.data.room.debateId) {
        setDebateId(res.data.room.debateId)
        setDebateStarted(true)
        // Load existing messages
        const debateRes = await api.get(`/debate/${res.data.room.debateId}`)
        setMessages(debateRes.data.arguments || [])
      }
    } catch (err) {
      toast.error('Room not found')
      navigate('/debate/live-setup')
    } finally {
      setLoading(false)
    }
  }

  const connectSocket = () => {
    const token = localStorage.getItem('cc_token')
    const socket = io(`${SOCKET_URL}/debate`, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      socket.emit('debate:join-room', {
        roomCode: roomCode.toUpperCase(),
        userId: user._id,
        username: user.username,
      })
    })

    socket.on('debate:room-update', ({ room: updatedRoom }) => {
      setRoom(updatedRoom)
    })

    socket.on('debate:user-joined', ({ username }) => {
      toast.success(`${username} joined the room!`)
    })

    socket.on('debate:started', ({ debateId: id, room: updatedRoom }) => {
      setDebateId(id)
      setDebateStarted(true)
      setRoom(updatedRoom)
      toast.success('Debate started!')
    })

    socket.on('debate:new-message', ({ argument }) => {
      setMessages(prev => [...prev, argument])
      if (argument.analysis) {
        setLastAnalysis(argument.analysis)
        if (argument.analysis.fallacies?.length) {
          setAllFallacies(prev => [...prev, ...argument.analysis.fallacies.map(f => ({ ...f, from: argument.speakerName }))])
        }
      }
    })

    socket.on('debate:moderator-message', ({ argument }) => {
      setMessages(prev => [...prev, argument])
    })

    socket.on('debate:user-typing', ({ username, isTyping }) => {
      setOpponentTyping(isTyping)
    })

    socket.on('debate:round-changed', ({ currentRound: r }) => {
      setCurrentRound(r)
      toast(`Round ${r} started!`, { icon: '🔔' })
    })

    socket.on('debate:ended', ({ debateId: id }) => {
      toast.success('Debate ended!')
      navigate(`/debate/result/${id}`)
    })

    socket.on('debate:user-disconnected', ({ username }) => {
      toast.error(`${username} disconnected`)
    })

    socketRef.current = socket
  }

  const handleReady = () => {
    socketRef.current?.emit('debate:ready', {
      roomCode: roomCode.toUpperCase(),
      userId: user._id,
    })
  }

  const handleSend = () => {
    if (!input.trim() || sending || !debateId) return
    setSending(true)

    const participant = room?.participants?.find(p => p.userId === user._id)

    socketRef.current?.emit('debate:send-message', {
      roomCode: roomCode.toUpperCase(),
      debateId,
      userId: user._id,
      username: user.username,
      message: input.trim(),
      side: participant?.side || 'support',
    })

    setInput('')
    setSending(false)

    // Stop typing indicator
    socketRef.current?.emit('debate:typing', {
      roomCode: roomCode.toUpperCase(),
      userId: user._id,
      username: user.username,
      isTyping: false,
    })
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    socketRef.current?.emit('debate:typing', {
      roomCode: roomCode.toUpperCase(),
      userId: user._id,
      username: user.username,
      isTyping: true,
    })

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit('debate:typing', {
        roomCode: roomCode.toUpperCase(),
        userId: user._id,
        username: user.username,
        isTyping: false,
      })
    }, 2000)
  }

  const handleEnd = () => {
    setQuitting(true)
    setShowQuitModal(false)
    socketRef.current?.emit('debate:end', {
      roomCode: roomCode.toUpperCase(),
      debateId,
    })
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    toast.success('Room code copied!')
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!room) return null

  const myParticipant = room.participants?.find(p => p.userId === user._id)
  const opponent = room.participants?.find(p => p.userId !== user._id)

  // Waiting Room
  if (!debateStarted) {
    return (
      <div className="page-container max-w-2xl mx-auto">
        <button onClick={() => navigate('/debate/live-setup')} className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1">
          <FiArrowLeft size={14} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mx-auto mb-4">
            <FiUsers size={28} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">Waiting Room</h2>

          <div onClick={copyRoomCode} className="inline-flex items-center gap-2 px-6 py-3 bg-bg-secondary border border-border rounded-xl cursor-pointer hover:border-secondary/40 transition-colors mb-6">
            <span className="text-2xl font-black tracking-[0.2em] text-text-primary">{roomCode}</span>
            <FiCopy size={16} className="text-text-muted" />
          </div>

          <div className="glass-card p-4 text-left mb-6">
            <p className="text-xs text-text-muted mb-1">Topic: <span className="text-text-primary font-medium">{room.topic}</span></p>
          </div>

          {/* Participants */}
          <div className="space-y-3 mb-6">
            {room.participants.map(p => (
              <div key={p.userId} className="flex items-center justify-between glass-card p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    {p.username[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-text-primary">{p.username}</span>
                    <span className={`text-xs ml-2 ${p.side === 'support' ? 'text-success' : 'text-error'}`}>({p.side})</span>
                  </div>
                </div>
                <span className={`badge ${p.ready ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                  {p.ready ? 'Ready' : 'Not Ready'}
                </span>
              </div>
            ))}

            {room.participants.length < 2 && (
              <div className="glass-card p-3 border-dashed flex items-center justify-center text-text-muted text-sm">
                Waiting for opponent to join...
              </div>
            )}
          </div>

          <button
            onClick={handleReady}
            disabled={room.participants.length < 2}
            className={`btn-primary w-full py-3 ${myParticipant?.ready ? 'opacity-60' : ''}`}
          >
            <FiCheck size={16} />
            {myParticipant?.ready ? 'Ready! Waiting for opponent...' : 'Ready Up'}
          </button>
        </motion.div>
      </div>
    )
  }

  // Active Debate
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top Bar */}
      <div className="border-b border-border bg-bg-primary/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-text-primary truncate">"{room.topic}"</h2>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>vs <span className="text-text-secondary font-medium">{opponent?.username || '...'}</span></span>
                <span>·</span>
                <span>Round {currentRound}/{room.rounds?.total || 5}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DebateTimer seconds={room.rounds?.timePerRound || 180} running={true} />
            <button
              onClick={() => setShowQuitModal(true)}
              disabled={quitting}
              className="btn-danger text-xs py-2 px-3"
              id="quit-live-debate-btn"
            >
              {quitting
                ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <FiLogOut size={14} />}
              Quit
            </button>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      <QuitConfirmModal
        isOpen={showQuitModal}
        onConfirm={handleEnd}
        onCancel={() => setShowQuitModal(false)}
        loading={quitting}
      />

      {/* Camera feeds - compact strip below top bar */}
      <div className="border-b border-border bg-bg-primary/60 px-4 py-3">
        <div className="max-w-5xl mx-auto">
          <CameraFeed
            userName={user?.username || 'You'}
            opponentName={opponent?.username || 'Opponent'}
            isAI={false}
            opponentOnline={!!opponent}
            side={myParticipant?.side || 'support'}
            opponentSide={opponent
              ? (room.participants?.find(p => p.userId !== user._id)?.side || 'oppose')
              : 'oppose'
            }
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map(arg => (
            <DebateMessage key={arg._id} argument={arg} currentUserId={user._id} />
          ))}
          {opponentTyping && (
            <div className="flex items-center gap-2 text-text-muted text-xs mb-4">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              {opponent?.username} is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-bg-primary/80 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <textarea
            value={input}
            onChange={handleTyping}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Type your argument..."
            rows={1}
            className="input-field flex-1 resize-none py-3"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="btn-primary p-3 rounded-xl">
            <FiSend size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
