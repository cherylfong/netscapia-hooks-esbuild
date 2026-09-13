// src/components/BlogPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import Blog from './Blog'

export default function BlogPage({
  blogs,
  loggedInUser,
  updateBlogLikes,
  removeBlog,
}) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(() => blogs.find((b) => b.id === id) || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!blog) {
      blogService
        .get(id)
        .then((fetched) => setBlog(fetched))
        .catch((error) => {
          if (error.response?.status === 400) {
            navigate('404', { replace: true })
            setBlog(null)
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id, blog, navigate])

  // re-sync when parent `blogs` prop updates (e.g., after likes update)
  useEffect(() => {
    const found = blogs.find((b) => b.id === id)
    if (found) setBlog(found)
  }, [blogs, id])

  const handleRemove = async (blogId) => {
    try {
      await removeBlog(blogId)
      navigate('/')
    } catch (error) {
      // removal already reports errors via parent notification
      console.log(error.message)
      navigate('/')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!blog) return null
  return (
    <Blog
      blog={blog}
      loggedInUser={loggedInUser}
      updateBlogLikes={updateBlogLikes}
      removeBlog={handleRemove}
      startCollapsed={false}
    />
  )
}
