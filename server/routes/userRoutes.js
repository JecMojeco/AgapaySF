const express = require('express');
const { getPendingUsers, approveUser, rejectUser, getUsers, updateUserRole, deactivateUser } = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// All user management routes require Admin role
router.use(requireAuth);
router.use(requireRole('Admin'));

router.get('/', getUsers);
router.get('/pending', getPendingUsers);
router.patch('/:id/approve', approveUser);
router.patch('/:id/reject', rejectUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/deactivate', deactivateUser);

module.exports = router;
