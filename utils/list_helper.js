const _ = require('lodash');

const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => blogs.reduce((max, blog) => (max.likes > blog.likes
  ? max : blog));

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const mostPopularAuthor = _.head(_(authors)
    .countBy()
    .entries()
    .maxBy(_.last));
  const numberOfBlogs = blogs.filter((blog) => blog.author === mostPopularAuthor).length;
  return {
    author: mostPopularAuthor,
    blogs: numberOfBlogs,
  };
};

const mostLikes = (blogs) => {
  const authors = _.uniq(blogs.map((blog) => blog.author));
  const answer = {
    author: '',
    likes: 0,
  };
  authors.forEach((author) => {
    const blogsByAuthor = blogs.filter((blog) => blog.author === author);
    const authorLikes = _.sumBy(blogsByAuthor, (blog) => blog.likes);
    if (authorLikes > answer.likes) {
      answer.author = author;
      answer.likes = authorLikes;
    }
  });
  return answer;
};


module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
};
