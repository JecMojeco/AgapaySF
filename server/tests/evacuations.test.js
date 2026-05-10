const request = require('supertest');
const express = require('express');
const session = require('express-session');
const evacuationRoutes = require('../routes/evacuationRoutes');
const db = require('../config/db');

jest.mock('../config/db');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
  })
);

app.get('/test-session-admin', (req, res) => {
  req.session.user_id = 1;
  req.session.role = 'Admin';
  res.status(200).send('Admin session set');
});

app.use('/api/evacuations', evacuationRoutes);

describe('Evacuation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/evacuations should return list of evacuations', async () => {
    const evacuations = [
      { evacuation_id: 1, resident_name: 'Doe, John', event_name: 'Flood', zone_name: 'Zone 1' }
    ];
    db.query.mockResolvedValue({ rows: evacuations });

    const agent = request.agent(app);
    await agent.get('/test-session-admin');
    const res = await agent.get('/api/evacuations');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(evacuations);
  });

  test('POST /api/evacuations should log a new arrival', async () => {
    const newEvacuation = {
      resident_id: 1,
      event_id: 1,
      arrival_date: '2024-01-01',
      status: 'Evacuated'
    };
    db.query.mockResolvedValue({ rows: [{ ...newEvacuation, evacuation_id: 2 }] });

    const agent = request.agent(app);
    await agent.get('/test-session-admin');
    const res = await agent.post('/api/evacuations').send(newEvacuation);

    expect(res.statusCode).toEqual(201);
    expect(res.body.resident_id).toEqual(1);
    expect(db.query).toHaveBeenCalled();
  });
});
