// src/components/BlogPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import blogService from '../services/blogs'
import Blog from './Blog'

export default function BlogPage({ blogs, loggedInUser, updateBlogLikes, removeBlog }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(() => blogs.find(b => b.id === id) || null)

  useEffect(() => {
    if (!blog) {
      blogService.get(id).then(fetched => setBlog(fetched)).catch(() => setBlog(null))
    }
  }, [id, blog])

  // re-sync when parent `blogs` prop updates (e.g., after likes update)
  useEffect(() => {
    const found = blogs.find(b => b.id === id)
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

  if (!blog) return <div>Loading...</div>
  return <Blog blog={blog} loggedInUser={loggedInUser} updateBlogLikes={updateBlogLikes} removeBlog={handleRemove} startCollapsed={false} />
}