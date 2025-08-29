import { Pool } from "pg";

export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "241002",
  database: "postgres",
  port: 5432,
});
