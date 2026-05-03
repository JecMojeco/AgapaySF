const request = require('supertest');
const express = require('express');
const session = require('express-session');
const structureRoutes = require('../routes/structureRoutes');
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

app.use('/api/structures', structureRoutes);

describe('Structures API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/structures', () => {
    it('should return all structures if logged in', async () => {
      const structures = [
        { structure_id: 1, address: 'Address 1', owner_surname: 'Doe', owner_first_name: 'John' }
      ];
      db.query.mockResolvedValue({ rows: structures });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.get('/api/structures');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(structures);
    });
  });

  describe('POST /api/structures', () => {
    it('should create structure', async () => {
      const newStructure = {
        address: 'New Address',
        owner_id: 1,
        structure_type: 'Residential'
      };
      db.query.mockResolvedValue({ rows: [{ ...newStructure, structure_id: 2 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/structures').send(newStructure);

      expect(response.status).toBe(201);
      expect(response.body.address).toBe('New Address');
    });

    it('should return 400 if owner_id does not exist', async () => {
      db.query.mockRejectedValue({ code: '23503' });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/structures').send({
        address: 'New Address',
        owner_id: 999,
        structure_type: 'Residential'
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid owner_id: resident does not exist');
    });
  });

  describe('PUT /api/structures/:id', () => {
    it('should update structure', async () => {
      const updatedStructure = {
        address: 'Updated Address',
        owner_id: 1,
        structure_type: 'Commercial'
      };
      db.query.mockResolvedValue({ rows: [updatedStructure] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.put('/api/structures/2').send(updatedStructure);

      expect(response.status).toBe(200);
      expect(response.body.address).toBe('Updated Address');
    });
  });

  describe('DELETE /api/structures/:id', () => {
    it('should delete structure', async () => {
      db.query.mockResolvedValue({ rows: [{ structure_id: 2 }] });

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.delete('/api/structures/2');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Structure deleted successfully');
    });
  });
});
