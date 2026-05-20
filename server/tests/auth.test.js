const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const authRoutes = require('../routes/authRoutes');
const db = require('../config/db');

jest.mock('../config/db');
jest.mock('bcrypt');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return 201', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');
      db.query.mockResolvedValue({ rows: [{ user_id: 1, status: 'PENDING' }] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'John Doe', contact_number: '09123456789', password: 'Password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Registration submitted successfully');
      expect(response.body.user).toEqual({ user_id: 1, status: 'PENDING' });
      expect(db.query).toHaveBeenCalled();
    });

    it('should return 409 if contact number is already registered', async () => {
      bcrypt.hash.mockResolvedValue('hashedPassword');
      const error = new Error('duplicate key value violates unique constraint');
      error.code = '23505';
      db.query.mockRejectedValue(error);

      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'John Doe', contact_number: '09123456789', password: 'Password123' });

      expect(response.status).toBe(409);
      expect(response.body.error).toBe('Contact number already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 401 for incorrect contact number', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ contact_number: '09000000000', password: 'WrongPassword123' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Incorrect contact number or password. Please try again.');
    });

    it('should return 403 if account is pending', async () => {
      const user = { user_id: 1, contact_number: '09123456789', password: 'hashedPassword', status: 'PENDING' };
      db.query.mockResolvedValue({ rows: [user] });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ contact_number: '09123456789', password: 'password123' });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('still pending approval');
    });

    it('should return 200 and set session if login is successful', async () => {
      const user = { user_id: 2, name: 'Kagawad Juan', contact_number: '09123456789', password: 'hashedPassword', status: 'ACTIVE', role: 'Kagawad' };
      db.query.mockResolvedValue({ rows: [user] });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ contact_number: '09123456789', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user.role).toBe('Kagawad');
      expect(response.body.user.name).toBe('Kagawad Juan');
      // Supertest provides cookies via response.headers['set-cookie']
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should destroy session and return 200', async () => {
      // To test logout which requires auth, we need to mock a session
      // For simplicity in this integration test, we might bypass or mock the requireAuth logic, 
      // but supertest doesn't persist sessions easily without an agent.
      // So we will just test it using a mock approach.
      const user = { user_id: 2, contact_number: '09123456789', password: 'hashedPassword', status: 'ACTIVE', role: 'Kagawad' };
      db.query.mockResolvedValue({ rows: [user] });
      bcrypt.compare.mockResolvedValue(true);

      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ contact_number: '09123456789', password: 'password123' });

      const response = await agent.post('/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
