import { useState, useEffect } from 'react'
import Boot from './components/Boot'
import Terminal from './components/Terminal'
import './styles/global.css'
import './styles/terminal.css'

function App() {
  const [bootComplete, setBootComplete] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [reboot, setReboot] = useState(false)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  const handleBootComplete = () => {
    setBootComplete(true)
  }

  const handleReboot = () => {
    setBootComplete(false)
    setReboot(true)
    setTimeout(() => {
      setReboot(false)
      setBootComplete(true)
    }, 100)
  }

  return (
    <div className="app">
      {!bootComplete ? (
        <Boot onBootComplete={handleBootComplete} key={reboot ? 'reboot' : 'boot'} />
      ) : (
        <Terminal theme={theme} setTheme={setTheme} onReboot={handleReboot} />
      )}
    </div>
  )
}

export default App
