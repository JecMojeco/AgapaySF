const db = require('../config/db');

const getPendingUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT user_id, name, contact_number, status FROM "USER" WHERE status = $1 ORDER BY user_id ASC',
      ['PENDING']
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['Kagawad', 'Staff', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await db.query(
      'UPDATE "USER" SET status = $1, role = $2 WHERE user_id = $3 RETURNING user_id, name, role, status',
      ['ACTIVE', role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User approved successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE "USER" SET status = $1 WHERE user_id = $2 RETURNING user_id, name, status',
      ['INACTIVE', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User rejected successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = 'SELECT user_id, name, contact_number, role, status FROM "USER"';
    const params = [];

    if (role) {
      query += ' WHERE role = $1';
      params.push(role);
    }

    query += ' ORDER BY user_id ASC';
    
    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['Kagawad', 'Staff', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const result = await db.query(
      'UPDATE "USER" SET role = $1 WHERE user_id = $2 RETURNING user_id, name, role, status',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'UPDATE "USER" SET status = $1 WHERE user_id = $2 RETURNING user_id, name, status',
      ['INACTIVE', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deactivated successfully', user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  getUsers,
  updateUserRole,
  deactivateUser,
};
