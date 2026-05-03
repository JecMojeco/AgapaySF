const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
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
