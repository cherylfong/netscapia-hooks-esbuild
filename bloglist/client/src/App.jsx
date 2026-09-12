import { useState, useEffect } from 'react'
import { Typography, Container, Button, AppBar, Toolbar } from '@mui/material'


import {
  Routes, Route, Link,
  useNavigate
} from 'react-router-dom'

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

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [user, setUser] = useState(null)

  const [notify, setNotify] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {

      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const createBlog = (blogItemObject) => {

    blogService
      .create(blogItemObject)
      .then(() => blogService.getAll())
      .then(refreshedBlogs => {
        console.log(refreshedBlogs)

        setBlogs(refreshedBlogs)

        setNotify(
          {
            text:`Blog item titled "${blogItemObject.title}" added`,
            type: 'success'
          }
        )
        resetNotification()
      }).catch(error => {

        if (error.response.status === 400) {

          setNotify(
            {
              text:'Fill in all fields',
              type: 'warning'
            }
          )
        } else {
          setNotify(
            {
              text:`ERROR: status ${error.response.status}`,
              type: 'error'
            }
          )
        }
      })
      .finally(resetNotification)


  }

  const updateBlogLikes = (blogId, blogObject) => {

    blogService
      .update(blogId, blogObject)
      // update blogs with the new updated blog
      .then(() => blogService.getAll())
      .then(refreshedBlogs => {
        console.log(refreshedBlogs)

        setBlogs(refreshedBlogs)

        setNotify(
          {
            text:`Blog item titled "${blogObject.title}" updated with ${blogObject.likes} 👍`,
            type: 'success'
          }
        )
      })
      .catch(error => {

        setNotify(
          {
            text: `ERROR: ${error.message}`,
            type: 'error'
          }
        )
      })
      .finally(resetNotification)

  }

  // only the logged-in users who is the original poster
  // (the user who added it) can delete the blog item
  const removeBlog = (blogId) => {
    return blogService
      .remove(blogId)
      .then(() => blogService.getAll())
      .then(refreshedBlogs => {
        console.log('REMOVED: ', refreshedBlogs)

        setBlogs(refreshedBlogs)

        setNotify(
          {
            text:'Blog item removed!',
            type: 'success'
          }
        )
      }).catch(error => {

        setNotify(
          {
            text: `ERROR: ${error.message}`,
            type: 'error'
          }
        )
      })
      .finally(resetNotification)

  }

  const handleLogin = async (username, password, setUsername, setPassword) => {


    try {

      if (password === '' || username === '') {
        throw new Error('Please enter both username and password')
      }

      const user = await loginService.login({ username, password })

      // save user's logged in username to browser key-value database
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)

      setUsername('')
      setPassword('')
      navigate('/')

      setNotify(
        {
          text: `🎊 Welcome back ${username}!`,
          type: 'info'
        }
      )

    } catch (error) {

      if (error.message.includes(401)) {

        setNotify(
          {
            text: 'Invalid credentials! 🔐 Try again 😀',
            type: 'error'
          }
        )

      } else {

        setNotify(
          {
            text: `${error.message}`,
            type: 'error'
          }
        )
      }

    } finally {
      resetNotification()
    }
  }


  const handleLogOff = () => {
    window.localStorage.clear()
    setUser(null)
    navigate('/')
    setNotify(
      {
        text: 'Log off successful!',
        type: 'success'
      })
    resetNotification()
  }

  const resetNotification = async () => {
    await setTimeout(() => {
      setNotify(null)
    }, 5000)
  }

  const linkPadding = {
    padding: 5,
    color: 'purple'
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
            component={Link} to="/about"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            BLOGLIST
          </Typography>

          <Button color="inherit" component={Link} to="/how-to-use" sx={styleToolBar}>USAGE GUIDE</Button>

          <Button color="inherit" component={Link} to="/" sx={styleToolBar}>BLOGS</Button>

          {user && <Button color="inherit" component={Link} to="/add" sx={styleToolBar}>ADD</Button>}

          {user && (<Button color="inherit" component={Link} to="/" onClick={handleLogOff} sx={styleToolBar}>Logout</Button>
          )}

          {user && (
            <span style={linkPadding} to=''>| {user.name ?? user.username} is logged in.</span>
          )}
          <Button color="inherit" component={Link} to="/login" sx={styleToolBar}> {!user && (
            <>LOGIN</>
          )}</Button>

        </Toolbar>
      </AppBar>

      <Notify notify={notify}/>

      <Routes>
        <Route path='/how-to-use' element={<Usage />} />
        <Route path='/' element={
          <FilterBlogs blogs={blogs} user={user} updateBlogLikes={updateBlogLikes} removeBlog={removeBlog} />} />
        <Route path='/login' element={<LoginForm handleLogin={handleLogin} />} />

        <Route path='/about' element={<About/>} />

        <Route path='/add' element={<BlogForm createBlog={createBlog} />} />

        {/* <Route path="/:id" element={
          <Blog blog={blog}
            loggedInUser={user?.username}
            updateBlogLikes={updateBlogLikes}
            removeBlog={removeBlog}/>
        } /> */}

        {/*NOTE TO SELF ^^^
          *
          * The above code for Route to the id of a blog item works.
          * HOWEVER, when that page is refreshed,
          * An error occurs with the value of blog as being undefined.
          * The blog UseState is populated asynchronously.
          * The refreshed page loses the passed-in blog prop until the client fetch finishes.
          * The code below using BlogPage fetches a blog by id from the server when rendered.
          */}

        <Route path='/:id' element={
          <BlogPage
            blogs={blogs}
            loggedInUser={user?.username}
            updateBlogLikes={updateBlogLikes}
            removeBlog={removeBlog}
          />
        } />
      </Routes>

      <Footer>
        <div>
          Bloglist <span style={{ fontSize: 'small' }}>2026</span>
        </div>
      </Footer>
    </Container>
  )
}

export default App