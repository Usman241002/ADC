import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "postgres",
  database: "postgres",
  port: 5432,
});
