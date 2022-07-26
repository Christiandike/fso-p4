const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// next is for error handling

// @desc get all blog posts
// method: GET
// route: /api/persons/
blogRouter.get('/', (req, res, next) => {
  Blog
    .find({})
    .then((blogs) => {
      res.json(blogs);
    })
    .catch((err) => next(err));
});

// @desc make a blog post
// method: GET
// route: /api/persons/
blogRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => next(err));
});

module.exports = blogRouter;
