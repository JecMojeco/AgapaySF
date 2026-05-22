const db = require('../config/db');

const requireAuth = async (req, res, next) => {
  if (!req.session || !req.session.user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify user still exists and is ACTIVE in DB
    const result = await db.query('SELECT status FROM "USER" WHERE user_id = $1', [req.session.user_id]);
    const user = result.rows[0];

    if (!user || user.status === 'INACTIVE') {
      return req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.status(401).json({ error: 'Account is inactive or deleted' });
      });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.role) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

module.exports = {
  requireAuth,
  requireRole,
};
