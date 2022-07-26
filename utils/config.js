require('dotenv').config();

const { MONGO_URI } = process.env;
const { MONGO_LOCALHOST } = process.env;
const { PORT } = process.env;

module.exports = {
  MONGO_URI,
  MONGO_LOCALHOST,
  PORT,
};
