const request = require('supertest');
const express = require('express');
const session = require('express-session');
const residentRoutes = require('../routes/residentRoutes');
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

app.use('/api/residents', residentRoutes);

describe('Residents API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/residents', () => {
    it('should return all residents if logged in', async () => {
      const residents = [
        { resident_id: 1, surname: 'Doe', first_name: 'John', zone_name: 'Zone 1' }
      ];
      db.query.mockResolvedValue({ rows: residents });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.get('/api/residents');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(residents);
    });

    it('should filter by search and zone_id', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      await agent.get('/api/residents?search=John&zone_id=1');

      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('(r.surname ILIKE $1 OR r.first_name ILIKE $1) AND r.zone_id = $2'),
        ['%John%', '1']
      );
    });
  });

  describe('POST /api/residents', () => {
    it('should create resident', async () => {
      const newResident = {
        surname: 'Doe',
        first_name: 'Jane',
        gender: 'F',
        birth_date: '1990-01-01',
        family_size: 1,
        zone_id: 1
      };
      db.query.mockResolvedValue({ rows: [{ ...newResident, resident_id: 2 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/residents').send(newResident);

      expect(response.status).toBe(201);
      expect(response.body.surname).toBe('Doe');
      expect(db.query).toHaveBeenCalled();
    });

    it('should return 400 if vulnerability counts are out of range', async () => {
      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/residents').send({
        surname: 'Doe',
        first_name: 'Jane',
        gender: 'F',
        birth_date: '1990-01-01',
        family_size: 1,
        zone_id: 1,
        senior_citizen_count: 100
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Vulnerability counts must be between 0 and 99');
    });
  });

  describe('PUT /api/residents/:id', () => {
    it('should update resident', async () => {
      const updatedResident = {
        surname: 'Updated',
        first_name: 'Jane',
        gender: 'F',
        birth_date: '1990-01-01',
        family_size: 2,
        zone_id: 1
      };
      db.query.mockResolvedValue({ rows: [updatedResident] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.put('/api/residents/2').send(updatedResident);

      expect(response.status).toBe(200);
      expect(response.body.surname).toBe('Updated');
    });
  });

  describe('DELETE /api/residents/:id', () => {
    it('should delete resident', async () => {
      db.query.mockResolvedValue({ rows: [{ resident_id: 2 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.delete('/api/residents/2');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Resident deleted successfully');
    });
  });
});
