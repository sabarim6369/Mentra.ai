import { useState } from 'react'
import LandingPage from './components/LandingPage'
import DashboardLayout from './components/DashboardLayout'
import DashboardHome from './components/DashboardHome'
import MeetingsView from './components/MeetingsView'
import AgentsView from './components/AgentsView'
import CalendarView from './components/CalendarView'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />
      
      case 'dashboard':
      case 'meetings':
      case 'agents':
      case 'calendar':
        return (
          <DashboardLayout 
            currentPage={currentPage} 
            onNavigate={handleNavigate}
          >
            {currentPage === 'dashboard' && <DashboardHome onNavigate={handleNavigate} />}
            {currentPage === 'meetings' && <MeetingsView />}
            {currentPage === 'agents' && <AgentsView />}
            {currentPage === 'calendar' && <CalendarView />}
          </DashboardLayout>
        )
      
      case 'signin':
      case 'signup':
        // For demo purposes, redirect to dashboard
        return (
          <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentPage === 'signin' ? 'Sign In' : 'Sign Up'}
              </h1>
              <p className="text-gray-400 mb-6">Demo mode - redirecting to dashboard...</p>
              <button 
                onClick={() => handleNavigate('dashboard')}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )
      
      default:
        return <LandingPage onNavigate={handleNavigate} />
    }
  }

  return renderPage()
}

export default App
