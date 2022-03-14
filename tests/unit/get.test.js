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
    const fragment = new Fragment({
      ownerId: user,
      type: 'text/plain',
      size: 0,
    });
    fragment.save();
    const res = await request(app)
      .get(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(await Fragment.byId(res.body.fragment.ownerId, res.body.fragment.id)).toStrictEqual(
      await Fragment.byId(fragment.ownerId, fragment.id)
    );
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  // I'm unable to do this, there's an issue with my authenticate function
});
