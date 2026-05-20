const db = require('../config/db');

const getAllZones = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT z.*, u.name as kagawad_name 
      FROM BARANGAY_ZONE z
      JOIN "USER" u ON z.assigned_kagawad = u.user_id
      ORDER BY z.zone_id ASC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT z.*, u.name as kagawad_name 
      FROM BARANGAY_ZONE z
      JOIN "USER" u ON z.assigned_kagawad = u.user_id
      WHERE z.zone_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createZone = async (req, res) => {
  try {
    const { zone_name, assigned_kagawad } = req.body;
    
    if (!zone_name || !assigned_kagawad) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (isNaN(assigned_kagawad)) {
      return res.status(400).json({ error: 'Invalid Kagawad ID' });
    }

    const result = await db.query(
      'INSERT INTO BARANGAY_ZONE (zone_name, assigned_kagawad) VALUES ($1, $2) RETURNING *',
      [zone_name, assigned_kagawad]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { zone_name, assigned_kagawad } = req.body;

    if (assigned_kagawad && isNaN(assigned_kagawad)) {
      return res.status(400).json({ error: 'Invalid Kagawad ID' });
    }

    const result = await db.query(
      'UPDATE BARANGAY_ZONE SET zone_name = $1, assigned_kagawad = $2 WHERE zone_id = $3 RETURNING *',
      [zone_name, assigned_kagawad, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM BARANGAY_ZONE WHERE zone_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Zone not found' });
    }

    res.status(200).json({ message: 'Zone deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};
