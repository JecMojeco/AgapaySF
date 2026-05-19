const express = require('express');
const router = express.Router();
const { 
  getDamageReport, 
  getEvacuationReport, 
  getSummaryStats,
  getDamageDetails,
  getEvacuationDetails,
  getRecentActivity
} = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/damage/:eventId', requireAuth, requireRole('Admin'), getDamageReport);
router.get('/damage/:eventId/details', requireAuth, requireRole('Admin'), getDamageDetails);
router.get('/evacuation/:eventId', requireAuth, requireRole('Admin'), getEvacuationReport);
router.get('/evacuation/:eventId/details', requireAuth, requireRole('Admin'), getEvacuationDetails);
router.get('/summary', requireAuth, getSummaryStats);
router.get('/activity', requireAuth, getRecentActivity);

module.exports = router;
