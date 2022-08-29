const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const allUsers = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1
  })
  response.json(allUsers)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const userNameNotUnique = await User.findOne({ username })
  if (userNameNotUnique) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  if (!password) {
    return response.status(400).json({ error: 'password is missing' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password is too short (3 minimum)' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
