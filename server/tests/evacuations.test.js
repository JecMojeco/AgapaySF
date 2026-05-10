const request = require('supertest');
const app = require('../server');
const db = require('../config/db');

describe('Evacuation API', () => {
  let adminSession;

  beforeAll(async () => {
    // Login as admin for tests
    const response = await request(app)
      .post('/api/auth/login')
      .send({ contact_number: '09123456789', password: 'password' }); // Assuming admin exists
    adminSession = response.headers['set-cookie'];
  });

  test('GET /api/evacuations should return list of evacuations', async () => {
    const res = await request(app)
      .get('/api/evacuations')
      .set('Cookie', adminSession);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  test('POST /api/evacuations should log a new arrival', async () => {
    const res = await request(app)
      .post('/api/evacuations')
      .set('Cookie', adminSession)
      .send({
        resident_id: 1,
        event_id: 1,
        arrival_date: new Date().toISOString(),
        status: 'Evacuated'
      });
    expect(res.statusCode).toEqual(201);
  });
});
