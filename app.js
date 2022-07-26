const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const blogRouter = require('./controllers/blogController');
const userRouter = require('./controllers/userController');
const loginRouter = require('./controllers/loginController');

mongoose
  .connect(config.MONGO)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((err) => {
    logger.error('failed to connect to MongoDB:', err.msg);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.reqLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;

