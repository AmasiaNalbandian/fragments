// tests/unit/post.test.js

const request = require('supertest');
require('dotenv').config();

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair but unsupported content type
  test('authenticated user requests unsupported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send({ body: 'this is a fragment' });
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users request supported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('this is a fragment');

    expect(res.statusCode).toBe(201);
    // expect(res.headers.location).toBe(`${process.env.API_URL}/fragments/${res.body.fragment.id}`);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  // I'm unable to do this, there's an issue with my authenticate function
});
