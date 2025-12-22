import { useState, useEffect } from 'react'

const Boot = ({ onBootComplete }) => {
  const [bootText, setBootText] = useState('')
  const [bootProgress, setBootProgress] = useState(0)

  const bootMessages = [
    'Initializing system...',
    'Loading kernel modules...',
    'Starting network services...',
    'Mounting file systems...',
    'Checking system integrity...',
    'Loading terminal interface...',
    'System ready!'
  ]

  useEffect(() => {
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
    <div className="boot-screen">
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
    </div>
  )
}

export default Boot
