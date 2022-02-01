/* eslint-disable no-undef */
const config = require('./utils/config');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
require('express-async-errors');
const express = require('express');
const app = express();

const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const mongoose = require('mongoose');

logger.info('connecting to MongoDB');

mongoose.connect(config.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {logger.info('connected to MongoDB');})
    .catch((error) => {logger.error('error connection to MongoDB:', error.message); });

app.use(cors());
//app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing');
    app.use('/api/testing', testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;