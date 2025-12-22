const Output = ({ history }) => {
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
    </div>
  )
}

export default Output
