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
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
