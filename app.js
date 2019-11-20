const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(bodyParser.json());
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use(cors());
app.use(middleware.errorHandler);

module.exports = app;
