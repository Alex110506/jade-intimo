// fix-column.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // Load your .env variables

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function fix() {
  try {
    await client.connect();
    console.log("🛠️  Attempting to drop column 'cod'...");
    
    // This deletes the column if it exists, clearing the path for Drizzle
    await client.query('ALTER TABLE "products" DROP COLUMN IF EXISTS "cod";');
    
    console.log("✅ Success! The column is gone.");
    console.log("🚀 Now run 'npm run db:migrate' again.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.end();
  }
}

fix();