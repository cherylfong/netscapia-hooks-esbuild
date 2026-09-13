import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

import useField from '../hooks/useField'

const BlogForm = ({ createBlog }) => {
  // const [newBlogTitle, setBlogTitle] = useState('')
  // const [newBlogAuthor, setBlogAuthor] = useState('')
  // const [newBlogUrl, setBlogUrl] = useState('http://')

  const newBlogTitle = useField('outlined-required', 'title', 'text', '')
  const newBlogAuthor = useField('outlined-required', 'author', 'text', '')
  const newBlogUrl = useField('outlined-required', 'url', 'text', 'http://')

  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newBlogTitle.value,
      author: newBlogAuthor.value,
      url: newBlogUrl.value,
    })

    navigate('/')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <TextField
          required
          {...newBlogTitle}
          placeholder="What's the name of the blog?"
          style={{ marginTop: 10 }}
        />
      </div>
      <div>
        <TextField
          required
          {...newBlogAuthor}
          placeholder="Who wrote the blog?"
          style={{ marginTop: 10 }}
        />
      </div>
      <div>
        <TextField
          required
          {...newBlogUrl}
          style={{ marginTop: 10 }}
        />
      </div>
      <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
        save
      </Button>
    </form>
  )
}

export default BlogForm
