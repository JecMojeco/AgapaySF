const express = require('express');
const {
  getAllStructures,
  getStructureById,
  createStructure,
  updateStructure,
  deleteStructure
} = require('../controllers/structureController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('Admin', 'Kagawad', 'Staff'));

router.get('/', getAllStructures);
router.get('/:id', getStructureById);
router.post('/', createStructure);
router.put('/:id', updateStructure);
router.delete('/:id', deleteStructure);

module.exports = router;
