import { useState } from 'react'
import BottomNav from './components/BottomNav'
import Summary from './pages/Summary'
import CheckIn from './pages/CheckIn'
import UrgeManager from './pages/UrgeManager'
import Settings from './pages/Settings'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('summary')

  const renderPage = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary />
      case 'checkin':
        return <CheckIn />
      case 'urge':
        return <UrgeManager />
      case 'settings':
        return <Settings />
      default:
        return <Summary />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-16">
        {renderPage()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
