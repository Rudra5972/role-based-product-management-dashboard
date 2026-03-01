// db.js
import { Pool } from "pg";
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER_NAME,
  host: process.env.DB_HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 10, // max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log("PostgreSQL Pool Connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PG Pool Error", err);
  process.exit(1);
});

export default pool;
