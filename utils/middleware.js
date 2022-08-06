const { request } = require('express');
const logger = require('./logger');

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
};

