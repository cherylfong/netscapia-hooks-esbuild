const Notification = ({ message, success }) => {
  if (message === null) {
    return <p></p>
  }

  else if (success) {
    return (
      <div className="info">
        {message}
      </div>
    )
  }
  else {
    return (
      <div className="error">
        {message}
      </div>
    )
  }
}

export default Notification