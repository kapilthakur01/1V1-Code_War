import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../../api/axios'
import toast from 'react-hot-toast'
import ScoreRadial from '../../components/debate/ScoreRadial'
import { FiArrowLeft, FiArrowRight, FiAward, FiAlertTriangle, FiTarget, FiTrendingUp } from 'react-icons/fi'

export default function DebateResult() {
  const { debateId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [debate, setDebate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResult()
  }, [debateId])

  const loadResult = async () => {
    try {
      const [resultRes, debateRes] = await Promise.all([
        api.get(`/debate-result/${debateId}`),
        api.get(`/debate/${debateId}`),
      ])
      setResult(resultRes.data.result)
      setDebate(debateRes.data.debate)
    } catch (err) {
      toast.error('Failed to load results')
      navigate('/debate')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!result) return null

  const scores = result.scores || {}
  const scoreItems = [
    { key: 'logic', label: 'Logic', color: 'primary' },
    { key: 'evidence', label: 'Evidence', color: 'error' },
    { key: 'communication', label: 'Communication', color: 'secondary' },
    { key: 'confidence', label: 'Confidence', color: 'success' },
    { key: 'criticalThinking', label: 'Critical Thinking', color: 'warning' },
    { key: 'persuasion', label: 'Persuasion', color: 'primary' },
  ]

  const winLabel = debate?.winnerLabel
  const resultBadge = winLabel === 'user'
    ? { text: 'Victory!', bg: 'bg-success/15', color: 'text-success', border: 'border-success/30' }
    : winLabel === 'draw'
      ? { text: 'Draw', bg: 'bg-warning/15', color: 'text-warning', border: 'border-warning/30' }
      : { text: 'Defeat', bg: 'bg-error/15', color: 'text-error', border: 'border-error/30' }

  return (
    <div className="page-container max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button onClick={() => navigate('/debate')} className="text-sm text-text-muted hover:text-text-primary mb-4 flex items-center gap-1">
          <FiArrowLeft size={14} /> Back to Arena
        </button>

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border ${resultBadge.border} ${resultBadge.bg} ${resultBadge.color} text-lg font-bold mb-4`}
          >
            <FiAward size={20} />
            {resultBadge.text}
          </motion.div>
          <h1 className="text-2xl font-black text-text-primary mb-1">Debate Report</h1>
          <p className="text-sm text-text-muted">"{debate?.topic}"</p>
        </div>
      </motion.div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8 text-center mb-8"
      >
        <ScoreRadial score={result.overallScore || 0} label="Overall Score" size={120} strokeWidth={8} color={result.overallScore >= 75 ? 'success' : result.overallScore >= 50 ? 'warning' : 'error'} />
      </motion.div>

      {/* Detailed Scores Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
      >
        {scoreItems.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="glass-card p-5 flex flex-col items-center"
          >
            <ScoreRadial score={scores[item.key] || 0} label={item.label} size={80} color={item.color} />
          </motion.div>
        ))}
      </motion.div>

      {/* Feedback + Strengths/Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold text-success flex items-center gap-2 mb-3">
            <FiTrendingUp size={16} /> Strengths
          </h3>
          <div className="space-y-2">
            {(result.strengths || []).map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span className="text-sm text-text-secondary">{s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weaknesses */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-bold text-warning flex items-center gap-2 mb-3">
            <FiTarget size={16} /> Areas to Improve
          </h3>
          <div className="space-y-2">
            {(result.weaknesses || []).map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-warning mt-0.5">→</span>
                <span className="text-sm text-text-secondary">{w}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6 mb-8"
      >
        <h3 className="text-sm font-bold text-primary flex items-center gap-2 mb-3">
          🤖 AI Feedback
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">{result.feedback}</p>
      </motion.div>

      {/* Improvement Plan */}
      {result.improvementPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="gradient-border rounded-2xl p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-2xl" />
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-3">
              🗺️ Improvement Roadmap
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">{result.improvementPlan}</p>
          </div>
        </motion.div>
      )}

      {/* Fallacies Detected */}
      {result.fallaciesDetected?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-sm font-bold text-error flex items-center gap-2 mb-3">
            <FiAlertTriangle size={16} /> Fallacies Detected
          </h3>
          <div className="space-y-2">
            {result.fallaciesDetected.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-text-primary font-medium">{f.type}</span>
                <span className="badge bg-error/15 text-error">{f.count}x</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/debate/ai-setup" className="btn-primary py-3 px-6">
          New Debate <FiArrowRight size={16} />
        </Link>
        <Link to="/debate/profile" className="btn-secondary py-3 px-6">
          View Profile
        </Link>
      </div>
    </div>
  )
}
