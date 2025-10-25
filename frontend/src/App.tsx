import { useState, useEffect } from 'react'
import BottomNav from './components/BottomNav'
import Summary from './pages/Summary'
import CheckIn from './pages/CheckIn'
import UrgeManager from './pages/UrgeManager'
import Settings from './pages/Settings'
import './App.css'

type Theme = 'light' | 'dark'
type FontSize = 'small' | 'medium' | 'large'

function App() {
  const [activeTab, setActiveTab] = useState('summary')
  const [theme, setTheme] = useState<Theme>('light')
  const [fontSize, setFontSize] = useState<FontSize>('medium')

  // Load theme and fontSize from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedFontSize = localStorage.getItem('fontSize') as FontSize | null
    
    if (savedTheme) setTheme(savedTheme)
    if (savedFontSize) setFontSize(savedFontSize)
  }, [])

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  // Save fontSize to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize)
  }, [fontSize])

  // Apply font size CSS variable
  useEffect(() => {
    const root = document.documentElement
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    root.style.fontSize = fontSizeMap[fontSize]
  }, [fontSize])

  const renderPage = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary onNavigateToCheckIn={() => setActiveTab('checkin')} />
      case 'checkin':
        return <CheckIn />
      case 'urge':
        return <UrgeManager />
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} fontSize={fontSize} setFontSize={setFontSize} />
      default:
        return <Summary onNavigateToCheckIn={() => setActiveTab('checkin')} />
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
