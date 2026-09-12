const Usage = () => {
  return (
    <div>
      <ul>
        <li>Blogs can only be deleted by the original user who added it. <a href='/login'>Login</a> to see delete button.</li>
        <li>All users including unauthenticated users can like blog items.</li>
        <li>Only authenticated (logged in) users can add a new blog item to the list.</li>
        <li><b>There is no new user registration.</b></li>
      </ul>
    </div>
  )
}

export default Usage