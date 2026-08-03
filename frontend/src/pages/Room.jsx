import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import api from '../api/axios'
import Timer from '../components/Timer'
import TypingIndicator from '../components/TypingIndicator'
import WinnerModal from '../components/WinnerModal'
import { FiPlay, FiSend, FiChevronDown, FiChevronUp, FiUser, FiWifi, FiWifiOff, FiAlertCircle, FiCheckCircle, FiClock, FiVideo, FiAlertTriangle } from 'react-icons/fi'
import toast from 'react-hot-toast'
import VerificationScreen from '../components/VerificationScreen'
import useProctoring from '../hooks/useProctoring'

const LANGUAGES = [
  {
    id: 'cpp17',
    label: 'C++17',
    monacoId: 'cpp',
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your solution here
    
    return 0;
}`,
  },
  {
    id: 'java17',
    label: 'Java 17',
    monacoId: 'java',
    defaultCode: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Your solution here
        
        sc.close();
    }
}`,
  },
]

function DifficultyBadge({ difficulty }) {
  const cls = difficulty === 'Easy' ? 'badge-easy' : difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
  return <span className={`badge ${cls}`}>{difficulty}</span>
}

function VerdictDisplay({ verdict, testsPassed, totalTests, executionTime }) {
  if (!verdict) return null
  const config = {
    Accepted: { color: 'text-success', border: 'border-success/30', bg: 'bg-success/10', icon: <FiCheckCircle /> },
    'Wrong Answer': { color: 'text-error', border: 'border-error/30', bg: 'bg-error/10', icon: <FiAlertCircle /> },
    'Compilation Error': { color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', icon: <FiAlertCircle /> },
    'Runtime Error': { color: 'text-warning', border: 'border-warning/30', bg: 'bg-warning/10', icon: <FiAlertCircle /> },
    'Time Limit Exceeded': { color: 'text-secondary', border: 'border-secondary/30', bg: 'bg-secondary/10', icon: <FiClock /> },
    'Memory Limit Exceeded': { color: 'text-error', border: 'border-error/30', bg: 'bg-error/10', icon: <FiAlertCircle /> },
  }
  const c = config[verdict] || config['Wrong Answer']
  return (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${c.border} ${c.bg} ${c.color} text-sm font-semibold`}>
      {c.icon}
      <span>{verdict}</span>
      {testsPassed !== undefined && (
        <span className="ml-1 font-normal text-text-muted">({testsPassed}/{totalTests} tests)</span>
      )}
      {executionTime > 0 && (
        <span className="ml-auto text-xs font-normal opacity-70">{executionTime}ms</span>
      )}
    </div>
  )
}

export default function Room() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const { socket } = useSocket()
  const navigate = useNavigate()

  // Room state
  const [room, setRoom] = useState(null)
  const [problem, setProblem] = useState(null)
  const [status, setStatus] = useState('waiting') // waiting | active | finished
  const [startTime, setStartTime] = useState(null)
  const [opponents, setOpponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  
  const proctorVideoRef = useRef(null)
  // Only activate proctoring after camera verification
  const { violations, isTerminated } = useProctoring(isVerified ? roomId : null, proctorVideoRef)

  // Editor state
  const [language, setLanguage] = useState(LANGUAGES[0])
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)

  // Output state
  const [customInput, setCustomInput] = useState('')
  const [runOutput, setRunOutput] = useState(null)
  const [runLoading, setRunLoading] = useState(false)
  const [submitResult, setSubmitResult] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('testcases') // testcases | output
  const [consoleOpen, setConsoleOpen] = useState(true)

  // Opponent typing
  const [opponentTyping, setOpponentTyping] = useState(false)
  const [opponentUsername, setOpponentUsername] = useState('')
  const [opponentConnected, setOpponentConnected] = useState(false)
  const [opponentSubmitted, setOpponentSubmitted] = useState(false)

  // Winner state
  const [battleResult, setBattleResult] = useState(null)

  // Connect to socket room (only after camera verification)
  useEffect(() => {
    if (!socket || !roomId || !isVerified) return
    socket.emit('join-room', { roomId })
  }, [socket, roomId, isVerified])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    socket.on('room-state', ({ room, problem, startTime, endTime }) => {
      setRoom(room)
      setProblem(problem)
      setStatus(room.status)
      setLoading(false)
      if (startTime) setStartTime(startTime)

      // Set opponent info
      const opp = room.players.find(p => p.userId?.toString() !== user?._id?.toString())
      if (opp) {
        setOpponentUsername(opp.username)
        setOpponentConnected(opp.isConnected)
      }
    })

    socket.on('battle-start', ({ startTime, duration, problem }) => {
      setStatus('active')
      setStartTime(startTime)
      setProblem(problem)
      toast.success('⚔️ Battle started! Good luck!', { duration: 4000 })
    })

    socket.on('player-connected', ({ username }) => {
      setOpponentUsername(username)
      setOpponentConnected(true)
      toast(`${username} joined the room`, { icon: '👤' })
    })

    socket.on('player-disconnected', ({ username }) => {
      setOpponentConnected(false)
      toast(`${username} disconnected`, { icon: '⚡' })
    })

    socket.on('opponent-typing', ({ isTyping, username }) => {
      setOpponentTyping(isTyping)
      if (username) setOpponentUsername(username)
    })

    socket.on('player-submitted', ({ username }) => {
      if (username !== user?.username) {
        setOpponentSubmitted(true)
        toast(`${username} submitted a solution!`, { icon: '⚡', duration: 3000 })
      }
    })

    socket.on('submission-result', (result) => {
      setSubmitResult(result)
      setSubmitLoading(false)
      toast[result.verdict === 'Accepted' ? 'success' : 'error'](result.verdict, { duration: 4000 })
    })

    socket.on('submission-error', ({ message }) => {
      setSubmitLoading(false)
      toast.error(message)
    })

    socket.on('battle-end', (result) => {
      setStatus('finished')
      setBattleResult(result)
    })

    socket.on('timer-sync', ({ remaining, startTime }) => {
      setStartTime(startTime)
    })

    socket.on('error', ({ message }) => {
      toast.error(message)
      navigate('/matchmaking')
    })

    return () => {
      socket.off('room-state')
      socket.off('battle-start')
      socket.off('player-connected')
      socket.off('player-disconnected')
      socket.off('opponent-typing')
      socket.off('player-submitted')
      socket.off('submission-result')
      socket.off('submission-error')
      socket.off('battle-end')
      socket.off('timer-sync')
      socket.off('error')
      socket.emit('leave-room', { roomId })
    }
  }, [socket, user, navigate, roomId])

  // Handle code change with typing indicator
  const handleCodeChange = useCallback((val) => {
    setCode(val || '')
    if (!isTypingRef.current && socket) {
      isTypingRef.current = true
      socket.emit('typing', { roomId, isTyping: true })
    }
    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false
      socket?.emit('typing', { roomId, isTyping: false })
    }, 2000)
  }, [socket, roomId])

  // Language change
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(lang.defaultCode)
  }

  // Run code
  const handleRun = async () => {
    if (!problem) return
    setRunLoading(true)
    setActiveTab('output')
    setConsoleOpen(true)
    try {
      const res = await api.post('/submissions/run', {
        code,
        language: language.id,
        input: customInput,
        problemId: problem._id,
      })
      setRunOutput(res.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Run failed')
    } finally {
      setRunLoading(false)
    }
  }

  // Submit solution
  const handleSubmit = () => {
    if (!problem || !socket) return
    if (status !== 'active' || isTerminated) return toast.error('Battle is not active')
    setSubmitLoading(true)
    setSubmitResult(null)
    socket.emit('submit-solution', {
      roomId,
      code,
      language: language.id,
      problemId: problem._id,
    })
  }

  if (!isVerified) {
    return <VerificationScreen onVerified={() => setIsVerified(true)} />
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-text-secondary">Connecting to battle room...</p>
        </div>
      </div>
    )
  }

  // Waiting overlay — shown after verification but before opponent joins
  if (status === 'waiting' && !opponentUsername) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-md w-full p-10 text-center"
        >
          {/* Animated ring */}
          <div className="relative w-28 h-28 mx-auto mb-7">
            <div className="absolute inset-0 rounded-full border-2 border-secondary/15" />
            <div className="absolute inset-0 rounded-full border-2 border-secondary/30 animate-ping" style={{ animationDuration: '1.8s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-ping" style={{ animationDuration: '2.4s', animationDelay: '0.6s' }} />
            <div className="relative w-28 h-28 rounded-full bg-secondary/10 border border-secondary/40 flex items-center justify-center">
              <FiUser size={36} className="text-secondary animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-2">Camera Verified ✅</h2>
          <p className="text-text-secondary mb-6 text-sm">
            You're all set! Waiting for your opponent to join and verify their camera...
          </p>

          {/* Room code */}
          {room?.roomCode && (
            <div className="mb-6">
              <p className="text-xs text-text-muted uppercase tracking-widest mb-2">Room Code</p>
              <div className="bg-bg-secondary border-2 border-secondary/40 rounded-xl px-6 py-3 inline-block">
                <span className="text-2xl font-mono font-black tracking-[0.25em] text-secondary select-all">
                  {room.roomCode}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-text-muted text-sm animate-pulse">
            <div className="w-2 h-2 rounded-full bg-warning" />
            Waiting for opponent to join...
          </div>

          {/* Small webcam preview */}
          <div className="mt-6 mx-auto w-32 aspect-video bg-black rounded-lg overflow-hidden border border-secondary/30">
            <video
              ref={proctorVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          </div>
          <p className="text-xs text-text-muted mt-1">Your camera is active for proctoring</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col select-none relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary/60 backdrop-blur-sm flex-shrink-0">
        {/* Players */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              {user?.username[0].toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-text-primary hidden sm:block">{user?.username}</span>
          </div>
          <div className="text-text-muted text-sm font-bold">VS</div>
          <div className="flex items-center gap-2">
            {opponentUsername ? (
              <>
                <div className={`w-2 h-2 rounded-full ${opponentConnected ? 'bg-success' : 'bg-error'} flex-shrink-0`} />
                <span className="text-sm text-text-secondary hidden sm:block">{opponentUsername}</span>
                {opponentSubmitted && <span className="text-xs badge bg-warning/15 text-warning">Submitted</span>}
              </>
            ) : (
              <span className="text-sm text-text-muted">Waiting for opponent...</span>
            )}
          </div>
        </div>

        {/* Timer + Status */}
        <div className="flex items-center gap-3">
          {status === 'waiting' && (
            <div className="flex items-center gap-2 text-sm text-text-muted animate-pulse">
              <div className="w-2 h-2 rounded-full bg-warning" />
              Waiting for opponent
            </div>
          )}
          {status === 'active' && startTime && (
            <Timer startTime={startTime} duration={30 * 60 * 1000} />
          )}
          {status === 'finished' && (
            <span className="badge bg-text-muted/15 text-text-muted">Battle Ended</span>
          )}
          {/* Proctoring Status */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${violations > 0 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
             {violations > 0 ? <FiAlertTriangle size={14} /> : <FiCheckCircle size={14} />}
             Violations: {violations}/3
          </div>
        </div>

        {/* Room code */}
        {room?.roomCode && (
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-text-muted">Room:</span>
            <code className="font-mono font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
              {room.roomCode}
            </code>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Problem Panel */}
        <div className="w-[40%] min-w-[300px] max-w-[500px] border-r border-border overflow-y-auto bg-bg-secondary/30 flex-shrink-0">
          {problem ? (
            <div className="p-5 space-y-5">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DifficultyBadge difficulty={problem.difficulty} />
                  {problem.tags?.map(tag => (
                    <span key={tag} className="badge bg-bg-hover text-text-muted text-xs">{tag}</span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-text-primary">{problem.title}</h2>
              </div>

              {/* Description */}
              <div>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{problem.description}</p>
              </div>

              {/* Input Format */}
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Input Format</h3>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{problem.inputFormat}</p>
              </div>

              {/* Output Format */}
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Output Format</h3>
                <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap">{problem.outputFormat}</p>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Constraints</h3>
                <div className="bg-bg-card rounded-lg p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">
                  {problem.constraints}
                </div>
              </div>

              {/* Sample Test Cases */}
              {problem.sampleTestCases?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Examples</h3>
                  {problem.sampleTestCases.map((tc, i) => (
                    <div key={i} className="glass-card p-4 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-text-muted mb-1">Input</div>
                        <pre className="bg-bg-secondary rounded p-2 text-sm font-mono text-success overflow-x-auto">{tc.input}</pre>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-muted mb-1">Output</div>
                        <pre className="bg-bg-secondary rounded p-2 text-sm font-mono text-primary overflow-x-auto">{tc.expectedOutput}</pre>
                      </div>
                      {tc.explanation && (
                        <p className="text-xs text-text-muted italic">{tc.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-20 w-full" />)}
            </div>
          )}
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-secondary/40 flex-shrink-0">
            <div className="flex items-center gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.id}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    language.id === lang.id
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <TypingIndicator isTyping={opponentTyping} username={opponentUsername} />
              <button
                onClick={handleRun}
                disabled={runLoading || !problem}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                {runLoading ? (
                  <div className="w-3 h-3 border border-secondary border-t-transparent rounded-full animate-spin" />
                ) : <FiPlay size={13} />}
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading || status !== 'active' || !problem}
                className="btn-success text-xs py-1.5 px-3"
              >
                {submitLoading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : <FiSend size={13} />}
                Submit
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={language.monacoId}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                tabSize: 4,
                readOnly: isTerminated || status !== 'active',
              }}
            />
          </div>

          {/* Console Panel */}
          <div className={`border-t border-border bg-bg-secondary/60 flex-shrink-0 transition-all duration-300 ${consoleOpen ? 'h-56' : 'h-10'}`}>
            {/* Console Header */}
            <div className="flex items-center justify-between px-4 h-10 cursor-pointer" onClick={() => setConsoleOpen(!consoleOpen)}>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Console</span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTab('testcases') }}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${activeTab === 'testcases' ? 'text-primary bg-primary/10' : 'text-text-muted'}`}
                  >
                    Custom Input
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveTab('output') }}
                    className={`text-xs px-2 py-0.5 rounded transition-colors ${activeTab === 'output' ? 'text-primary bg-primary/10' : 'text-text-muted'}`}
                  >
                    Output
                  </button>
                </div>
                {submitResult && (
                  <VerdictDisplay
                    verdict={submitResult.verdict}
                    testsPassed={submitResult.testsPassed}
                    totalTests={submitResult.totalTests}
                    executionTime={submitResult.executionTime}
                  />
                )}
              </div>
              <button className="text-text-muted hover:text-text-primary">
                {consoleOpen ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
              </button>
            </div>

            {/* Console Content */}
            {consoleOpen && (
              <div className="flex h-[calc(100%-40px)]">
                {activeTab === 'testcases' ? (
                  <div className="flex-1 flex flex-col p-3 gap-2">
                    <label className="text-xs text-text-muted">Custom Input (stdin)</label>
                    <textarea
                      className="flex-1 input-field text-xs font-mono resize-none"
                      placeholder="Enter custom input here..."
                      value={customInput}
                      onChange={e => setCustomInput(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto p-3">
                    {runLoading && (
                      <div className="flex items-center gap-2 text-text-muted text-xs">
                        <div className="w-3 h-3 border border-secondary border-t-transparent rounded-full animate-spin" />
                        Running...
                      </div>
                    )}
                    {runOutput && !runLoading && (
                      <div className="space-y-2">
                        {runOutput.compileError && (
                          <div>
                            <div className="text-xs text-error mb-1">Compilation Error</div>
                            <pre className="text-xs font-mono text-error bg-error/5 rounded p-2 overflow-x-auto whitespace-pre-wrap">{runOutput.compileError}</pre>
                          </div>
                        )}
                        {runOutput.stdout && (
                          <div>
                            <div className="text-xs text-text-muted mb-1">Output <span className="text-success">({runOutput.executionTime}ms)</span></div>
                            <pre className="text-xs font-mono text-success bg-success/5 rounded p-2 overflow-x-auto whitespace-pre-wrap">{runOutput.stdout}</pre>
                          </div>
                        )}
                        {runOutput.stderr && !runOutput.compileError && (
                          <div>
                            <div className="text-xs text-error mb-1">Stderr</div>
                            <pre className="text-xs font-mono text-error bg-error/5 rounded p-2 overflow-x-auto whitespace-pre-wrap">{runOutput.stderr}</pre>
                          </div>
                        )}
                        {!runOutput.stdout && !runOutput.stderr && !runOutput.compileError && (
                          <p className="text-xs text-text-muted">No output</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      <AnimatePresence>
        {battleResult && (
          <WinnerModal
            winnerId={battleResult.winnerId}
            winnerUsername={battleResult.winnerUsername}
            winReason={battleResult.winReason}
            isDraw={battleResult.isDraw}
            currentUserId={user?._id}
            onClose={() => setBattleResult(null)}
          />
        )}
      </AnimatePresence>

      {/* Floating Webcam Preview */}
      <div className="absolute bottom-4 right-4 w-48 aspect-video bg-black rounded-lg overflow-hidden border-2 border-primary shadow-2xl z-40 pointer-events-none">
         <video 
           ref={proctorVideoRef} 
           autoPlay 
           playsInline 
           muted 
           className="w-full h-full object-cover transform scale-x-[-1]"
         />
         <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-md">
           <FiVideo size={10} className={isTerminated ? "text-error" : "text-success animate-pulse"} /> REC
         </div>
      </div>
      
      {/* Termination Overlay */}
      <AnimatePresence>
         {isTerminated && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm p-4"
            >
               <div className="glass-card max-w-md w-full p-8 text-center border-error/50">
                  <div className="mx-auto w-16 h-16 bg-error/20 text-error rounded-full flex items-center justify-center mb-4">
                     <FiAlertTriangle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-error mb-2">Contest Terminated</h2>
                  <p className="text-text-secondary text-sm">
                     Your contest session has been terminated due to repeated or severe proctoring violations.
                  </p>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}
