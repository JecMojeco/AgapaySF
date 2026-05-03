const request = require('supertest');
const express = require('express');
const session = require('express-session');
const zoneRoutes = require('../routes/zoneRoutes');
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

app.get('/test-session-staff', (req, res) => {
  req.session.user_id = 2;
  req.session.role = 'Staff';
  res.status(200).send('Staff session set');
});

app.use('/api/zones', zoneRoutes);

describe('Zones API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/zones', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).get('/api/zones');
      expect(response.status).toBe(401);
    });

    it('should return all zones if logged in', async () => {
      const zones = [{ zone_id: 1, zone_name: 'Zone 1', kagawad_name: 'Kagawad Joe' }];
      db.query.mockResolvedValue({ rows: zones });

      const agent = request.agent(app);
      await agent.get('/test-session-staff');
      const response = await agent.get('/api/zones');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(zones);
    });
  });

  describe('POST /api/zones', () => {
    it('should create zone if admin', async () => {
      const newZone = { zone_id: 1, zone_name: 'Zone 1', assigned_kagawad: 3 };
      db.query.mockResolvedValue({ rows: [newZone] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/zones').send({
        zone_name: 'Zone 1',
        assigned_kagawad: 3
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newZone);
    });
  });

  describe('PATCH /api/zones/:id', () => {
    it('should update zone if admin', async () => {
      const updatedZone = { zone_id: 1, zone_name: 'Updated Zone', assigned_kagawad: 3 };
      db.query.mockResolvedValue({ rows: [updatedZone] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.patch('/api/zones/1').send({
        zone_name: 'Updated Zone',
        assigned_kagawad: 3
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedZone);
    });
  });

  describe('DELETE /api/zones/:id', () => {
    it('should delete zone if admin', async () => {
      db.query.mockResolvedValue({ rows: [{ zone_id: 1 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.delete('/api/zones/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Zone deleted successfully');
    });
  });
});
