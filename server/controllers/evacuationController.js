const pool = require('../config/db');

exports.getAllEvacuations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        el.*,
        r.surname || ', ' || r.first_name AS resident_name,
        de.event_name,
        bz.zone_name
      FROM EVACUATION_LOG el
      JOIN RESIDENT r ON el.resident_id = r.resident_id
      JOIN DISASTER_EVENT de ON el.event_id = de.event_id
      JOIN BARANGAY_ZONE bz ON r.zone_id = bz.zone_id
      ORDER BY el.arrival_date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createEvacuation = async (req, res) => {
  const { resident_id, event_id, arrival_date, status } = req.body;

  if (!resident_id || !event_id || !arrival_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO EVACUATION_LOG (resident_id, event_id, arrival_date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [resident_id, event_id, arrival_date, status || 'Evacuated']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateEvacuation = async (req, res) => {
  const { id } = req.params;
  const { departure_date, status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE EVACUATION_LOG SET departure_date = $1, status = $2 WHERE evacuation_id = $3 RETURNING *',
      [departure_date, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evacuation log not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
