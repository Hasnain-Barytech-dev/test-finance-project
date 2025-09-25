require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
  query_timeout: 30000
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...');
    console.log('📍 Database:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'init.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Reading migration file:', migrationPath);
    
    // Execute the migration
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('✅ Tables created: users, categories, transactions');
    console.log('✅ Demo users created');
    console.log('✅ Categories seeded');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();