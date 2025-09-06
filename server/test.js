import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  try {
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: { rejectUnauthorized: false },
    });

    const result = await sql`select current_user`;
    console.log(result);

    await sql.end();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

main();
