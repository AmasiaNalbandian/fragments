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
  test('authenticated user creates POST requests for unsupported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  test('authenticated users creates POST request for text/plain content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send('this is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain')).toBe(true);
  });

  test('authenticated users creates POST request for text/html content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/html')
      .send('this is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/html')).toBe(true);
  });

  test('authenticated users creates POST request for text/markdown content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/markdown')
      .send('this is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/markdown')).toBe(true);
  });

  test('authenticated users creates POST request for application/json content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'application/json')
      .send('this is a fragment');

    expect(res.statusCode).toBe(201);
    expect(res.text.includes('application/json')).toBe(true);
  });

  test('Unauthenticated users request supported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password')
      .set('Content-type', 'text/plain')
      .send('this is a fragment');
    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe('error');
    expect(res.body.error.message).toBe('Unauthorized');
  });
});
