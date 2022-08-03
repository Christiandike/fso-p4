const listHelper = require('../utils/list_helper');
const blog = require('../models/bloglist');

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    expect(listHelper.totalLikes([{ name: 'nnamdi', likes: 3 }])).toBe(3);
  });

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0);
  });

  test('of a bigger list is calculated right', () => {
    expect(listHelper.totalLikes(blog)).toBe(36);
  });
});
