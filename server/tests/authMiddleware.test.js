const { requireAuth, requireRole } = require('../middleware/authMiddleware');

describe('Auth Middleware', () => {
  describe('requireAuth', () => {
    it('should return 401 if no session exists', () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user_id is missing from session', () => {
      const req = { session: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if session and user_id exist', () => {
      const req = { session: { user_id: 1 } };
      const res = { status: jest.fn(), json: jest.fn() };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should return 401 if no session exists', () => {
      const req = {};
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      const middleware = requireRole('Admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return 403 if role does not match', () => {
      const req = { session: { role: 'Staff' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      const middleware = requireRole('Admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if role matches one of allowed roles', () => {
      const req = { session: { role: 'Kagawad' } };
      const res = {};
      const next = jest.fn();
      const middleware = requireRole('Kagawad', 'Admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
