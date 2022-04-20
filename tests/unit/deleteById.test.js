// tests/unit/deleteById.test.js

const request = require('supertest');
require('dotenv').config();

const app = require('../../src/app');
const hash = require('../../src/hash');
const { Fragment } = require('../../src/model/fragment');

describe('DELETE /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair delete fragment which exists
  test('authenticated user creates delete requests for fragment which does exist', async () => {
    // Create new fragment
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
      .delete(`/v1/fragments/${fragment.id}`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
