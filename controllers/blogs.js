const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

const { usersInDb } = require('../tests/test_helper')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

/// testaaa toimiiko nyt lisäys? sitten middleware käyttöön muihinkin
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  //const user = await User.findById(decodedToken.id)
  const user = request.user

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else {
      return response.status(401).json({ error: 'invalid user, no access' })
    }
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const updateInfo = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    updateInfo,
    { new: true }
  )

  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
