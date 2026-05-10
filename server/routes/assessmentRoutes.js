const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const assessmentController = require('../controllers/assessmentController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  '/',
  requireAuth,
  requireRole('Admin', 'Kagawad'),
  upload.single('photo'),
  assessmentController.createAssessment
);

router.get(
  '/',
  requireAuth,
  assessmentController.getAllAssessments
);

module.exports = router;
