const testingRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

testingRouter.post('/reset/users', async(req, res) => {
    await User.deleteMany({});
    res.status(204).end();
});

testingRouter.post('/reset/blogs', async(req, res) => {
    await Blog.deleteMany({});
    res.status(204).end();
});

module.exports = testingRouter;