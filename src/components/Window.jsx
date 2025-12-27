import { useState, useRef, useEffect } from 'react'
import './Window.css'

const Window = ({ 
  id, 
  title, 
  children, 
  onClose, 
  onMinimize, 
  onFocus,
  isFocused = false,
  isMinimized = false,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 800, height: 600 }
}) => {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const windowRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, position.x + deltaX)),
          y: Math.max(0, Math.min(window.innerHeight - size.height - 40, position.y + deltaY))
        })
        setDragStart({ x: e.clientX, y: e.clientY })
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y
        setSize({
          width: Math.max(400, resizeStart.width + deltaX),
          height: Math.max(300, resizeStart.height + deltaY)
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size])

  const handleMouseDown = (e) => {
    if (onFocus) onFocus(id)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleResizeStart = (e) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({ 
      x: e.clientX, 
      y: e.clientY, 
      width: size.width, 
      height: size.height 
    })
  }

  const handleClose = () => {
    if (onClose) onClose(id)
  }

  const handleMinimize = () => {
    if (onMinimize) onMinimize(id)
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setSize(initialSize)
      setPosition(initialPosition)
    } else {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 80 })
      setPosition({ x: 20, y: 40 })
    }
    setIsMaximized(!isMaximized)
  }

  if (isMinimized) {
    return null
  }

  return (
    <div
      ref={windowRef}
      className={`window ${isFocused ? 'focused' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isFocused ? 1000 : 100
      }}
    >
      <div 
        className="window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="window-controls">
          <div className="window-control close" onClick={handleClose}></div>
          <div className="window-control minimize" onClick={handleMinimize}></div>
          <div className="window-control maximize" onClick={handleMaximize}></div>
        </div>
        <div className="window-title">{title}</div>
      </div>
      <div className="window-content">
        {children}
      </div>
      <div 
        className="window-resize-handle"
        onMouseDown={handleResizeStart}
      ></div>
    </div>
  )
}

export default Window
