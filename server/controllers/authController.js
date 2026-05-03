const bcrypt = require('bcrypt');
const db = require('../config/db');

const register = async (req, res) => {
  try {
    const { name, contact_number, password } = req.body;
    if (!name || !contact_number || !password) {
      return res.status(400).json({ error: 'All fields are required' });
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

    res.status(200).json({ message: 'Login successful', role: user.role });
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

module.exports = {
  register,
  login,
  logout,
};
