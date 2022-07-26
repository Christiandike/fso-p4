const logger = require('./logger');

const reqLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:', req.path);
  logger.info('Body:', req.body);
  next();
};

const errorHandler = (err, req, res, next) => {
  logger.error(err.name);

  // castError
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'invalid id' });
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
};
