const userRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//@desc fetch all users
//method: GET
//route: /api/users/
userRouter.get('/', async (req, res, next) => {
  try {
    const returnedUsers = await User.find({}).populate('blogs', {
      url: 1,
      title: 1,
      author: 1,
    });
    res.status(200).json(returnedUsers);
  } catch (err) {
    next(err);
  }
});

//@desc create a new user
//method: POST
//route: /api/users/
userRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body;
    const userExists = await User.findOne({ username });

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'username and password are required' });
    }

    if (username.length < 3 || password.length < 3) {
      return res.status(400).json({
        error: 'username and password must be up to three characters',
      });
    }

    if (userExists) {
      return res.status(400).json({ error: 'username must be unique' });
    }

    //saltround is a cost factor that controls
    //how much time is needed to calculate a bcrypt hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

    const all = await User.find({});
    console.log(all.map((u) => u.toJSON()));
  } catch (err) {
    next(err);
  }
});

module.exports = userRouter;
