const pool = require('../config/db');

exports.getAllEvacuations = async (req, res) => {
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
        el.*,
        r.surname || ', ' || r.first_name AS resident_name,
        de.event_name,
        bz.zone_name,
        bz.zone_id
      FROM EVACUATION_LOG el
      JOIN RESIDENT r ON el.resident_id = r.resident_id
      JOIN DISASTER_EVENT de ON el.event_id = de.event_id
      JOIN BARANGAY_ZONE bz ON r.zone_id = bz.zone_id
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
      conditions.push(`el.event_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(r.surname ILIKE $${params.length} OR r.first_name ILIKE $${params.length} OR de.event_name ILIKE $${params.length} OR bz.zone_name ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY el.arrival_date DESC`;

    const result = await pool.query(query, params);
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
