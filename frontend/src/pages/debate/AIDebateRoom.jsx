import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import DebateMessage from '../../components/debate/DebateMessage'
import ArgumentAnalysis from '../../components/debate/ArgumentAnalysis'
import FallacyAlert from '../../components/debate/FallacyAlert'
import DebateTimer from '../../components/debate/DebateTimer'
import VoiceInput from '../../components/debate/VoiceInput'
import CameraFeed from '../../components/debate/CameraFeed'
import QuitConfirmModal from '../../components/debate/QuitConfirmModal'
import { FiSend, FiArrowLeft, FiChevronDown, FiChevronUp, FiCpu, FiLogOut } from 'react-icons/fi'

export default function AIDebateRoom() {
  const { debateId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [debate, setDebate] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAnalysis, setShowAnalysis] = useState(true)
  const [lastAnalysis, setLastAnalysis] = useState(null)
  const [allFallacies, setAllFallacies] = useState([])
  const [ending, setEnding] = useState(false)
  const [showQuitModal, setShowQuitModal] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadDebate()
  }, [debateId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadDebate = async () => {
    try {
      const res = await api.get(`/debate/${debateId}`)
      setDebate(res.data.debate)
      setMessages(res.data.arguments || [])
      // Collect all fallacies
      const fallacies = []
      ;(res.data.arguments || []).forEach(arg => {
        if (arg.analysis?.fallacies?.length) {
          arg.analysis.fallacies.forEach(f => fallacies.push({ ...f, from: arg.speakerName }))
        }
      })
      setAllFallacies(fallacies)
    } catch (err) {
      toast.error('Failed to load debate')
      navigate('/debate')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const msg = input.trim()
    setInput('')
    setSending(true)

    // Optimistic add
    const tempUserMsg = {
      _id: 'temp-user',
      debateId,
      userId: user._id,
      speakerType: 'user',
      speakerName: user.username,
      message: msg,
      round: debate?.rounds?.current || 1,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const res = await api.post(`/debate/${debateId}/message`, { message: msg })
      const { userArgument, aiArgument } = res.data

      // Replace optimistic msg with real ones
      setMessages(prev => {
        const filtered = prev.filter(m => m._id !== 'temp-user')
        return [...filtered, userArgument, aiArgument]
      })

      // Update analysis
      setLastAnalysis(userArgument.analysis)

      // Collect fallacies
      const newFallacies = []
      if (userArgument.analysis?.fallacies?.length) {
        userArgument.analysis.fallacies.forEach(f => newFallacies.push({ ...f, from: 'You' }))
      }
      if (aiArgument.analysis?.fallacies?.length) {
        aiArgument.analysis.fallacies.forEach(f => newFallacies.push({ ...f, from: 'AI' }))
      }
      if (newFallacies.length) {
        setAllFallacies(prev => [...prev, ...newFallacies])
      }

      // Update round
      if (res.data.currentRound !== debate?.rounds?.current) {
        setDebate(prev => ({
          ...prev,
          rounds: { ...prev.rounds, current: res.data.currentRound },
        }))
      }
    } catch (err) {
      toast.error('Failed to send message')
      setMessages(prev => prev.filter(m => m._id !== 'temp-user'))
      setInput(msg)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleEnd = async () => {
    if (ending) return
    setEnding(true)
    setShowQuitModal(false)
    try {
      await api.post(`/debate/${debateId}/end`)
      toast.success('Debate ended! View your results.')
      navigate(`/debate/result/${debateId}`)
    } catch (err) {
      toast.error('Failed to end debate')
      setEnding(false)
    }
  }

  const handleVoiceTranscript = (text) => {
    setInput(prev => prev + (prev ? ' ' : '') + text)
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-text-secondary text-sm">Loading debate...</p>
        </div>
      </div>
    )
  }

  if (!debate) return null

  const participant = debate.participants?.find(p => p.userId === user?._id)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Top Bar */}
      <div className="border-b border-border bg-bg-primary/80 backdrop-blur-xl px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate('/debate')}
              className="btn-ghost p-2"
            >
              <FiArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-text-primary truncate">"{debate.topic}"</h2>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="badge bg-primary/15 text-primary text-[10px]">{debate.category}</span>
                <span>·</span>
                <span>You: <span className={participant?.side === 'support' ? 'text-success' : 'text-error'}>{participant?.side}</span></span>
                <span>·</span>
                <span>Round {debate.rounds?.current || 1}/{debate.rounds?.total || 5}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DebateTimer
              seconds={debate.rounds?.timePerRound || 180}
              running={debate.status === 'active'}
            />
            <button
              onClick={() => setShowQuitModal(true)}
              disabled={ending}
              className="btn-danger text-xs py-2 px-3"
              id="quit-debate-btn"
            >
              {ending ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiLogOut size={14} />}
              <span className="hidden sm:inline">Quit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quit Confirmation Modal */}
      <QuitConfirmModal
        isOpen={showQuitModal}
        onConfirm={handleEnd}
        onCancel={() => setShowQuitModal(false)}
        loading={ending}
      />

      {/* Main Chat Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            {/* AI intro card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-4 mb-6 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/15 border border-secondary/30 flex items-center justify-center text-secondary mx-auto mb-2">
                <FiCpu size={22} />
              </div>
              <p className="text-sm text-text-secondary">
                AI Debate on <span className="font-bold text-text-primary">"{debate.topic}"</span>
              </p>
              <p className="text-xs text-text-muted mt-1">
                You are <span className={participant?.side === 'support' ? 'text-success font-semibold' : 'text-error font-semibold'}>{participant?.side === 'support' ? 'supporting' : 'opposing'}</span> this topic.
                AI is <span className={debate.aiSide === 'support' ? 'text-success font-semibold' : 'text-error font-semibold'}>{debate.aiSide === 'support' ? 'supporting' : 'opposing'}</span>.
              </p>
            </motion.div>

            {/* Messages */}
            {messages.map((arg) => (
              <DebateMessage
                key={arg._id}
                argument={arg}
                currentUserId={user?._id}
              />
            ))}

            {/* Typing indicator */}
            {sending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-4 text-text-muted text-xs"
              >
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                AI is thinking...
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Right Sidebar: Camera + Analysis (desktop) */}
        <AnimatePresence>
          {showAnalysis && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:flex flex-col border-l border-border overflow-y-auto bg-bg-primary/50"
            >
              <div className="p-4 flex flex-col gap-4">

                {/* Camera Feeds */}
                <div>
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Live Camera</h3>
                  <CameraFeed
                    userName={user?.username || 'You'}
                    opponentName="AI Opponent"
                    isAI={true}
                    side={participant?.side || 'support'}
                    opponentSide={debate?.aiSide || 'oppose'}
                  />
                </div>

                <div className="h-px bg-border" />

                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Analysis Panel</h3>

                {lastAnalysis && (
                  <ArgumentAnalysis analysis={lastAnalysis} />
                )}

                {allFallacies.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                      Detected Fallacies ({allFallacies.length})
                    </h4>
                    <div className="space-y-2">
                      {allFallacies.slice(-5).map((f, i) => (
                        <FallacyAlert key={i} fallacy={f} />
                      ))}
                    </div>
                  </div>
                )}

                {!lastAnalysis && allFallacies.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-4">
                    Send a message to see real-time analysis here.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <div className="border-t border-border bg-bg-primary/80 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <VoiceInput onTranscript={handleVoiceTranscript} disabled={sending} />

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Type your argument..."
              rows={1}
              className="input-field resize-none pr-12 py-3"
              disabled={sending || debate.status !== 'active'}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="btn-primary p-3 rounded-xl"
          >
            <FiSend size={18} />
          </button>

          {/* Analysis toggle (desktop) */}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="hidden lg:flex btn-ghost p-2.5 rounded-xl"
            title={showAnalysis ? 'Hide analysis' : 'Show analysis'}
          >
            {showAnalysis ? <FiChevronDown size={18} /> : <FiChevronUp size={18} />}
          </button>
        </div>

        {/* Mobile analysis toggle */}
        <div className="lg:hidden mt-2">
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="w-full text-xs text-text-muted hover:text-text-primary flex items-center justify-center gap-1 py-1"
          >
            {showAnalysis ? 'Hide' : 'Show'} Analysis {showAnalysis ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
          </button>
          <AnimatePresence>
            {showAnalysis && (lastAnalysis || allFallacies.length > 0) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {lastAnalysis && <ArgumentAnalysis analysis={lastAnalysis} />}
                {allFallacies.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {allFallacies.slice(-3).map((f, i) => (
                      <FallacyAlert key={i} fallacy={f} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
