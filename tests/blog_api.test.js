const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  initialBlogs.forEach(async (blog) => {
    const blogObject = new Blog(blog);
    await blogObject.save();
  });
});

describe('api tests', () => {
  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.length).toBe(2);
  });

  test('blog has id field', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });

  test('creating blog succeeds', async () => {
    const newBlog = {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
    };
    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    expect(postResponse.body.title).toEqual(newBlog.title);
    expect(postResponse.body.author).toEqual(newBlog.author);
    expect(postResponse.body.url).toEqual(newBlog.url);
    expect(postResponse.body.likes).toEqual(newBlog.likes);
    const getResponse = await api
      .get('/api/blogs');
    console.log(getResponse.body);
    expect(getResponse.body.length).toBe(initialBlogs.length + 1);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
