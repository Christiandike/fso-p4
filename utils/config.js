require('dotenv').config();

const {
  PORT, MONGO_DEV, MONGO_PROD, MONGO_TEST, NODE_ENV,
} = process.env;

const MONGO = NODE_ENV === 'test'
  ? MONGO_TEST
  : NODE_ENV === 'development'
    ? MONGO_DEV
    : MONGO_PROD;

module.exports = {
  MONGO,
  PORT,
};
