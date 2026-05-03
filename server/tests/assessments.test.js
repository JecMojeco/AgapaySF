const request = require('supertest');
const express = require('express');
const session = require('express-session');
const assessmentRoutes = require('../routes/assessmentRoutes');
const db = require('../config/db');
const path = require('path');
const fs = require('fs');

jest.mock('../config/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get('/test-session-kagawad', (req, res) => {
  req.session.user_id = 2;
  req.session.role = 'Kagawad';
  res.status(200).send('Kagawad session set');
});

app.get('/test-session-staff', (req, res) => {
  req.session.user_id = 3;
  req.session.role = 'Staff';
  res.status(200).send('Staff session set');
});

app.use('/api/assessments', assessmentRoutes);

describe('Assessments API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/assessments', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).get('/api/assessments');
      expect(response.status).toBe(401);
    });

    it('should return all assessments if logged in', async () => {
      const assessments = [{ report_id: 1, damage_level: 'Partial' }];
      db.query.mockResolvedValue({ rows: assessments });

      const agent = request.agent(app);
      await agent.get('/test-session-staff');
      const response = await agent.get('/api/assessments');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(assessments);
    });
  });

  describe('POST /api/assessments', () => {
    it('should return 401 if not logged in', async () => {
      const response = await request(app).post('/api/assessments');
      expect(response.status).toBe(401);
    });

    it('should create assessment without photo', async () => {
      const newAssessment = { report_id: 1, damage_level: 'Partial' };
      db.query.mockResolvedValue({ rows: [newAssessment] });

      const agent = request.agent(app);
      await agent.get('/test-session-kagawad');
      const response = await agent
        .post('/api/assessments')
        .field('event_id', '1')
        .field('structure_id', '1')
        .field('damage_level', 'Partial');

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newAssessment);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO ASSESSMENT_REPORT'),
        [2, '1', '1', 'Partial', null]
      );
    });

    it('should create assessment with photo', async () => {
      const newAssessment = { report_id: 2, damage_level: 'Total', photo_url: '/uploads/test.jpg' };
      db.query.mockResolvedValue({ rows: [newAssessment] });

      // Create a dummy file for upload
      const testFilePath = path.join(__dirname, 'test.jpg');
      fs.writeFileSync(testFilePath, 'fake image content');

      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent
        .post('/api/assessments')
        .field('event_id', '1')
        .field('structure_id', '1')
        .field('damage_level', 'Total')
        .attach('photo', testFilePath);

      expect(response.status).toBe(201);
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO ASSESSMENT_REPORT'),
        [1, '1', '1', 'Total', expect.stringMatching(/^\/uploads\/\d+\.jpg$/)]
      );

      // Cleanup dummy file
      fs.unlinkSync(testFilePath);
      
      // Cleanup uploaded file (it will be in server/uploads/ because that's where multer is configured in the route)
      // Actually multer will use 'uploads/' relative to the process root.
      // In tests, we might want to be careful.
    });

    it('should return 400 if fields are missing', async () => {
      const agent = request.agent(app);
      await agent.get('/test-session-admin');
      const response = await agent.post('/api/assessments').send({});
      expect(response.status).toBe(400);
    });
  });
});
