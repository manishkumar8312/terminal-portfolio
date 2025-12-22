import { useState } from 'react'
import Boot from './components/Boot'
import Terminal from './components/Terminal'
import './styles/global.css'
import './styles/terminal.css'

function App() {
  const [bootComplete, setBootComplete] = useState(false)

  const handleBootComplete = () => {
    setBootComplete(true)
  }

  return (
    <div className="app">
      {!bootComplete ? (
        <Boot onBootComplete={handleBootComplete} />
      ) : (
        <Terminal />
      )}
    </div>
  )
}

export default App
