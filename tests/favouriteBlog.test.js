const listHelper = require('../utils/list_helper');
const blog = require('../models/bloglist');

describe('favourite blog', () => {
  test('of empty list is zero', () => {
    expect(listHelper.favouriteBlog([])).toBe('No blog');
  });

  test('of a bigger list is calculated right', () => {
    expect(listHelper.favouriteBlog(blog)).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    });
  });
});

