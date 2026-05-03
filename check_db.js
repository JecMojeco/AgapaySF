const db = require('./server/config/db');

async function checkSchema() {
  try {
    const res = await db.query(`
      SELECT column_name, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'USER';
    `);
    console.log('USER table structure:');
    console.table(res.rows);
    process.exit(0);
  } catch (err) {
    console.error('Error checking schema:', err);
    process.exit(1);
  }
}

checkSchema();
