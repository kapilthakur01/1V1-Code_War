import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import TopicSelector from '../../components/debate/TopicSelector'
import { FiUsers, FiArrowLeft, FiPlus, FiHash, FiArrowRight, FiThumbsUp, FiThumbsDown } from 'react-icons/fi'

export default function LiveDebateSetup() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('create') // create | join
  const [step, setStep] = useState(1) // 1: topic, 2: side, 3: waiting
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Custom')
  const [side, setSide] = useState('support')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [createdRoom, setCreatedRoom] = useState(null)

  const handleTopicSelect = ({ topic: t, category: c }) => {
    setTopic(t)
    setCategory(c)
    setStep(2)
  }

  const handleCreate = async () => {
    if (!topic) return
    setLoading(true)
    try {
      const res = await api.post('/debate-room/create', { topic, category, side })
      setCreatedRoom(res.data.room)
      setStep(3)
      toast.success('Room created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!roomCode.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/debate-room/join', { roomCode: roomCode.trim() })
      toast.success('Joined room!')
      navigate(`/debate/live/${res.data.room.roomCode}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join room')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (createdRoom?.roomCode) {
      navigator.clipboard.writeText(createdRoom.roomCode)
      toast.success('Room code copied!')
    }
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => {
            if (step > 1 && tab === 'create') setStep(step - 1)
            else navigate('/debate')
          }}
          className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1"
        >
          <FiArrowLeft size={14} /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary">
            <FiUsers size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">Live Debate</h1>
            <p className="text-text-muted text-sm">Debate with friends in real-time</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      {step === 1 && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              tab === 'create'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'bg-bg-secondary text-text-muted border border-border hover:border-primary/20'
            }`}
          >
            <FiPlus size={14} className="inline mr-1.5" /> Create Room
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              tab === 'join'
                ? 'bg-secondary/20 text-secondary border border-secondary/30'
                : 'bg-bg-secondary text-text-muted border border-border hover:border-secondary/20'
            }`}
          >
            <FiHash size={14} className="inline mr-1.5" /> Join Room
          </button>
        </div>
      )}

      {/* Create: Step 1 - Topic */}
      {tab === 'create' && step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <TopicSelector onSelect={handleTopicSelect} />
        </motion.div>
      )}

      {/* Create: Step 2 - Side */}
      {tab === 'create' && step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-5 mb-6">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Topic</span>
            <p className="text-lg font-bold text-text-primary mt-1">"{topic}"</p>
          </div>

          <h3 className="text-lg font-bold text-text-primary mb-4">Your Position</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setSide('support')}
              className={`glass-card p-5 text-center cursor-pointer transition-all ${
                side === 'support' ? 'border-success/60 bg-success/10' : 'hover:border-success/30'
              }`}
            >
              <FiThumbsUp size={24} className="text-success mx-auto mb-2" />
              <span className="text-sm font-bold text-text-primary">Support</span>
            </button>
            <button
              onClick={() => setSide('oppose')}
              className={`glass-card p-5 text-center cursor-pointer transition-all ${
                side === 'oppose' ? 'border-error/60 bg-error/10' : 'hover:border-error/30'
              }`}
            >
              <FiThumbsDown size={24} className="text-error mx-auto mb-2" />
              <span className="text-sm font-bold text-text-primary">Oppose</span>
            </button>
          </div>

          <button onClick={handleCreate} disabled={loading} className="btn-primary w-full py-4">
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </motion.div>
      )}

      {/* Create: Step 3 - Room Created / Waiting */}
      {tab === 'create' && step === 3 && createdRoom && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="glass-card p-8 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-success/15 border border-success/30 flex items-center justify-center text-success mx-auto mb-4">
              <FiUsers size={28} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">Room Created!</h3>
            <p className="text-sm text-text-muted mb-6">Share this code with your opponent:</p>

            <div
              onClick={copyCode}
              className="inline-flex items-center gap-3 px-8 py-4 bg-bg-secondary border-2 border-dashed border-primary/40 rounded-2xl cursor-pointer hover:border-primary/70 transition-colors"
            >
              <FiHash size={18} className="text-primary" />
              <span className="text-3xl font-black text-text-primary tracking-[0.3em]">
                {createdRoom.roomCode}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-2">Click to copy</p>

            <div className="mt-6 glass-card p-4 text-left">
              <p className="text-xs text-text-muted mb-1">Topic: <span className="text-text-primary font-medium">{createdRoom.topic}</span></p>
              <p className="text-xs text-text-muted">Your side: <span className={side === 'support' ? 'text-success' : 'text-error'}>{side}</span></p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/debate/live/${createdRoom.roomCode}`)}
            className="btn-primary py-3 px-8"
          >
            Enter Room <FiArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {/* Join */}
      {tab === 'join' && step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="glass-card p-8 text-center">
            <FiHash size={32} className="text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Enter Room Code</h3>
            <p className="text-sm text-text-muted mb-6">Ask your opponent for their 6-character room code</p>

            <input
              type="text"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="XXXXXX"
              maxLength={6}
              className="input-field text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase max-w-xs mx-auto mb-6"
            />

            <button
              onClick={handleJoin}
              disabled={roomCode.length < 6 || loading}
              className="btn-primary w-full max-w-xs mx-auto py-3"
            >
              {loading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
