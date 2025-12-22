import { useState, useEffect, useRef } from 'react'
import Input from './Input'
import Output from './Output'
import { executeCommand } from '../commands/commands'

const Terminal = () => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Terminal Portfolio v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' }
  ])
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (command) => {
    if (command.trim()) {
      const newHistory = [...commandHistory, command]
      setCommandHistory(newHistory)
      setHistoryIndex(-1)
      
      const result = executeCommand(command)
      if (result.includes('CLEAR_SCREEN')) {
        setHistory([
          { type: 'output', content: 'Terminal cleared. Type "help" for available commands.' },
          { type: 'output', content: '' }
        ])
      } else {
        setHistory(prev => [
          ...prev,
          { type: 'input', content: command },
          ...result.map(output => ({ type: 'output', content: output })),
          { type: 'output', content: '' }
        ])
      }
    }
    setCurrentInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  const handleClose = () => {
    // Clear terminal and show goodbye message
    setHistory([
      { type: 'output', content: 'Terminal closed. Goodbye!' },
      { type: 'output', content: '' }
    ])
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleMaximize = () => {
    // Toggle fullscreen or maximize effect
    const terminal = document.querySelector('.terminal')
    if (terminal) {
      terminal.classList.toggle('maximized')
    }
  }

  return (
    <div className={`terminal ${isMinimized ? 'minimized' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="button close" onClick={handleClose}></div>
          <div className="button minimize" onClick={handleMinimize}></div>
          <div className="button maximize" onClick={handleMaximize}></div>
        </div>
        <div className="terminal-title">terminal@portfolio:~</div>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        <Output history={history} />
        <Input
          value={currentInput}
          onChange={setCurrentInput}
          onSubmit={handleCommand}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export default Terminal
