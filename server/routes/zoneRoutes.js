const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zoneController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', zoneController.getAllZones);
router.get('/:id', zoneController.getZoneById);

// Admin only for mutations
router.post('/', requireRole('Admin'), zoneController.createZone);
router.patch('/:id', requireRole('Admin'), zoneController.updateZone);
router.delete('/:id', requireRole('Admin'), zoneController.deleteZone);

module.exports = router;
