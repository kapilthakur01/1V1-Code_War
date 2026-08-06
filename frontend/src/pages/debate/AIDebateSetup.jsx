import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import TopicSelector from '../../components/debate/TopicSelector'
import { FiCpu, FiThumbsUp, FiThumbsDown, FiArrowRight, FiArrowLeft } from 'react-icons/fi'

export default function AIDebateSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: topic, 2: side
  const [topic, setTopic] = useState('')
  const [category, setCategory] = useState('Custom')
  const [side, setSide] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTopicSelect = ({ topic: t, category: c }) => {
    setTopic(t)
    setCategory(c)
    setStep(2)
  }

  const handleStart = async () => {
    if (!topic || !side) return
    setLoading(true)
    try {
      const res = await api.post('/debate/create', { topic, category, side })
      toast.success('Debate started!')
      navigate(`/debate/ai/${res.data.debate._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start debate')
    } finally {
      setLoading(false)
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
          onClick={() => step === 1 ? navigate('/debate') : setStep(1)}
          className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1"
        >
          <FiArrowLeft size={14} /> {step === 1 ? 'Back to Arena' : 'Change Topic'}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
            <FiCpu size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">AI Debate Setup</h1>
            <p className="text-text-muted text-sm">
              {step === 1 ? 'Choose your debate topic' : 'Choose your position'}
            </p>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mt-6">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            step >= 1 ? 'bg-primary/20 text-primary' : 'bg-bg-secondary text-text-muted'
          }`}>
            <span className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-[10px]">1</span>
            Topic
          </div>
          <div className="w-8 h-px bg-border" />
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
            step >= 2 ? 'bg-primary/20 text-primary' : 'bg-bg-secondary text-text-muted'
          }`}>
            <span className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-[10px]">2</span>
            Position
          </div>
        </div>
      </motion.div>

      {/* Step 1: Topic Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TopicSelector onSelect={handleTopicSelect} />
        </motion.div>
      )}

      {/* Step 2: Side Selection */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Selected topic display */}
          <div className="glass-card p-5 mb-6">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Debate Topic</span>
            <p className="text-lg font-bold text-text-primary mt-1">"{topic}"</p>
            <span className="badge bg-primary/15 text-primary mt-2">{category}</span>
          </div>

          <h3 className="text-lg font-bold text-text-primary mb-4">Choose Your Position</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setSide('support')}
              className={`glass-card p-6 text-left transition-all duration-200 cursor-pointer ${
                side === 'support'
                  ? 'border-success/60 bg-success/10 shadow-lg'
                  : 'hover:border-success/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-success/15 border border-success/30 flex items-center justify-center text-success mb-3">
                <FiThumbsUp size={22} />
              </div>
              <h4 className="font-bold text-text-primary mb-1">Support</h4>
              <p className="text-xs text-text-muted">Argue in favor of the statement. AI will oppose you.</p>
            </button>

            <button
              onClick={() => setSide('oppose')}
              className={`glass-card p-6 text-left transition-all duration-200 cursor-pointer ${
                side === 'oppose'
                  ? 'border-error/60 bg-error/10 shadow-lg'
                  : 'hover:border-error/30'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-error/15 border border-error/30 flex items-center justify-center text-error mb-3">
                <FiThumbsDown size={22} />
              </div>
              <h4 className="font-bold text-text-primary mb-1">Oppose</h4>
              <p className="text-xs text-text-muted">Argue against the statement. AI will support it.</p>
            </button>
          </div>

          <button
            onClick={handleStart}
            disabled={!side || loading}
            className="btn-primary w-full py-4 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Starting Debate...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Start Debate <FiArrowRight size={18} />
              </span>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}
