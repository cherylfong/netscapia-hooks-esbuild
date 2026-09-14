import { useEffect } from 'react'
import { Typography, Container, Button, AppBar, Toolbar } from '@mui/material'

import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import About from './components/About'
import Usage from './components/Usage'
import BlogPage from './components/BlogPage'
import Footer from './components/Footer'

import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

import Notify from './components/Notify'
import FilterBlogs from './components/FilterBlogs'

import blogService from './services/blogs'
import loginService from './services/login'
import commentService from './services/comments'

import { ErrorBoundary, getErrorMessage } from 'react-error-boundary'
import SimulatedError from './components/SimulatedError'

import PageNotFound from './components/PageNotFound'

import { useNotificationActions } from './stores/notificationStore'

import { useBlogs } from './hooks/useBlogs'

import { useContext } from 'react'
import UserContext from './UserContext'

import persistentUserService from './services/persistentUser'

import UserTable from './components/UserTable'
import UserDetails from './components/UserDetails'

const App = () => {
  const {
    blogs,
    addBlog: createBlog,
    updateBlogLikes,
    deleteBlog: removeBlog,
  } = useBlogs()

  const { user, setUser } = useContext(UserContext)

  const setNotification = useNotificationActions()

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = persistentUserService.getUser()

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      commentService.setToken(user.token)
    }
  }, [setUser])

  const handleLogin = async (username, password) => {
    try {
      if (password === '' || username === '') {
        throw new Error('Please enter both username and password')
      }

      const user = await loginService.login({ username, password })

      persistentUserService.saveUser(user)

      blogService.setToken(user.token)
      commentService.setToken(user.token)

      setUser(user)

      navigate('/')

      setNotification(`🎊 Welcome back ${username}!`, 5, 'info')
    } catch (error) {
      if (error.message.includes(401)) {
        setNotification('Invalid credentials! 🔐 Try again 😀', 5, 'error')
      } else {
        setNotification(`${error.message}`, 5, 'error')
      }
    }
  }

  const handleLogOff = () => {
    persistentUserService.removeUser()
    setUser(null)
    navigate('/')
    setNotification('Log off successful!', 5, 'success')
  }

  const linkPadding = {
    padding: 5,
    color: 'purple',
  }

  const styleAppBar = { bgcolor: 'rgba(231, 75, 41, 0.6)' }

  const styleToolBar = { '&:hover': { bgcolor: 'rgba(96, 18, 152, 0.51)' } }

  return (
    <Container>
      <AppBar position="static" sx={styleAppBar}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/about"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            BLOGLIST
          </Typography>

          <Button
            color="inherit"
            component={Link}
            to="/how-to-use"
            sx={styleToolBar}
          >
            USAGE GUIDE
          </Button>

          <Button color="inherit" component={Link} to="/" sx={styleToolBar}>
            blogs
          </Button>

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/add"
              sx={styleToolBar}
            >
              ADD
            </Button>
          )}

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/"
              onClick={handleLogOff}
              sx={styleToolBar}
            >
              logout
            </Button>
          )}

          {user && (
            <span style={linkPadding} to="">
              | {user.name ?? user.username} is logged in.
            </span>
          )}

          {!user && (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={styleToolBar}
            >
              login
            </Button>
          )}

          <Button
            color="inherit"
            component={Link}
            to="/users"
            sx={styleToolBar}
          >
            users
          </Button>

          <Button
            color="inherit"
            component={Link}
            to="/simulated-error"
            sx={styleToolBar}
          >
            Simulated Error
          </Button>
        </Toolbar>
      </AppBar>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <p>Something went wrong :(</p>
            <p>{getErrorMessage(error)}</p>
            <br />
            <pre>
              <b>Go to a new page on this website and then click the button.</b>
            </pre>
            <pre>Click the button below ⬇️ to reset the application.</pre>
            <button onClick={resetErrorBoundary}>Click Me!</button>
          </div>
        )}
        onError={(error, info) => {
          // Log the error to your error reporting service
          console.log('ERROR: ', error.message)
          console.log('INFO:', info)
        }}
        onReset={() => {
          // Reset any state that may have caused the error
        }}
      >
        <Notify />

        <Routes>
          <Route path="/how-to-use" element={<Usage />} />
          <Route
            path="/"
            element={
              <FilterBlogs
                blogs={blogs}
                updateBlogLikes={updateBlogLikes}
                removeBlog={removeBlog}
              />
            }
          />
          <Route
            path="/login"
            element={<LoginForm handleLogin={handleLogin} />}
          />

          <Route path="/about" element={<About />} />

          <Route path="/add" element={<BlogForm createBlog={createBlog} />} />

          <Route
            path="/:id"
            element={
              <BlogPage
                blogs={blogs}
                updateBlogLikes={updateBlogLikes}
                removeBlog={removeBlog}
              />
            }
          />
          <Route path="/users" element={<UserTable />} />

          <Route path="/users/:id" element={<UserDetails />} />

          <Route path="/simulated-error" element={<SimulatedError />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ErrorBoundary>

      <Footer>
        <div>
          Bloglist <span style={{ fontSize: 'small' }}>2026</span>
        </div>
      </Footer>
    </Container>
  )
}

export default App
