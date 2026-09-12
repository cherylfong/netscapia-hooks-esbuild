const bloglistRouter = require('express').Router()

const Blog = require('../models/bloglist')
const User = require('../models/user')

const { userExtractor } = require('../utils/middleware')


// Use relative path of the URL:
// Since defined in app.js that any route which
// begins with /api/blogs will use definitons in this module.

bloglistRouter.get('/', async (request, response) => {

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

bloglistRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

bloglistRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!body.title || !body.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

bloglistRouter.delete('/:id', userExtractor, async (request, response) => {
  try {

    const blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(404).end()

    // only get blog owner username if needed for the error message
    const user = request.user
    const userIDFromBlog = blog.user.toString()
    const userIDFromLogin = user.id.toString()

    if (userIDFromLogin !== userIDFromBlog) {
      const owner = await User.findById(blog.user)
      const ownerName = owner ? owner.username : 'unknown'
      return response.status(401).json({ error: `Only original poster can delete posted blog - blog owner: ${ownerName}` })
    }

    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  } catch (error) {
    return response.status(400).json({ error: error.message })
  }
})

bloglistRouter.put('/:id', userExtractor, async (request, response) => {

  let blog = await Blog.findById(request.params.id)

  if (!blog) {

    return response.status(404).end()
  }

  const user = request.user

  const userIDFromBlog = blog.user.toString()

  const { likes, url, author, title } = request.body
  if (user) {
    const userIDFromLogin = user.id.toString()

    // The user who posted the blog making changes?
    const isOwner = userIDFromBlog === userIDFromLogin

    // if updated likes are the same as the original likes OR
    // likes is not provided at all
    // then check if logged in user is the one making updates
    // to the blog they have added
    const changesOwnerField =
      (title !== undefined && title !== blog.title) ||
      (author !== undefined && author !== blog.author) ||
      (url !== undefined && url !== blog.url)

    if (!isOwner && changesOwnerField) {

      if (!request.token) {
        return response.status(401).json({
          error: 'Login to change title, author, or url'
        })
      }
      return response.status(403).json({
        error: 'Only the original poster can update title, author, or url'
      })
    }

    if (isOwner) {
      blog.url = url ? url : blog.url
      blog.author = author ? author : blog.author
      blog.title = title ? title : blog.title

    }
  }

  // any user can update likes
  if (likes !== undefined) {
    blog.likes = likes
  }



  const updatedBlog = await blog.save()
  return response.status(200).json(updatedBlog)

})

module.exports = bloglistRouter