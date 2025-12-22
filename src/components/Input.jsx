import { useRef, useEffect } from 'react'

const Input = ({ value, onChange, onSubmit, onKeyDown }) => {
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
      <span className="prompt">$</span>
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
