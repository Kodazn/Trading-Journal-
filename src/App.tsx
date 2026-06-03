import { useState } from 'react'
import Dashboard from './components/Dashboard'
import TradeJournal from './components/TradeJournal'
import Calendar from './components/Calendar'
import TradeForm from './components/TradeForm'
import MistakeTracker from './components/MistakeTracker'
import MorningBriefing from './components/MorningBriefing'
import './App.css'

type View = 'dashboard' | 'journal' | 'calendar' | 'add-trade' | 'mistakes' | 'briefing'

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleTradeAdded = () => {
    setRefreshTrigger((prev) => prev + 1)
    setCurrentView('journal')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-925 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                <span className="text-purple-400">📊</span> Trading Coach Dashboard
              </h1>
              <p className="text-slate-400 text-sm">Forex journal, analytics & morning briefing</p>
            </div>
            <div className="text-xs text-slate-500">React • TypeScript • Supabase • Tailwind</div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar Navigation */}
        <nav className="w-48 bg-slate-925 border-r border-slate-800 p-4 space-y-2">
          <NavButton
            label="📊 Dashboard"
            view="dashboard"
            current={currentView}
            onClick={() => setCurrentView('dashboard')}
          />
          <NavButton
            label="📋 Trade Journal"
            view="journal"
            current={currentView}
            onClick={() => setCurrentView('journal')}
          />
          <NavButton
            label="📅 Calendar"
            view="calendar"
            current={currentView}
            onClick={() => setCurrentView('calendar')}
          />
          <NavButton
            label="➕ New Trade"
            view="add-trade"
            current={currentView}
            onClick={() => setCurrentView('add-trade')}
          />
          <NavButton
            label="⚠️ Mistakes"
            view="mistakes"
            current={currentView}
            onClick={() => setCurrentView('mistakes')}
          />
          <NavButton
            label="📰 Morning Briefing"
            view="briefing"
            current={currentView}
            onClick={() => setCurrentView('briefing')}
          />
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && (
            <Dashboard refreshTrigger={refreshTrigger} />
          )}
          {currentView === 'journal' && (
            <TradeJournal refreshTrigger={refreshTrigger} />
          )}
          {currentView === 'calendar' && (
            <Calendar refreshTrigger={refreshTrigger} />
          )}
          {currentView === 'add-trade' && (
            <TradeForm onTradeAdded={handleTradeAdded} />
          )}
          {currentView === 'mistakes' && (
            <MistakeTracker refreshTrigger={refreshTrigger} />
          )}
          {currentView === 'briefing' && (
            <MorningBriefing />
          )}
        </main>
      </div>
    </div>
  )
}

interface NavButtonProps {
  label: string
  view: View
  current: View
  onClick: () => void
}

function NavButton({ label, view, current, onClick }: NavButtonProps) {
  const isActive = current === view
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? 'bg-slate-700 text-purple-300'
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  )
}
