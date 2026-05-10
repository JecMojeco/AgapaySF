const express = require('express');
const router = express.Router();
const { getAllEvacuations, createEvacuation, updateEvacuation } = require('../controllers/evacuationController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, getAllEvacuations);
router.post('/', requireAuth, createEvacuation);
router.patch('/:id', requireAuth, updateEvacuation);

module.exports = router;
