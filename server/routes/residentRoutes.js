const express = require('express');
const {
  getAllResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident
} = require('../controllers/residentController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('Admin', 'Kagawad', 'Staff'));

router.get('/', getAllResidents);
router.get('/:id', getResidentById);
router.post('/', createResident);
router.put('/:id', updateResident);
router.delete('/:id', deleteResident);

module.exports = router;
