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
  const { role, user_id, zone_id } = req.session;

  try {
    let query = `
      SELECT 
        ar.*,
        de.event_name,
        de.disaster_type,
        s.address AS structure_address,
        r.surname || ', ' || r.first_name AS owner_name,
        bz.zone_name,
        bz.zone_id,
        u.name AS reporter_name
      FROM ASSESSMENT_REPORT ar
      JOIN DISASTER_EVENT de ON ar.event_id = de.event_id
      JOIN STRUCTURE s ON ar.structure_id = s.structure_id
      JOIN RESIDENT r ON s.owner_id = r.resident_id
      JOIN BARANGAY_ZONE bz ON r.zone_id = bz.zone_id
      JOIN "USER" u ON ar.user_id = u.user_id
    `;

    const params = [];
    if (role === 'Kagawad') {
      // Kagawad only see their zone
      query += ` WHERE bz.zone_id = $1`;
      params.push(zone_id);
    }

    query += ` ORDER BY ar.timestamp DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
