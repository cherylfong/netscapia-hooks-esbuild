const Usage = () => {
  return (
    <div>
      <h3>Site Usage</h3>
      <ul >
        <li>
          Blogs can only be deleted by the original user who added it.{' '}
          <a href="/login">Login</a> to see delete button.
        </li>
        <li>All users including unauthenticated users can like blog items.</li>
        <li>All users including unauthenticated users can add comments. </li>
        <li style={{ padding: 10 }}>
          <b>Please do not abuse adding comments.</b> This site is not
          responsible for posted profanity as comments.
        </li>
        <li>
          Only authenticated (logged in) users can add a new blog item to the
          list.
        </li>
        <li>Only authenticated (logged in) users can delete their comment.</li>
        <li style={{ padding: 10 }}>
          <b>There is no new user registration.</b>
        </li>
      </ul>
    </div>
  )
}

export default Usage
