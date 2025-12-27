import { useRef, useEffect } from 'react'

const Prompt = ({ currentPath = '~' }) => {
  const getDisplayPath = (path) => {
    if (path === '/home/manish') return '~'
    if (path.startsWith('/home/manish/')) return '~/' + path.substring(12)
    return path
  }

  const displayPath = getDisplayPath(currentPath)

  return (
    <span className="prompt">
      <span className="prompt-user" style={{ color: '#32CD32' }}>manish</span>
      <span className="prompt-at" style={{ color: '#FFFFFF' }}>@</span>
      <span className="prompt-host" style={{ color: '#FF6B6B' }}>portfolio</span>
      <span className="prompt-colon" style={{ color: '#FFFFFF' }}>:</span>
      <span className="prompt-path" style={{ color: '#4169E1' }}>{displayPath}</span>
      <span className="prompt-dollar" style={{ color: '#FFFFFF' }}>$</span>
      <span className="prompt-space"> </span>
    </span>
  )
}

const Input = ({ value, onChange, onSubmit, onKeyDown, currentPath }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(value)
  }

  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="terminal-input-line">
      <Prompt currentPath={currentPath} />
      <form onSubmit={handleSubmit} className="input-form">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          className="terminal-input"
          autoFocus
          spellCheck="false"
        />
      </form>
    </div>
  )
}

export default Input
