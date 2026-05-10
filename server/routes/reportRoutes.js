const express = require('express');
const router = express.Router();
const { getDamageReport, getEvacuationReport, getSummaryStats } = require('../controllers/reportController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/damage/:eventId', requireAuth, requireRole('Admin'), getDamageReport);
router.get('/evacuation/:eventId', requireAuth, requireRole('Admin'), getEvacuationReport);
router.get('/summary', requireAuth, getSummaryStats);

module.exports = router;
