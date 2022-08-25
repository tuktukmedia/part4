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
  const countNames = Object.values(
    blogs.reduce((obj, { author }) => {
      if (obj[author] === undefined) obj[author] = { author: author, blogs: 1 }
      else obj[author].blogs++
      return obj
    }, {})
  )

  const maxBlogs = Math.max(...countNames.map(i => i.blogs))
  const activeAuthor = countNames.filter(blog => blog.blogs === maxBlogs)

  const result = {
    author: activeAuthor[0].author,
    blogs: activeAuthor[0].blogs
  }

  return result
}

const mostLikes = blogs => {
  const likesPerAuthor = Array.from(
    blogs.reduce(
      (i, { author, likes }) => i.set(author, (i.get(author) || 0) + likes),
      new Map()
    ),
    ([author, likes]) => ({ author, likes })
  )

  const maxLikes = Math.max(...likesPerAuthor.map(i => i.likes))
  const likedAuthor = likesPerAuthor.filter(like => like.likes === maxLikes)

  const result = {
    author: likedAuthor[0].author,
    likes: likedAuthor[0].likes
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
