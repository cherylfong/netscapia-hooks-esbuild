const getUser = () => {
  return window.localStorage.getItem('loggedBlogUser')
}

// save user's logged in username to browser key-value database
const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogUser', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('loggedBlogUser')
}

export default { getUser, saveUser, removeUser }
