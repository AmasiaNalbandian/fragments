// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('Route does not exist', () => request(app).get('/v2/fragments').expect(404));

  // If the route exists under .routes
  test('should return HTTP 401 for a route which exists, but unauthorized', () =>
    request(app).get('/v1/fragments').auth('wrongemail@email.com', '123123123').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('should return object with correct data', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.author).toBe('Amasia Nalbandian');
    expect(res.body.githubUrl).toBe('https://github.com/AmasiaNalbandian/fragments');
  });
});
