import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {

  const [newBlogTitle, setBlogTitle] = useState('')
  const [newBlogAuthor, setBlogAuthor] = useState('')
  const [newBlogUrl, setBlogUrl] = useState('http://')

  const navigate = useNavigate()

  const addBlog = (event) => {

    event.preventDefault()

    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('http://')
    navigate('/')
  }


  return (
    <form onSubmit={addBlog}>
      <div >

        <TextField
          required
          id="outlined-required"
          label="title"
          placeholder="What's the name of the blog?"
          value={newBlogTitle}
          onChange={event => setBlogTitle(event.target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <div>
        <TextField
          required
          id="outlined-required"
          label="author"
          placeholder='Who wrote the blog?'
          value={newBlogAuthor}
          onChange={event => setBlogAuthor(event.target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <div>
        <TextField
          required
          id="outlined-required"
          label="url"
          value={newBlogUrl}
          onChange={event => setBlogUrl(event.target.value)}
          style={{ marginTop: 10 }}
        />
      </div>
      <Button type="submit" variant='contained' style={{ marginTop: 10 }}>
        save
      </Button>
    </form>
  )
}

export default BlogForm