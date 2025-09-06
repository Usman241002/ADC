import "dotenv/config";
import postgres from "postgres";
console.log("DATABASE_URL:", process.env.DATABASE_URL); // Add this line
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
export default sql;
