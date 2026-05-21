const db = require('../config/db');

const getAllStructures = async (req, res) => {
  try {
    const { search, zone_id } = req.query;
    let query = `
      SELECT s.*, r.surname as owner_surname, r.first_name as owner_first_name, z.zone_name
      FROM STRUCTURE s
      JOIN RESIDENT r ON s.owner_id = r.resident_id
      JOIN BARANGAY_ZONE z ON r.zone_id = z.zone_id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(s.address ILIKE $${params.length} OR r.surname ILIKE $${params.length} OR r.first_name ILIKE $${params.length})`);
    }

    if (zone_id) {
      params.push(zone_id);
      conditions.push(`r.zone_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY s.structure_id ASC`;

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStructureById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT s.*, r.surname as owner_surname, r.first_name as owner_first_name
      FROM STRUCTURE s
      JOIN RESIDENT r ON s.owner_id = r.resident_id
      WHERE s.structure_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Structure not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStructure = async (req, res) => {
  try {
    const { address, owner_id, structure_type } = req.body;

    if (!address || !owner_id || !structure_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.query(
      'INSERT INTO STRUCTURE (address, owner_id, structure_type) VALUES ($1, $2, $3) RETURNING *',
      [address, owner_id, structure_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid owner_id: resident does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, owner_id, structure_type } = req.body;

    const result = await db.query(
      'UPDATE STRUCTURE SET address = $1, owner_id = $2, structure_type = $3 WHERE structure_id = $4 RETURNING *',
      [address, owner_id, structure_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Structure not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid owner_id: resident does not exist' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM STRUCTURE WHERE structure_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Structure not found' });
    }

    res.status(200).json({ message: 'Structure deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Cannot delete structure: it is referenced in other records' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllStructures,
  getStructureById,
  createStructure,
  updateStructure,
  deleteStructure
};
