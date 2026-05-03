const request = require('supertest');
const express = require('express');
const session = require('express-session');
const authRoutes = require('../routes/authRoutes');
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

// Mock login middleware for testing /me
app.post('/test/login', (req, res) => {
  req.session.user_id = req.body.user_id;
  req.session.role = req.body.role;
  req.session.status = req.body.status;
  res.sendStatus(200);
});

app.use('/api/auth', authRoutes);

describe('GET /api/auth/me', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  it('should return user data if user is authenticated', async () => {
    const agent = request.agent(app);
    await agent.post('/test/login').send({ user_id: 1, role: 'Staff', status: 'ACTIVE' });

    const user = { user_id: 1, name: 'John Doe', role: 'Staff', status: 'ACTIVE' };
    db.query.mockResolvedValue({ rows: [user] });

    const response = await agent.get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual(user);
    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT user_id, name, role, status FROM "USER"'),
      [1]
    );
  });

  it('should return 404 if user is not found in database', async () => {
    const agent = request.agent(app);
    await agent.post('/test/login').send({ user_id: 99, role: 'Staff', status: 'ACTIVE' });

    db.query.mockResolvedValue({ rows: [] });

    const response = await agent.get('/api/auth/me');

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found');
  });
});
