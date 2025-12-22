import { useState, useEffect } from 'react'

const Output = ({ history, isSearching }) => {
  const [searchingText, setSearchingText] = useState('Searching')

  useEffect(() => {
    if (isSearching) {
      const interval = setInterval(() => {
        setSearchingText(prev => {
          if (prev === 'Searching') return 'Searching.'
          if (prev === 'Searching.') return 'Searching..'
          if (prev === 'Searching..') return 'Searching...'
          return 'Searching'
        })
      }, 200)

      return () => clearInterval(interval)
    } else {
      setSearchingText('Searching')
    }
  }, [isSearching])

  return (
    <div className="terminal-output">
      {history.map((item, index) => (
        <div key={index} className={`terminal-line ${item.type}`}>
          {item.type === 'input' ? (
            <>
              <span className="prompt">$</span>
              <span className="command">{item.content}</span>
            </>
          ) : (
            <pre className="output-text">{item.content}</pre>
          )}
        </div>
      ))}
      {isSearching && (
        <div className="terminal-line searching">
          <span className="prompt">$</span>
          <span className="searching-text">{searchingText}</span>
        </div>
      )}
    </div>
  )
}

export default Output
