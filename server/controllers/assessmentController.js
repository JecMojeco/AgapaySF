const pool = require('../config/db');

exports.createAssessment = async (req, res) => {
  const { event_id, structure_id, damage_level } = req.body;
  const user_id = req.session.user_id;
  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!event_id || !structure_id || !damage_level) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO ASSESSMENT_REPORT (user_id, event_id, structure_id, damage_level, photo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, event_id, structure_id, damage_level, photo_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllAssessments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ASSESSMENT_REPORT ORDER BY timestamp DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
