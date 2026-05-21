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
  const { role, user_id } = req.session;
  let { zone_id: sessionZoneId } = req.session;
  const { event_id, zone_id, search } = req.query;

  try {
    // Robust session recovery for Kagawad
    if (role === 'Kagawad' && !sessionZoneId) {
      const zoneResult = await pool.query('SELECT zone_id FROM BARANGAY_ZONE WHERE assigned_kagawad = $1', [user_id]);
      if (zoneResult.rows.length > 0) {
        sessionZoneId = zoneResult.rows[0].zone_id;
        req.session.zone_id = sessionZoneId;
      }
    }

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
    const conditions = [];

    if (role === 'Kagawad') {
      if (sessionZoneId) {
        params.push(sessionZoneId);
        conditions.push(`bz.zone_id = $${params.length}`);
      } else {
        return res.json([]);
      }
    } else if (zone_id && zone_id !== 'all') {
      params.push(zone_id);
      conditions.push(`bz.zone_id = $${params.length}`);
    }

    if (event_id && event_id !== 'all') {
      params.push(event_id);
      conditions.push(`ar.event_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(s.address ILIKE $${params.length} OR u.name ILIKE $${params.length} OR de.event_name ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY ar.timestamp DESC`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
