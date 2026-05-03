const db = require('../config/db');

const getAllResidents = async (req, res) => {
  try {
    const { search, zone_id } = req.query;
    let query = `
      SELECT r.*, z.zone_name 
      FROM RESIDENT r
      JOIN BARANGAY_ZONE z ON r.zone_id = z.zone_id
    `;
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(r.surname ILIKE $${params.length} OR r.first_name ILIKE $${params.length})`);
    }

    if (zone_id) {
      params.push(zone_id);
      conditions.push(`r.zone_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' ORDER BY r.surname ASC, r.first_name ASC';

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT r.*, z.zone_name 
      FROM RESIDENT r
      JOIN BARANGAY_ZONE z ON r.zone_id = z.zone_id
      WHERE r.resident_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createResident = async (req, res) => {
  try {
    const {
      surname, first_name, middle_initial, gender, birth_date,
      contact_number, family_size, senior_citizen_count,
      fourPs_member_count, baby_count, infant_count,
      pregnant_count, pwd_count, zone_id
    } = req.body;

    // Basic validation
    if (!surname || !first_name || !gender || !birth_date || !family_size || !zone_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const counts = [
      senior_citizen_count, fourPs_member_count, baby_count,
      infant_count, pregnant_count, pwd_count
    ];

    for (const count of counts) {
      if (count !== undefined && (count < 0 || count > 99)) {
        return res.status(400).json({ error: 'Vulnerability counts must be between 0 and 99' });
      }
    }

    const result = await db.query(`
      INSERT INTO RESIDENT (
        surname, first_name, middle_initial, gender, birth_date,
        contact_number, family_size, senior_citizen_count,
        fourPs_member_count, baby_count, infant_count,
        pregnant_count, pwd_count, zone_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `, [
      surname, first_name, middle_initial, gender, birth_date,
      contact_number, family_size, senior_citizen_count || 0,
      fourPs_member_count || 0, baby_count || 0, infant_count || 0,
      pregnant_count || 0, pwd_count || 0, zone_id
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      surname, first_name, middle_initial, gender, birth_date,
      contact_number, family_size, senior_citizen_count,
      fourPs_member_count, baby_count, infant_count,
      pregnant_count, pwd_count, zone_id
    } = req.body;

    const counts = [
      senior_citizen_count, fourPs_member_count, baby_count,
      infant_count, pregnant_count, pwd_count
    ];

    for (const count of counts) {
      if (count !== undefined && (count < 0 || count > 99)) {
        return res.status(400).json({ error: 'Vulnerability counts must be between 0 and 99' });
      }
    }

    const result = await db.query(`
      UPDATE RESIDENT SET
        surname = $1, first_name = $2, middle_initial = $3, gender = $4, birth_date = $5,
        contact_number = $6, family_size = $7, senior_citizen_count = $8,
        fourPs_member_count = $9, baby_count = $10, infant_count = $11,
        pregnant_count = $12, pwd_count = $13, zone_id = $14
      WHERE resident_id = $15
      RETURNING *
    `, [
      surname, first_name, middle_initial, gender, birth_date,
      contact_number, family_size, senior_citizen_count,
      fourPs_member_count, baby_count, infant_count,
      pregnant_count, pwd_count, zone_id, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM RESIDENT WHERE resident_id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    res.status(200).json({ message: 'Resident deleted successfully' });
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Cannot delete resident: it is referenced in other records' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllResidents,
  getResidentById,
  createResident,
  updateResident,
  deleteResident
};
