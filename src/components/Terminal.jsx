import { useState, useEffect, useRef } from 'react'
import Input from './Input'
import Output from './Output'
import Window from './Window'
import { AboutWindow, ProjectsWindow, ResumeWindow } from './AppWindows'
import CommandRegistry from '../commands/CommandRegistry'
import { registerSystemCommands } from '../commands/systemCommands'

const Terminal = ({ theme, setTheme, onReboot }) => {
  const [history, setHistory] = useState([
    { type: 'output', content: 'Welcome to Terminal Portfolio v2.0.0 - Ubuntu Style' },
    { type: 'output', content: 'Type "help" for available commands' },
    { type: 'output', content: '' }
  ])
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentInput, setCurrentInput] = useState('')
  const [commandHistory, setCommandHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isSearching, setIsSearching] = useState(false)
  const [windows, setWindows] = useState([])
  const [activeWindowId, setActiveWindowId] = useState(null)
  const terminalRef = useRef(null)
  
  const commandRegistry = useRef(new CommandRegistry())
  
  // Function to parse command with proper handling of quoted strings
  const parseCommand = (command) => {
    const args = []
    let current = ''
    let inQuotes = false
    let quoteChar = ''
    
    for (let i = 0; i < command.length; i++) {
      const char = command[i]
      const nextChar = command[i + 1]
      
      // Handle multi-character operators
      if (!inQuotes && char === '>' && nextChar === '>') {
        if (current) {
          args.push(current)
          current = ''
        }
        args.push('>>')
        i++ // Skip the next character
      } else if (!inQuotes && char === '>') {
        if (current) {
          args.push(current)
          current = ''
        }
        args.push('>')
      } else if ((char === '"' || char === "'") && !inQuotes) {
        inQuotes = true
        quoteChar = char
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false
        quoteChar = ''
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          args.push(current)
          current = ''
        }
      } else {
        current += char
      }
    }
    
    if (current) {
      args.push(current)
    }
    
    return args
  }
  
  useEffect(() => {
    const context = {
      openWindow: (windowType) => {
        const windowId = `${windowType}-${Date.now()}`
        const newWindow = {
          id: windowId,
          type: windowType,
          title: windowType.charAt(0).toUpperCase() + windowType.slice(1),
          isFocused: true
        }
        setWindows(prev => [...prev.filter(w => !w.isFocused), newWindow])
        setActiveWindowId(windowId)
      },
      onReboot: onReboot,
      setTheme: setTheme
    }
    registerSystemCommands(commandRegistry.current, context)
  }, [onReboot, setTheme])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = async (command) => {
    if (command.trim()) {
      const newHistory = [...commandHistory, command]
      setCommandHistory(newHistory)
      setHistoryIndex(-1)
      
      setIsSearching(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const args = parseCommand(command.trim())
      const result = commandRegistry.current.execute(args[0], args.slice(1), {
        openWindow: (windowType) => {
          const windowId = `${windowType}-${Date.now()}`
          const newWindow = {
            id: windowId,
            type: windowType,
            title: windowType.charAt(0).toUpperCase() + windowType.slice(1),
            isFocused: true
          }
          setWindows(prev => [...prev.filter(w => !w.isFocused), newWindow])
          setActiveWindowId(windowId)
        },
        onReboot: onReboot
      })
      
      setIsSearching(false)
      
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
    setHistory([
      { type: 'output', content: 'Terminal closed. Goodbye!' },
      { type: 'output', content: '' }
    ])
  }

  const handleWindowClose = (windowId) => {
    setWindows(prev => prev.filter(w => w.id !== windowId))
    if (activeWindowId === windowId) {
      setActiveWindowId(null)
    }
  }

  const handleWindowFocus = (windowId) => {
    setActiveWindowId(windowId)
    setWindows(prev => prev.map(w => ({
      ...w,
      isFocused: w.id === windowId
    })))
  }

  const handleWindowMinimize = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ))
    if (activeWindowId === windowId) {
      setActiveWindowId(null)
    }
  }

  const handleWindowRestore = (windowId) => {
    setWindows(prev => prev.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ))
    setActiveWindowId(windowId)
  }

  const getCurrentPath = () => {
    return commandRegistry.current.getCurrentPath()
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
        <div className="terminal-title">manish@portfolio:~$</div>
      </div>
      <div className="terminal-body" ref={terminalRef}>
        <Output history={history} isSearching={isSearching} />
        {!isSearching && (
          <Input
            value={currentInput}
            onChange={setCurrentInput}
            onSubmit={handleCommand}
            onKeyDown={handleKeyDown}
            currentPath={getCurrentPath()}
          />
        )}
      </div>
      {windows.filter(window => !window.isMinimized).map(window => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          onClose={handleWindowClose}
          onMinimize={handleWindowMinimize}
          onFocus={handleWindowFocus}
          isFocused={window.isFocused}
          isMinimized={window.isMinimized}
        >
          {window.type === 'about' && <AboutWindow />}
          {window.type === 'projects' && <ProjectsWindow />}
          {window.type === 'resume' && <ResumeWindow />}
        </Window>
      ))}
    </div>
  )
}

export default Terminal
