const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const newBlog = new Blog(request.body)
    const savedBlog = await newBlog.save()

    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
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
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
