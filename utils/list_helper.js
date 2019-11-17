const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0);
};

module.exports = {
  dummy, totalLikes,
};