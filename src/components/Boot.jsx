import { useState, useEffect } from 'react'

const Boot = ({ onBootComplete }) => {
  const [bootText, setBootText] = useState('')
  const [bootProgress, setBootProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  const bootMessages = [
    '[Ubuntu 24.04 LTS] Initializing system...',
    '[Kernel] Loading kernel modules...',
    '[Network] Starting network services...',
    '[FS] Mounting file systems...',
    '[Security] Checking system integrity...',
    '[Terminal] Loading terminal interface...',
    '[Ready] System ready!'
  ]

  useEffect(() => {
    // Add entrance animation
    setTimeout(() => setShowContent(true), 100)
    
    let messageIndex = 0
    let currentText = ''
    
    const bootInterval = setInterval(() => {
      if (messageIndex < bootMessages.length) {
        const message = bootMessages[messageIndex]
        const charIndex = currentText.length - bootMessages.slice(0, messageIndex).join('\n').length
        
        if (charIndex < message.length) {
          currentText += message[charIndex]
          setBootText(bootMessages.slice(0, messageIndex).join('\n') + '\n' + currentText.split('\n').pop())
        } else {
          currentText += '\n'
          setBootText(bootMessages.slice(0, messageIndex + 1).join('\n'))
          messageIndex++
        }
        setBootProgress((messageIndex / bootMessages.length) * 100)
      } else {
        clearInterval(bootInterval)
        setTimeout(() => onBootComplete(), 1000)
      }
    }, 50)

    return () => clearInterval(bootInterval)
  }, [onBootComplete])

  return (
    <div className="ubuntu-boot">
      <div className="container">
        <main className="login-screen">
          <div className={`content ${showContent ? 'fade-in' : ''}`}>
            <h1 className="ubuntu-title">Ubuntu 24.04 LTS</h1>
            <div className="user-info">
              <h2 className="developer-name">Manish Kumar Sah</h2>
              <p className="roles">DevOps • Competitive Programming • Systems Engineering</p>
            </div>
            
            <div className="boot-container">
              <pre className="boot-text">{bootText}</pre>
              <div className="boot-progress">
                <div 
                  className="boot-progress-bar" 
                  style={{ width: `${bootProgress}%` }}
                />
              </div>
              <div className="boot-percentage">{Math.round(bootProgress)}%</div>
            </div>
            
            {bootProgress >= 100 && (
              <button className="terminal-btn" onClick={onBootComplete}>
                <span className="btn-text">Open Terminal</span>
              </button>
            )}
          </div>
        </main>
        <footer className="footer">
          <p className="keyboard-hint">
            {bootProgress >= 100 ? 'Press Enter to start' : 'System booting...'}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Boot
