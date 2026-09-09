import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import MeetingsView from './components/MeetingsView'
import AgentsView from './components/AgentsView'
import CalendarView from './components/CalendarView'
import MeetingView from './components/MeetingView'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/meetings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <MeetingsView />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/agents" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AgentsView />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard/calendar" element={
            <ProtectedRoute>
              <DashboardLayout>
                <CalendarView />
              </DashboardLayout>
            </ProtectedRoute>
          } />
          
          {/* Meeting Route */}
          <Route path="/meeting/:meetingId" element={
            <ProtectedRoute>
              <MeetingView />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unmatched routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
