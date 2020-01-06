const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request;
  const user = await User.findById(body.id);
  const blog = new Blog({
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
    user: user.id,
  });
  try {
    const result = await blog.save();
    user.blogs = user.blogs.concat(result.id);
    await user.save();
    response.status(201).json(result);
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const update = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true });
    response.json(update.toJSON());
  } catch (exception) {
    next(exception);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogsRouter;
