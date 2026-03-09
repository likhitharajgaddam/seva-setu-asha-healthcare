const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Universal email sender
async function sendEmail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log("❌ RESEND API KEY missing");
    throw new Error("Missing Resend key");
  }

  try {
    const response = await resend.emails.send({
      from: "ASHA Health <noreply@resend.dev>",
      to,
      subject,
      html
    });

    console.log("📧 Email sent:", response?.id || "sent");
    return response;
  } catch (err) {
    console.error("❌ Email send failed", err.message);
    throw err;
  }
}

module.exports = { sendEmail };
