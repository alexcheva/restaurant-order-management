import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkPoolConnection() {
  let client;
  try {
    client = await pool.connect(); // Get a client from the pool
    const res = await client.query('SELECT * FROM customers LIMIT 1');
    console.log('PostgreSQL pool connection is healthy.');
    console.log('Customer info:', res.rows[0]);
  } catch (err) {
    console.error('Error checking PostgreSQL pool connection:', err);
  } finally {
    if (client) {
      client.release(); // Release the client back to the pool
    }
  }
}

checkPoolConnection();