const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');
const bloglist = require('../models/bloglist');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

//@desc: tests relating to GET requests
describe('when fetching blogs', () => {
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
});

//@desc: tests relating to POST requests
describe('when creating a new blog', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});

    //the normal process would be to send a POST req
    //and the route handlers handles saving to database
    //after running needed operation and change making.
    //Since we are not exposed to all functionality when testing,
    //we save what would be the end result of a POST req op
    //directly to the database, namely; a name, username and pwHash.
    const passwordHash = await bcrypt.hash('test', 10);
    const user = new User({ username: 'test', passwordHash });
    await user.save();

    const login = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' });

    token = login.body.token;
  });

  test('a valid blog is created', async () => {
    const newBlog = {
      title: 'title A',
      author: 'author A',
      url: 'url A',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');

    const contents = response.body.map((b) => b.title);
    // toContain matcher checks if an array contains specified value
    expect(contents).toContain('title A');
  });

  test('the "likes" property defaults to zero if missing in request', async () => {
    const newBlog = {
      title: 'title A',
      author: 'author A',
      url: 'url A',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
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
});

//@desc: tests relating to PUT requests
describe('when updating a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    for (const blog of bloglist) {
      const blogObj = new Blog(blog);
      await blogObj.save();
    }
  });

  test('blog is successfully updated', async () => {
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
});

//@desc: tests relating to DELETE requests
describe('when deleting a blog', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('test', 10);

    const user = new User({ username: 'test', passwordHash });
    await user.save();

    const login = await api
      .post('/api/login')
      .send({ username: 'test', password: 'test' });

    token = login.body.token;
  });

  test('blog is deleted only by its owner', async () => {
    const newBlog = {
      title: 'title A',
      author: 'author A',
      url: 'url A',
      likes: 0,
    };

    const savedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`);

    const idToDelete = savedBlog.body.id;

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204);

    const response = await api.get('/api/blogs');
    const content = response.body.find((b) => b.id === idToDelete);
    expect(content).toBeUndefined();
  });
});

afterAll(() => mongoose.connection.close());

