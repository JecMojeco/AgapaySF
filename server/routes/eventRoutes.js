const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Admin only for mutations
router.post('/', requireRole('Admin'), eventController.createEvent);
router.patch('/:id', requireRole('Admin'), eventController.updateEvent);
router.delete('/:id', requireRole('Admin'), eventController.deleteEvent);

module.exports = router;
