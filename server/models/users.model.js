import bcrypt from "bcrypt";
import sql from "../db/db.js";

export async function createUser({
  username,
  first_name,
  last_name,
  email,
  password,
  role = "user",
}) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await sql`
      INSERT INTO users (username, first_name, last_name, email, password, role)
      VALUES (${username}, ${first_name}, ${last_name}, ${email}, ${hashedPassword}, ${role})
      RETURNING *;
    `;

    return result[0]; // return created user (username)
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function checkUser({ username, password }) {
  try {
    const users = await sql`
      SELECT *
      FROM users
      WHERE username = ${username}
    `;

    if (users.length === 0) return null; // user not found

    const user = users[0];

    // compare entered password with hashed password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return null;

    return {
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    }; // login successful
  } catch (error) {
    console.error(error);
    throw error;
  }
}
