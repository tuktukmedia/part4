const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const countLikes = blogs.reduce(
    (total, currentItem) => total + currentItem.likes,
    0
  )
  return countLikes
}

const favoriteBlog = blogs => {
  const maxLikes = Math.max(...blogs.map(i => i.likes))
  const mostLiked = blogs.find(i => i.likes === maxLikes)

  const result = {
    title: mostLiked.title,
    author: mostLiked.author,
    likes: mostLiked.likes
  }

  return result
}

const mostBlogs = blogs => {
  const countBlogs = _(blogs).countBy('author').entries().maxBy(_.last)

  const result = {
    author: countBlogs[0],
    blogs: countBlogs[1]
  }
  return result
}

const mostLikes = blogs => {
  const countLikes = _(blogs)
    .groupBy('author')
    .map((obj, key) => ({
      author: key,
      likes: _.sumBy(obj, 'likes')
    }))
    .value()

  const maxLikes = Math.max(...countLikes.map(i => i.likes))
  const mostLiked = countLikes.filter(like => like.likes === maxLikes)

  const result = {
    author: mostLiked[0].author,
    likes: mostLiked[0].likes
  }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
