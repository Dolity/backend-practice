import mysql from "mysql2/promise";

let pool = null;

export const connectDb = async (config) => {
  pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
  });

  const deadline = Date.now() + 5000;
  let lastErr;
  while (Date.now() < deadline) {
    try {
      await pool.query("SELECT 1");
      console.log("MySQL connected");
      return;
    } catch (err) {
      lastErr = err;
      if (Date.now() + 500 >= deadline) break;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const msg = lastErr?.code === "ECONNREFUSED"
    ? "MySQL is not running. Start it with: docker compose up -d"
    : `MySQL connection failed: ${lastErr?.message}`;
  throw new Error(msg);
};

export const query = (...args) => {
  if (!pool) throw new Error("Database not connected");
  return pool.query(...args);
};
