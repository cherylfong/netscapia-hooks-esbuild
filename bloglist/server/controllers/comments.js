const commentsRouter = require('express').Router()
const blogCommentsRouter = require('express').Router({ mergeParams: true })
const Comment = require('../models/comments')

const { optionalUserExtractor } = require('../utils/middleware')

commentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({})
    .populate('user', { username: 1, name: 1 })
    .populate('blog', { _id: 1, title: 1, author: 1, url: 1 })
  response.json(comments)
})

commentsRouter.get('/:id', async (request, response) => {
  const comment = await Comment.findById(request.params.id)
  if (comment) {
    response.json(comment)
  } else {
    response.status(404).end()
  }
})

// only logged in Users can delete their comments
// anoymous comments cannot be deleted via DELETE REQUEST
commentsRouter.delete(
  '/:id',
  optionalUserExtractor,
  async (request, response) => {
    try {
      const comment = await Comment.findById(request.params.id)

      if (!comment) return response.status(404).end()

      const user = request.user

      const userIDFromComment = comment.user ? comment.user.toString() : null
      console.log('userIDFromComment: ', userIDFromComment)

      const userIDFromLogin = user ? user.id.toString() : '-1'

      if (userIDFromLogin !== userIDFromComment) {
        return response.status(401).json({
          error: 'Only original poster can delete their comment ',
        })
      }

      await Comment.findByIdAndDelete(request.params.id)
      return response.status(204).end()
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      })
    }
  },
)

blogCommentsRouter.get('/', async (request, response) => {
  const comments = await Comment.find({
    blog: request.params.blogId,
  })
    .populate('user', { username: 1, name: 1 })
    .sort({ createdAt: -1 })

  response.json(comments)
})

blogCommentsRouter.post(
  '/',
  optionalUserExtractor,
  async (request, response) => {
    const body = request.body

    const user = request.user

    if (!body.content || body.content.length < 2 || body.content.length > 100) {
      return response.status(400).json({
        error: 'comment must be between 2 and 100 characters long',
      })
    }

    const comment = new Comment({
      content: body.content,
      blog: request.params.blogId,
      user: user ? user._id : null,
    })

    const savedComment = await comment.save()
    response.status(201).json(savedComment)
  },
)

module.exports = { commentsRouter, blogCommentsRouter }
