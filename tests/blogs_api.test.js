const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Ruoka on hyvää',
    author: 'Seija Soppa',
    url: 'https:/www.keittoblogi.fi/ruoka-on-hyvaa',
    likes: 32
  },
  {
    title: 'Intian ihana Goa',
    author: 'Reppu Reissaaja',
    url: 'https:/www.matkallataas.fi/goalla',
    likes: 77
  },
  {
    title: 'Miksi taas näin?',
    author: 'Keijo Kommentaattori',
    url: 'https:/www.pulinaat.com',
    likes: 5
  }
]
beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
})

test('notes are returned as json', async () => {
  await api.get('/api/blogs').expect('Content-Type', /application\/json/).expect
})

test('there are X notes', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('ID is defined', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('post saved', async () => {
  const newBlog = {
    title: 'Uusi juttu',
    author: 'Kikka Kirjoittaja',
    url: 'https:/www.kikanblogi.fi/uusi-juttu',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  blogsAfter = await api.get('/api/blogs')

  expect(blogsAfter.body).toHaveLength(initialBlogs.length + 1)
})

test('post deleted', async () => {
  const blogsBefore = await api.get('/api/blogs')
  const firstID = blogsBefore.body[0].id

  await api.delete(`/api/blogs/${firstID}`).expect(204)

  const blogsAfter = await api.get('/api/blogs')

  expect(blogsAfter.body).toHaveLength(initialBlogs.length - 1)
})

test('likes updated', async () => {
  const blogsBefore = await api.get('/api/blogs')
  const firstID = blogsBefore.body[0].id
  const likesBefore = blogsBefore.body[0].likes
  const newLikes = { likes: 99 }

  await api.put(`/api/blogs/${firstID}`).send(newLikes).expect(201)

  const blogsAfter = await api.get('/api/blogs')

  expect(blogsAfter.body[0].likes).toBe(99)
})

test('likes set to 0', async () => {
  const newBlog = {
    title: 'Uusi juttu',
    author: 'Kikka Kirjoittaja',
    url: 'https:/www.kikanblogi.fi/uusi-juttu'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await api.get('/api/blogs')
  const likes = blogsAfter.body.map(blog => blog.likes)
  const likeFiltered = likes.filter(like => like !== undefined)

  expect(likeFiltered.length).toBe(likes.length)
})

test('title and url missing', async () => {
  const newBlog = {
    author: 'Huolimaton Kirjoittaja',
    likes: 99
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAfter = await api.get('/api/blogs')
  expect(blogsAfter.body).toHaveLength(initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})
