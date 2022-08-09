const { request } = require('express');
const logger = require('./logger');
const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/user');

const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  next();
};

const tokenExtractor = (req, res, next) => {
  if (
    req.get('authorization') &&
    req.get('authorization').toLowerCase().startsWith('bearer ')
  ) {
    req.token = req.get('authorization').substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(400).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(req.token, config.TOKEN_SECRET);
  req.user = await User.findById(decodedToken.id);
  next();

  // const authorization = req.get('authorization')
  // if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
  //   const decodedToken = jwt.verify(authorization.substring(7), config.TOKEN_SECRET)
  //   if(decodedToken) {
  //     req.user = await User.findById(decodedToken.id)
  //   }
  // }
  // next()
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.name);

  // castError
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'invalid id' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  }

  next(err);
};

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'unknown error' });
};

module.exports = {
  reqLogger,
  errorHandler,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
};

