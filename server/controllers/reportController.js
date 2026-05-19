const pool = require('../config/db');

exports.getDamageReport = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        damage_level,
        COUNT(*) as count
      FROM ASSESSMENT_REPORT
      WHERE event_id = $1
      GROUP BY damage_level
    `, [eventId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getEvacuationReport = async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM EVACUATION_LOG
      WHERE event_id = $1
      GROUP BY status
    `, [eventId]);
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getSummaryStats = async (req, res) => {
  try {
    const activeEventQuery = await pool.query('SELECT * FROM DISASTER_EVENT WHERE date_ended IS NULL ORDER BY date_started DESC LIMIT 1');
    const activeEvent = activeEventQuery.rows[0] || null;

    const residentsCount = await pool.query('SELECT COUNT(*) FROM RESIDENT');
    const evacuationsCount = await pool.query('SELECT COUNT(*) FROM EVACUATION_LOG WHERE status = \'Evacuated\'');
    const assessmentsCount = await pool.query('SELECT COUNT(*) FROM ASSESSMENT_REPORT');
    const eventsCount = await pool.query('SELECT COUNT(*) FROM DISASTER_EVENT');

    res.json({
      activeEvent,
      totalResidents: parseInt(residentsCount.rows[0].count),
      activeEvacuations: parseInt(evacuationsCount.rows[0].count),
      totalAssessments: parseInt(assessmentsCount.rows[0].count),
      totalEvents: parseInt(eventsCount.rows[0].count)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 'Assessment' as type, ar.timestamp as action_time, u.name as user_name, s.address as detail
      FROM ASSESSMENT_REPORT ar
      JOIN "USER" u ON ar.user_id = u.user_id
      JOIN STRUCTURE s ON ar.structure_id = s.structure_id
      UNION ALL
      SELECT 'Evacuation' as type, el.arrival_date as action_time, 'System' as user_name, r.surname || ', ' || r.first_name as detail
      FROM EVACUATION_LOG el
      JOIN RESIDENT r ON el.resident_id = r.resident_id
      ORDER BY action_time DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getDamageDetails = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        ar.timestamp, ar.damage_level,
        s.address, s.structure_type,
        u.name as reporter_name,
        bz.zone_name
      FROM ASSESSMENT_REPORT ar
      JOIN STRUCTURE s ON ar.structure_id = s.structure_id
      JOIN RESIDENT r ON s.owner_id = r.resident_id
      JOIN BARANGAY_ZONE bz ON r.zone_id = bz.zone_id
      JOIN "USER" u ON ar.user_id = u.user_id
      WHERE ar.event_id = $1
      ORDER BY ar.timestamp DESC
    `, [eventId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getEvacuationDetails = async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        el.arrival_date, el.departure_date, el.status,
        r.surname || ', ' || r.first_name as resident_name, r.family_size,
        r.senior_citizen_count, r.fourPs_member_count, r.baby_count, 
        r.infant_count, r.pregnant_count, r.pwd_count,
        bz.zone_name
      FROM EVACUATION_LOG el
      JOIN RESIDENT r ON el.resident_id = r.resident_id
      JOIN BARANGAY_ZONE bz ON r.zone_id = bz.zone_id
      WHERE el.event_id = $1
      ORDER BY el.arrival_date DESC
    `, [eventId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
};
