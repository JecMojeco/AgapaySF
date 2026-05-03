const { pool } = require('../config/db');

describe('Database Connection', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should have a pool defined', () => {
    expect(pool).toBeDefined();
  });
});
