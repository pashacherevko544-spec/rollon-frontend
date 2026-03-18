require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../config/database');

async function runMigrations() {
  const client = await db.getClient();
  try {
    // Create migrations tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationsDir = path.join(__dirname);
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT id FROM _migrations WHERE filename = $1', [file]
      );
      if (rows.length > 0) {
        console.log(`[SKIP] ${file} (already applied)`);
        continue;
      }

      console.log(`[RUN]  ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO _migrations (filename) VALUES ($1)', [file]
        );
        await client.query('COMMIT');
        console.log(`[OK]   ${file}`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`[FAIL] ${file}:`, err.message);
        process.exit(1);
      }
    }

    console.log('\nAll migrations applied successfully.');
  } finally {
    client.release();
    process.exit(0);
  }
}

runMigrations();
