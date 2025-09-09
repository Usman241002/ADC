import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "mail.accidentdirectclaimsltd.co.uk", // Outgoing server
  port: 587, // SMTP Port
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASSWORD, // The password for the email account
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendTestEmail(toEmail) {
  console.log("Sending test email to:", toEmail);
  try {
    const info = await transporter.sendMail({
      from: '"Accident Direct Claims" <usman@accidentdirectclaimsltd.co.uk>',
      to: toEmail, // recipient
      subject: "Test Email",
      text: "This is a test email sent using Nodemailer and your SMTP server.",
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

/*

export async function sendOverdueEmail(toEmail) {}

export async function sendInvoiceEmail(toEmail) {}

*/
