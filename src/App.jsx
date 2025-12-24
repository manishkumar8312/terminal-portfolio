import { useState, useEffect } from 'react'
import Boot from './components/Boot'
import Terminal from './components/Terminal'
import './styles/global.css'
import './styles/terminal.css'

function App() {
  const [bootComplete, setBootComplete] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleBootComplete = () => {
    setBootComplete(true)
  }

  return (
    <div className="app">
      {!bootComplete ? (
        <Boot onBootComplete={handleBootComplete} />
      ) : (
        <Terminal theme={theme} setTheme={setTheme} />
      )}
    </div>
  )
}

export default App
