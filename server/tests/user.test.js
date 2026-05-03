const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('../routes/userRoutes');
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

// Helper to set session
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

app.use('/api/users', userRoutes);

describe('User Management API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/pending', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).get('/api/users/pending');
      expect(response.status).toBe(401);
    });

    it('should return 403 if not admin', async () => {
      const agent = request.agent(app);
      await agent.get('/test-session-staff');
      const response = await agent.get('/api/users/pending');
      expect(response.status).toBe(403);
    });

    it('should return pending users if admin', async () => {
      const pendingUsers = [
        { user_id: 10, name: 'Alice', contact_number: '123', status: 'PENDING' },
      ];
      db.query.mockResolvedValue({ rows: pendingUsers });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.get('/api/users/pending');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(pendingUsers);
    });
  });

  describe('PATCH /api/users/:id/approve', () => {
    it('should approve user if admin and valid role', async () => {
      const approvedUser = { user_id: 10, name: 'Alice', role: 'Staff', status: 'ACTIVE' };
      db.query.mockResolvedValue({ rows: [approvedUser] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.patch('/api/users/10/approve').send({ role: 'Staff' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User approved successfully');
      expect(response.body.user).toEqual(approvedUser);
    });

    it('should return 400 for invalid role', async () => {
      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.patch('/api/users/10/approve').send({ role: 'SuperUser' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid role');
    });
  });

  describe('PATCH /api/users/:id/reject', () => {
    it('should reject user if admin', async () => {
      const rejectedUser = { user_id: 10, name: 'Alice', status: 'INACTIVE' };
      db.query.mockResolvedValue({ rows: [rejectedUser] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.patch('/api/users/10/reject');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User rejected successfully');
      expect(response.body.user).toEqual(rejectedUser);
    });
  });
});
