import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

const Blog = ({ blog, loggedInUser, updateBlogLikes, removeBlog, counter, startCollapsed = true }) => {

  const [view, setView] = useState(startCollapsed)

  const toggleView = () => {
    setView(viewable => !viewable)
  }
  const blogItemStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLikes = () => {

    {
      updateBlogLikes(blog.id,
        {
          title: blog.title,
          author: blog.author,
          url: blog.url,
          likes: blog.likes + 1
        })
    }
  }

  const removeBlogByID = (blogID) => {
    confirm(`🚨 Remove blog "${blog.title}" by ${blog.author}??`)
    removeBlog(blogID)
  }

  if (!counter) counter = 0

  return (
    < div style={blogItemStyle} >

      <p id={`title-author-test-${counter}`}><b><i>{blog.title}</i></b> by {blog.author} | <Link to={`/${blog.id}`}>Details</Link></p>

      <div style={{ display: view ? 'none' : '' }} >
        <a style={{ color: 'green' }}>{blog.url}</a>
        <p id={`likes-id-${counter}`}>{blog.likes} {blog.likes > 1 ? 'likes ' : 'like '}<Button onClick={addLikes} variant="outlined" size="medium" color="secondary">👍</Button></p>
        <p>Added by: {blog.user?.username ?? 'unknown user'}</p>
        <Button onClick={toggleView} size="small" color="secondary">hide view</Button>

        {/* show delete button only if logged in user is the creator */}

        <Button  style={{ display: loggedInUser === blog.user?.username ? '' : 'none', marginLeft : 5 }} variant="contained" color="error" onClick={() => removeBlogByID(blog.id)}>DELETE</Button>
      </div>

      <div style={{ display: view ? '' : 'none' }}  >
        <Button onClick={toggleView} size="small" color="secondary">view</Button>
      </div>

    </div >
  )

}

export default Blog