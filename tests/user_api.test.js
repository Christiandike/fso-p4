const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const userlist = require('../models/userlist');

beforeEach(async () => {
  await User.deleteMany({});

  for (const user of userlist) {
    const userObj = new User(user);
    await userObj.save();
  }
});

//@desc: tests relating to POST requests
describe('when creating a new user', () => {
  test('valid user is created', async () => {
    const newUser = {
      name: 'user D',
      username: 'userD',
      password: 'userD',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(userlist.length + 1);

    const contents = response.body.map((u) => u.name);
    expect(contents).toContain('user D');
  });

  test('invalid user is not created', async () => {
    const newUser = {
      name: 'user D',
      //no username and password
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username and password are required');

    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(userlist.length);
  });

  test('password must be valid', async () => {
    const newUser = {
      name: 'user D',
      username: 'userD',
      password: 'A', //not valid <3 chars
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'username and password must be up to three characters'
    );

    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(userlist.length);
  });

  test('username must be valid', async () => {
    const newUser = {
      name: 'user D',
      username: 'D', //not valid, <3 chars
      password: 'userD',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'username and password must be up to three characters'
    );

    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(userlist.length);
  });

  test('username must be unique', async () => {
    const newUser = {
      name: 'user A',
      username: 'userA', //not unique
      password: 'userA',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be unique');

    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(userlist.length);
  });
});

afterAll(() => mongoose.connection.close());
