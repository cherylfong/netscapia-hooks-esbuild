const router = require('express').Router()
const Bloglist = require('../models/bloglist')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Bloglist.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router