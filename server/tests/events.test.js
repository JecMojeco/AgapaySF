const request = require('supertest');
const express = require('express');
const session = require('express-session');
const eventRoutes = require('../routes/eventRoutes');
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

app.use('/api/events', eventRoutes);

describe('Events API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/events', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).get('/api/events');
      expect(response.status).toBe(401);
    });

    it('should return all events if logged in', async () => {
      const events = [{ event_id: 1, event_name: 'Flood 2024' }];
      db.query.mockResolvedValue({ rows: events });

      const agent = request.agent(app);
      await agent.get('/test-session-staff');
      const response = await agent.get('/api/events');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(events);
    });
  });

  describe('POST /api/events', () => {
    it('should return 403 if not admin', async () => {
      const agent = request.agent(app);
      await agent.get('/test-session-staff');
      const response = await agent.post('/api/events').send({
        event_name: 'Test Event',
        date_started: '2024-01-01',
        disaster_type: 'Flood'
      });
      expect(response.status).toBe(403);
    });

    it('should create event if admin', async () => {
      const newEvent = { event_id: 1, event_name: 'Test Event' };
      db.query.mockResolvedValue({ rows: [newEvent] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/events').send({
        event_name: 'Test Event',
        date_started: '2024-01-01',
        disaster_type: 'Flood'
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newEvent);
    });
  });

  describe('PATCH /api/events/:id', () => {
    it('should update event if admin', async () => {
      const updatedEvent = { event_id: 1, event_name: 'Updated Event' };
      db.query.mockResolvedValue({ rows: [updatedEvent] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.patch('/api/events/1').send({
        event_name: 'Updated Event'
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedEvent);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete event if admin', async () => {
      db.query.mockResolvedValue({ rows: [{ event_id: 1 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.delete('/api/events/1');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Event deleted successfully');
    });
  });
});
