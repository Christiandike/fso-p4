const listHelper = require('../utils/list_helper');
const blog = require('../models/bloglist');

test('dummy returns one', () => {
  expect(listHelper.dummy(blog)).toBe(1);
});
