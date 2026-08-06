import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Matchmaking from './pages/Matchmaking'
import Room from './pages/Room'
import History from './pages/History'
import AdminProblems from './pages/admin/Problems'
import ProtectedRoute from './components/ProtectedRoute'

// Debate Arena Pages
import DebateHome from './pages/debate/DebateHome'
import AIDebateSetup from './pages/debate/AIDebateSetup'
import AIDebateRoom from './pages/debate/AIDebateRoom'
import LiveDebateSetup from './pages/debate/LiveDebateSetup'
import LiveDebateRoom from './pages/debate/LiveDebateRoom'
import DebateResult from './pages/debate/DebateResult'
import DebateLeaderboard from './pages/debate/DebateLeaderboard'
import DebateProfile from './pages/debate/DebateProfile'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-text-secondary text-sm">Loading CodeClash...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/matchmaking" element={<Matchmaking />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin/problems" element={<AdminProblems />} />

          {/* Debate Arena Routes */}
          <Route path="/debate" element={<DebateHome />} />
          <Route path="/debate/ai-setup" element={<AIDebateSetup />} />
          <Route path="/debate/ai/:debateId" element={<AIDebateRoom />} />
          <Route path="/debate/live-setup" element={<LiveDebateSetup />} />
          <Route path="/debate/live/:roomCode" element={<LiveDebateRoom />} />
          <Route path="/debate/result/:debateId" element={<DebateResult />} />
          <Route path="/debate/leaderboard" element={<DebateLeaderboard />} />
          <Route path="/debate/profile" element={<DebateProfile />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </div>
  )
}

export default App
