const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  min:      parseInt(process.env.DB_POOL_MIN) || 2,
  max:      parseInt(process.env.DB_POOL_MAX) || 10,
  idleTimeoutMillis:    30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: true }
    : false,
});

pool.on('error', (err) => {
  console.error('[DB] Unexpected error:', err);
  process.exit(-1);
});

pool.on('connect', () => {
  console.log('[DB] New connection established');
});

// Health check every 60s
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
  } catch (err) {
    console.error('[DB] Health check failed:', err);
  }
}, 60000);

module.exports = {
  query:     (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
