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
    const residentsCount = await pool.query('SELECT COUNT(*) FROM RESIDENT');
    const evacuationsCount = await pool.query('SELECT COUNT(*) FROM EVACUATION_LOG WHERE status = \'Evacuated\'');
    const assessmentsCount = await pool.query('SELECT COUNT(*) FROM ASSESSMENT_REPORT');
    const eventsCount = await pool.query('SELECT COUNT(*) FROM DISASTER_EVENT');

    res.json({
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
