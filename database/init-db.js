const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false
  }
});

const SQL_COMMANDS = `
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR(255) PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);

SELECT NOW() AS time;
`;

(async () => {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Database connected!');
    
    console.log('Creating session table...');
    const result = await client.query(SQL_COMMANDS);
    console.log('✅ Session table created successfully at:', result.rows[0].time);
    
    client.release();
  } catch (err) {
    console.error('❌ Database initialization failed:', err);
  } finally {
    await pool.end();
    console.log('Connection closed');
  }
})();