import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const neonDbUrl = process.env.DATABASE_URL;

if (!neonDbUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Create PostgreSQL pool connection
export const pool = new Pool({
  connectionString: neonDbUrl,
  ssl: neonDbUrl.includes('neon.tech') ? { rejectUnauthorized: false } : false,
});

export const connectDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log("✓ PostgreSQL (Neon) connected successfully");
    client.release();
  } catch (error) {
    console.error("✗ PostgreSQL connection error:", error);
    process.exit(1);
  }
};

// Initialize tables
export const initializeTables = async () => {
  const client = await pool.connect();

  try {
    // Create users table with quoted column names to preserve case
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "agreeToTerms" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contact_forms table with quoted column names to preserve case
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_forms (
        id SERIAL PRIMARY KEY,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "message" TEXT NOT NULL,
        "subject" VARCHAR(255),
        "serviceType" VARCHAR(50) DEFAULT 'Other',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✓ Tables initialized successfully");
  } catch (error) {
    console.error("✗ Error initializing tables:", error);
  } finally {
    client.release();
  }
};

export default pool;
