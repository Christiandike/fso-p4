const loginRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const passwordCorrect = !user
      ? false
      : await bcrypt.compare(password, user.passwordHash);

    if (passwordCorrect === false) {
      return res.status(401).json({ error: 'invalid username or password' });
    }

    const userForToken = {
      username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, config.TOKEN_SECRET);

    res.status(200).json({ token, username, name: user.name });
  } catch (err) {
    next(err);
  }
});

module.exports = loginRouter;
