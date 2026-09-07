import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import MeetingsView from './components/MeetingsView'
import AgentsView from './components/AgentsView'
import CalendarView from './components/CalendarView'
import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        } />
        <Route path="/dashboard/meetings" element={
          <DashboardLayout>
            <MeetingsView />
          </DashboardLayout>
        } />
        <Route path="/dashboard/agents" element={
          <DashboardLayout>
            <AgentsView />
          </DashboardLayout>
        } />
        <Route path="/dashboard/calendar" element={
          <DashboardLayout>
            <CalendarView />
          </DashboardLayout>
        } />
        
        {/* Redirect any unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
