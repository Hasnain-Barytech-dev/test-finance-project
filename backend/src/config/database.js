const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  database: 'finance_tracker',
  user: 'postgres',
  password: 'newpassword',
  ssl: false
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

// Test query
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('❌ Database query failed:', err.message);
  } else {
    console.log('✅ Database query successful:', result.rows[0].now);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
