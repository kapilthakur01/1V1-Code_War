import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const emptyProblem = {
  title: '',
  difficulty: 'Easy',
  description: '',
  inputFormat: '',
  outputFormat: '',
  constraints: '',
  tags: '',
  timeLimit: 2000,
  memoryLimit: 256,
  sampleTestCases: [{ input: '', expectedOutput: '', explanation: '', isSample: true }],
  hiddenTestCases: [{ input: '', expectedOutput: '', isSample: false }],
}

function TestCaseEditor({ testCases, onChange, label }) {
  const add = () => onChange([...testCases, { input: '', expectedOutput: '', explanation: '', isSample: label === 'Sample' }])
  const remove = (i) => onChange(testCases.filter((_, idx) => idx !== i))
  const update = (i, field, val) => {
    const updated = [...testCases]
    updated[i] = { ...updated[i], [field]: val }
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-text-secondary">{label} Test Cases</h4>
        <button type="button" onClick={add} className="btn-ghost text-xs py-1 px-2 text-primary">
          <FiPlus size={13} /> Add
        </button>
      </div>
      {testCases.map((tc, i) => (
        <div key={i} className="glass-card p-4 space-y-2 relative">
          <button
            type="button"
            onClick={() => remove(i)}
            className="absolute top-3 right-3 text-text-muted hover:text-error transition-colors"
          >
            <FiX size={14} />
          </button>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Input</label>
            <textarea
              className="input-field text-xs font-mono h-16 resize-none"
              value={tc.input}
              onChange={e => update(i, 'input', e.target.value)}
              placeholder="Input data..."
            />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Expected Output</label>
            <textarea
              className="input-field text-xs font-mono h-12 resize-none"
              value={tc.expectedOutput}
              onChange={e => update(i, 'expectedOutput', e.target.value)}
              placeholder="Expected output..."
            />
          </div>
          {label === 'Sample' && (
            <div>
              <label className="text-xs text-text-muted mb-1 block">Explanation (optional)</label>
              <input
                type="text"
                className="input-field text-xs"
                value={tc.explanation || ''}
                onChange={e => update(i, 'explanation', e.target.value)}
                placeholder="Brief explanation..."
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function AdminProblems() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyProblem)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!user?.isAdmin) {
      toast.error('Admin access required')
      navigate('/dashboard')
      return
    }
    fetchProblems()
  }, [user])

  const fetchProblems = async () => {
    try {
      const res = await api.get('/admin/problems')
      setProblems(res.data.problems || [])
    } catch (err) {
      toast.error('Failed to load problems')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyProblem)
    setShowModal(true)
  }

  const openEdit = (problem) => {
    setEditingId(problem._id)
    setForm({
      ...problem,
      tags: problem.tags?.join(', ') || '',
      sampleTestCases: problem.sampleTestCases?.length ? problem.sampleTestCases : emptyProblem.sampleTestCases,
      hiddenTestCases: problem.hiddenTestCases?.length ? problem.hiddenTestCases : emptyProblem.hiddenTestCases,
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        sampleTestCases: form.sampleTestCases.filter(tc => tc.input || tc.expectedOutput),
        hiddenTestCases: form.hiddenTestCases.filter(tc => tc.input || tc.expectedOutput),
      }

      if (editingId) {
        const res = await api.put(`/admin/problems/${editingId}`, payload)
        setProblems(prev => prev.map(p => p._id === editingId ? res.data.problem : p))
        toast.success('Problem updated!')
      } else {
        const res = await api.post('/admin/problems', payload)
        setProblems(prev => [res.data.problem, ...prev])
        toast.success('Problem created!')
      }
      setShowModal(false)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this problem?')) return
    setDeletingId(id)
    try {
      await api.delete(`/admin/problems/${id}`)
      setProblems(prev => prev.filter(p => p._id !== id))
      toast.success('Problem deleted')
    } catch (err) {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">
            Admin <span className="text-gradient">Problems</span>
          </h1>
          <p className="text-text-secondary">Manage coding problems and test cases</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <FiPlus size={16} /> New Problem
        </button>
      </motion.div>

      {/* Warning */}
      <div className="glass-card p-4 border border-warning/30 bg-warning/5 flex items-center gap-3 mb-6">
        <FiAlertTriangle className="text-warning flex-shrink-0" size={18} />
        <p className="text-sm text-text-secondary">
          Hidden test cases are never exposed to players. Sample test cases are visible in the problem panel.
        </p>
      </div>

      {/* Problem list */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16 w-full rounded-xl" />)}</div>
      ) : problems.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <p className="text-text-secondary mb-4">No problems yet. Create your first one!</p>
          <button onClick={openCreate} className="btn-primary inline-flex">
            <FiPlus size={16} /> Create Problem
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-text-primary truncate">{p.title}</h3>
                  <span className={`badge ${p.difficulty === 'Easy' ? 'badge-easy' : p.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'}`}>
                    {p.difficulty}
                  </span>
                  {!p.isActive && <span className="badge bg-text-muted/15 text-text-muted">Inactive</span>}
                </div>
                <div className="text-xs text-text-muted">
                  {p.sampleTestCases?.length || 0} sample · {p.hiddenTestCases?.length || 0} hidden · {p.tags?.join(', ')}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(p)}
                  className="btn-ghost py-1.5 px-3 text-xs"
                >
                  <FiEdit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={deletingId === p._id}
                  className="btn-ghost py-1.5 px-3 text-xs text-error hover:bg-error/10"
                >
                  {deletingId === p._id ? (
                    <div className="w-3 h-3 border border-error border-t-transparent rounded-full animate-spin" />
                  ) : <FiTrash2 size={13} />}
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card w-full max-w-3xl"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-text-primary">
                  {editingId ? 'Edit Problem' : 'Create Problem'}
                </h2>
                <button onClick={() => setShowModal(false)} className="btn-ghost p-1.5">
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal body */}
              <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Title + Difficulty */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Title *</label>
                    <input
                      type="text"
                      className="input-field"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="Two Sum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Difficulty *</label>
                    <select
                      className="input-field"
                      value={form.difficulty}
                      onChange={e => setForm({ ...form, difficulty: e.target.value })}
                    >
                      {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Description *</label>
                  <textarea
                    className="input-field h-28 resize-none"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                    placeholder="Problem statement..."
                  />
                </div>

                {/* Input / Output Format */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Input Format *</label>
                    <textarea
                      className="input-field h-20 resize-none text-sm"
                      value={form.inputFormat}
                      onChange={e => setForm({ ...form, inputFormat: e.target.value })}
                      required
                      placeholder="First line: ..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Output Format *</label>
                    <textarea
                      className="input-field h-20 resize-none text-sm"
                      value={form.outputFormat}
                      onChange={e => setForm({ ...form, outputFormat: e.target.value })}
                      required
                      placeholder="A single integer..."
                    />
                  </div>
                </div>

                {/* Constraints */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Constraints *</label>
                  <textarea
                    className="input-field h-16 resize-none text-sm font-mono"
                    value={form.constraints}
                    onChange={e => setForm({ ...form, constraints: e.target.value })}
                    required
                    placeholder="1 ≤ n ≤ 10^5"
                  />
                </div>

                {/* Tags + Limits */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Tags</label>
                    <input
                      type="text"
                      className="input-field text-sm"
                      value={form.tags}
                      onChange={e => setForm({ ...form, tags: e.target.value })}
                      placeholder="Array, Hash Table"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Time Limit (ms)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={form.timeLimit}
                      onChange={e => setForm({ ...form, timeLimit: +e.target.value })}
                      min={500}
                      max={10000}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Memory (MB)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={form.memoryLimit}
                      onChange={e => setForm({ ...form, memoryLimit: +e.target.value })}
                      min={64}
                      max={1024}
                    />
                  </div>
                </div>

                {/* Test Cases */}
                <TestCaseEditor
                  label="Sample"
                  testCases={form.sampleTestCases}
                  onChange={v => setForm({ ...form, sampleTestCases: v })}
                />
                <TestCaseEditor
                  label="Hidden"
                  testCases={form.hiddenTestCases}
                  onChange={v => setForm({ ...form, hiddenTestCases: v })}
                />

                {/* Active toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive !== false}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-text-secondary">Active (visible in matchmaking)</label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex-1 py-3">
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      <><FiSave size={16} /> {editingId ? 'Update Problem' : 'Create Problem'}</>
                    )}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-ghost px-6">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
