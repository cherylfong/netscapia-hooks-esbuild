const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 100,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BloglistEntry',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

commentSchema.index({ blog: 1, createdAt: -1 })

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment