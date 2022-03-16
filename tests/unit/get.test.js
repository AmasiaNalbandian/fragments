// tests/unit/get.test.js

const request = require('supertest');
const hash = require('../../src/hash');

const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated users request a fragment that does not exist', async () => {
    const res = await request(app)
      .get('/v1/fragments/123123123')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users request a fragment that does exist', async () => {
    const user = hash('user1@email.com');
    const data = 'This is my test string';
    const fragment = new Fragment({
      ownerId: user,
      type: 'text/plain',
      size: 0,
    });
    await fragment.setData(Buffer.from(data, 'utf8'));
    await fragment.save();
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toStrictEqual(data);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  // I'm unable to do this, there's an issue with my authenticate function
});
