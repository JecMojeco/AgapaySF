const bcrypt = require('bcrypt');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { name, contact_number, password } = req.body;
    if (!name || !contact_number || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validation
    const contactRegex = /^09\d{9}$/;
    if (!contactRegex.test(contact_number)) {
      return res.status(400).json({ error: 'Invalid contact number. Must be 11 digits starting with 09.' });
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long and contain both letters and numbers.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO "USER" (name, contact_number, password) VALUES ($1, $2, $3) RETURNING user_id, status';
    const values = [name, contact_number, hashedPassword];

    const result = await db.query(query, values);
    res.status(201).json({ message: 'Registration submitted successfully', user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return res.status(409).json({ error: 'Contact number already registered' });
    }
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { contact_number, password } = req.body;
    if (!contact_number || !password) {
      return res.status(400).json({ error: 'Contact number and password required' });
    }

    const result = await db.query('SELECT * FROM "USER" WHERE contact_number = $1', [contact_number]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Incorrect contact number or password. Please try again.' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect contact number or password. Please try again.' });
    }

    if (user.status === 'PENDING') {
      return res.status(403).json({ error: 'Your account is still pending approval. Please contact your barangay administrator.' });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({ error: 'Your account is inactive.' });
    }

    req.session.user_id = user.user_id;
    req.session.role = user.role;
    req.session.status = user.status;

    // Fetch zone_id if Kagawad
    if (user.role === 'Kagawad') {
      const zoneResult = await db.query('SELECT zone_id FROM BARANGAY_ZONE WHERE assigned_kagawad = $1', [user.user_id]);
      if (zoneResult.rows.length > 0) {
        req.session.zone_id = zoneResult.rows[0].zone_id;
      }
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        zone_id: req.session.zone_id
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
};

const getMe = async (req, res) => {
  try {
    const result = await db.query('SELECT user_id, name, role, status FROM "USER" WHERE user_id = $1', [req.session.user_id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
