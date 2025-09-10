import sql from "../db/db.js";

export async function createClient(clientData) {
  try {
    const {
      first_name,
      last_name,
      address,
      email_address,
      phone_number,
      national_insurance,
      date_of_birth,
      license_number,
      issuing_authority,
      license_expiry,
    } = clientData;

    const { street_name, city, postcode } = address;

    const result = await sql`
      INSERT INTO clients(
        first_name,
        last_name,
        street_name,
        city,
        postcode,
        email_address,
        phone_number,
        national_insurance,
        date_of_birth,
        license_number,
        issuing_authority,
        license_expiry
      ) VALUES (
        ${first_name},
        ${last_name},
        ${street_name},
        ${city},
        ${postcode},
        ${email_address},
        ${phone_number},
        ${trim(national_insurance, " ")},
        ${date_of_birth},
        ${license_number},
        ${issuing_authority},
        ${license_expiry}
      )
      RETURNING *
    `;

    return result[0];
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
}

export async function getAllClients() {
  try {
    const rows = await sql`
      SELECT id, first_name, last_name
      FROM clients
      ORDER BY first_name, last_name ASC
    `;
    return rows;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
}
