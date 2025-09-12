import nodemailer from "nodemailer";
import sql from "../db/db.js";
import generateInvoiceHtml from "./generateInvoice.js";

const transporter = nodemailer.createTransport({
  host: "premium267.web-hosting.com",
  port: 587, // Use 587 if your host recommends STARTTLS
  secure: false, // true for port 465
  auth: {
    user: process.env.EMAIL_USER, // Full email address
    pass: process.env.EMAIL_PASSWORD, // SMTP password or app password
  },
  tls: {
    rejectUnauthorized: true,
  },
  logger: true,
  debug: true,
});

export async function sendTestEmail(toEmail) {
  console.log("Sending test email to:", toEmail);
  try {
    const info = await transporter.sendMail({
      from: "<usman@accidentdirectclaimsltd.co.uk>",
      to: toEmail, // recipient
      subject: "Test Email",
      text: "This is a test email sent using Nodemailer and your SMTP server.",
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

export async function findDueInvoices() {
  try {
    const invoices =
      await sql`SELECT p.payment_id, c.first_name, c.last_name, c.street_name, c.city, c.postcode, c.email_address, v.vrm, v.make, v.model, v.company, p.week_no ,p.start_date, p.end_date, p.due_date, p.amount_due, p.status
            FROM  payments p
            JOIN rentals r
            ON p.rental_id = r.rental_id
            JOIN clients c
            ON r.client_id = c.id
            JOIN vehicles v
            ON r.vehicle_id = v.id
            WHERE (p.status = 'Pending' AND p.due_date = CURRENT_DATE)`;

    for (let invoice of invoices) {
      console.log(invoice);
      const html = generateInvoiceHtml(invoice);

      await transporter.sendMail({
        from: `"Accident Direct Claims Ltd." <${process.env.EMAIL_USER}>`,
        to: invoice.email_address, // recipient
        subject: `Invoice ${invoice.payment_id} - ${invoice.first_name} ${invoice.last_name} - ${invoice.vrm}`,
        html,
      });
    }
  } catch (error) {
    console.error("Error finding due invoices:", error);
  }
}

/*

export async function sendOverdueEmail(toEmail) {}

export async function sendInvoiceEmail(toEmail) {}

*/
