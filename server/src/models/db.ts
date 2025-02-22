import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const PASSWORD = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_DATABASE;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
