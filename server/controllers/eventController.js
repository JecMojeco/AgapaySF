const db = require('../config/db');

const getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM DISASTER_EVENT ORDER BY date_started DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM DISASTER_EVENT WHERE event_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { event_name, date_started, date_ended, disaster_type } = req.body;
    
    if (!event_name || !date_started || !disaster_type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.query(
      'INSERT INTO DISASTER_EVENT (event_name, date_started, date_ended, disaster_type) VALUES ($1, $2, $3, $4) RETURNING *',
      [event_name, date_started, date_ended, disaster_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_name, date_started, date_ended, disaster_type } = req.body;

    const result = await db.query(
      'UPDATE DISASTER_EVENT SET event_name = $1, date_started = $2, date_ended = $3, disaster_type = $4 WHERE event_id = $5 RETURNING *',
      [event_name, date_started, date_ended, disaster_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM DISASTER_EVENT WHERE event_id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
