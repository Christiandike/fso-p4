const blogRouter = require('express').Router();
const Blog = require('../models/blog');

// next is for error handling

// @desc get all blog posts
// method: GET
// route: /api/blogs/
blogRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    next(err);
  }
});

// @desc make a blog post
// method: POST
// route: /api/blogs/
blogRouter.post('/', async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.url) {
      return res.status(400).json({ error: 'must include title and url' });
    }

    if (!req.body.likes) {
      req.body = { ...req.body, likes: 0 };
      const blog = await new Blog(req.body).save();
      return res.status(201).json(blog);
    }

    const blog = await new Blog(req.body).save();
    return res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

// @desc delete a blog post
// method: DELETE
// route: /api/blogs/:id
blogRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// @desc update a blog post
// method: PUT
// route /api.blogs/:id
blogRouter.put('/:id', async (req, res, next) => {
  try {
    updatedItem = {
      likes: req.body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedItem,
      { new: true },
    );
    // the {new: true} is an optional parameter that
    // causes the event handler to be called with the new
    // modified document instead of the original
    res.status(200).json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogRouter;
