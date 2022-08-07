const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');

// @desc get all blog posts
// method: GET
// route: /api/blogs/
blogRouter.get('/', async (req, res, next) => {
  try {
    //the populate method allows document references
    //to be populated with the actual document fields
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

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
    let body = req.body;

    //if token is verified it returns the object on which it was based
    //object should include: username, and id
    const decodedToken = jwt.verify(req.token, config.TOKEN_SECRET);

    //if token is invalid, dont even proceed
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    //if valid, the id is taken and used to retrieve the users details and assign the user as creator of the blog. see lines 52, 55
    const user = await User.findById(decodedToken.id);

    if (!req.body.title || !req.body.url) {
      return res.status(400).json({ error: 'must include title and url' });
    }

    if (!req.body.likes) {
      body = { ...body, likes: 0 };

      //the id of user is stored with the created blog
      const savedBlog = await new Blog({ ...body, user: user._id }).save();

      //the id of the created blog is stored with the user
      user.blogs = user.blogs.concat(savedBlog._id);
      //and saved
      await user.save();

      return res.status(201).json(savedBlog);
    }

    const savedBlog = await new Blog({ ...body, user: user._id }).save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    next(err);
  }
});

// @desc delete a blog post
// method: DELETE
// route: /api/blogs/:id
blogRouter.delete('/:id', async (req, res, next) => {
  try {
    const blogToDelete = req.params.id;
    const decodedToken = jwt.verify(req.token, config.TOKEN_SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    const ownsBlog = user.blogs.some((b) => b._id.toString() === blogToDelete);

    if (ownsBlog === false) {
      return res
        .status(401)
        .json({ error: 'user can only delete owned blogs' });
    }

    await Blog.findByIdAndRemove(blogToDelete);
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
      { new: true }
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

