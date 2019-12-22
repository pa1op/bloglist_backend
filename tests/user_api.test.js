const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./utils/test_helper');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({ username: 'root', password: 'sekret' });
    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('username and password must be > 3 characters', async () => {
    const testUser1 = {
      username: 'n',
      name: 'NN',
      password: 'kala',
    };
    await api
      .post('/api/users')
      .send(testUser1)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    const testUser2 = {
      username: 'Esko',
      name: 'NN',
      password: 'k',
    };
    await api
      .post('/api/users')
      .send(testUser2)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
