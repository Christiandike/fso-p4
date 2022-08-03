const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');
const bloglist = require('../models/bloglist');

beforeEach(async () => {
  await Blog.deleteMany({});

  for (const blog of bloglist) {
    const blogObj = new Blog(blog);
    await blogObj.save();
  }
});

test('blogs are returned as JSON', async () => {
  api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(bloglist.length);
});

// toBeDefined matcher verifies the existence of a property
// it checks that the property is not undefined
test('blogs return ID property', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body.map((item) => item.id)).toBeDefined();
});

test('valid blog is created', async () => {
  const newBlog = {
    title: 'title A',
    author: 'author A',
    url: 'url A',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(bloglist.length + 1);

  const contents = response.body.map((b) => b.title);
  // toContain matcher checks if an array contains specified value
  expect(contents).toContain('title A');
});

test('"likes" property defaults to zero if missing in request', async () => {
  const newBlog = {
    title: 'title A',
    author: 'author A',
    url: 'url A',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const content = response.body.find((b) => b.title === newBlog.title);
  expect(content.likes).toBe(0);
});

test('invalid blog is not created', async () => {
  const newBlog = {
    author: 'author A',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

test('blog is deleted', async () => {
  const blogs = await api.get('/api/blogs');
  const idToDelete = blogs.body[0].id;

  await api.delete(`/api/blogs/${idToDelete}`).expect(204);

  const response = await api.get('/api/blogs');
  const content = response.body.find((b) => b.id === idToDelete);
  expect(content).toBeUndefined();
});

test('blog is updated', async () => {
  const blogs = await api.get('/api/blogs');
  const idToUpdate = blogs.body[0].id;

  const updatedItem = {
    likes: 250,
  };

  await api
    .put(`/api/blogs/${idToUpdate}`)
    .send(updatedItem)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const content = response.body.find((b) => b.id === idToUpdate);
  expect(content.likes).toBe(updatedItem.likes);
});

afterAll(() => mongoose.connection.close());
