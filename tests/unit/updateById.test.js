// tests/unit/post.test.js

const request = require('supertest');
require('dotenv').config();

const app = require('../../src/app');
const hash = require('../../src/hash');
const { Fragment } = require('../../src/model/fragment');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair but unsupported content type
  test('authenticated users updates a text/plain fragment that does exist', async () => {
    const user = hash('user1@email.com');
    const data = 'this is the edited fragment';
    const fragment = new Fragment({
      ownerId: user,
      type: 'text/plain',
      size: 0,
    });
    await fragment.setData(Buffer.from(data, 'utf8'));
    await fragment.save();
    const res = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/plain')
      .send(data);
    const cn = JSON.parse(res.text);

    expect(res.statusCode).toBe(201);
    expect(cn.status).toBe('ok');
  });

  test('authenticated users updates a text/plain fragment that does exist, to an unsupported type', async () => {
    const user = hash('user1@email.com');
    const data = 'this is the edited fragment';
    const fragment = new Fragment({
      ownerId: user,
      type: 'text/plain',
      size: 0,
    });
    await fragment.setData(Buffer.from(data, 'utf8'));
    await fragment.save();
    const res = await request(app)
      .put(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-type', 'text/javascript')
      .send(data);
    const cn = JSON.parse(res.text);

    expect(res.statusCode).toBe(415);
    expect(cn.status).toBe('error');
  });
});
