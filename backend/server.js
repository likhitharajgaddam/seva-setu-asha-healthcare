require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const syncRoutes = require("./routes/syncRoutes");

const { sendEmail } = require("./services/emailService");
const { otpStore, generateOtp } = require("./utils/otpStore");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/patients", patientRoutes);
app.use("/api/visits", visitRoutes);


// ---------------- ROOT ----------------
app.get("/", (req, res) => {
  res.send("ASHA Health Records API is running ✅");
});

// // ---------------- DEMO DB ----------------
// let visits = [];
// let patients = [];


// ---------------- SIGNUP CONFIRMATION EMAIL ----------------
app.post("/api/send-confirmation", async (req, res) => {
  const { email, name, username } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const displayName = name || "ASHA Worker";

  const mailOptions = {
    to: email,
    subject: "Account Created Successfully - ASHA Health Records",
    html: `
      <p>Dear <strong>${displayName}</strong>,</p>
      <p>Your account has been <strong>successfully created</strong> on the ASHA Health Records app.</p>
      <p><strong>Username:</strong> ${username}</p>
      <p>You can now login, record visits offline & sync anytime.</p>
      <p>Thank you for serving the community ❤️</p>
      <p>- ASHA Health Records Team</p>
    `
  };

  try {
    await sendEmail(mailOptions);
    console.log(`Signup email sent to ${email}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Signup email failed:", err.message);
    res.json({
      success: true,
      message: "Account created, but email could not be sent.",
    });
  }
});



app.post("/api/request-otp", async (req, res) => {
  const { email, name } = req.body;

  if (!email)
    return res.status(400).json({ success: false, message: "Email required" });

  const displayName = name || "ASHA Worker";

  const otp = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore[email] = { code: otp, expiresAt };

  const mailOptions = {
    to: email,
    subject: "Your Login OTP - ASHA Health Records",
    html: `
      <p>Dear <strong>${displayName}</strong>,</p>
      <p>Your OTP for login is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for <strong>5 minutes</strong>.</p>
      <p>Do not share with anyone.</p>
      <p>- ASHA Health Records Team</p>
    `
  };

  try {
    await sendEmail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent to email",
      devOtp: otp, // keep for testing
    });
  } catch (err) {
    console.log("Email not available. Using DEV mode OTP");
    console.log(`(DEV MODE) OTP for ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP generated (email not working). Check server console.",
      devOtp: otp,
    });
  }
});






// ---------------- VERIFY OTP ----------------
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email & OTP required" });
  }

  const record = otpStore[email];

  if (!record)
    return res
      .status(400)
      .json({ success: false, message: "No OTP found. Request again." });

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res
      .status(400)
      .json({ success: false, message: "OTP expired. Request again." });
  }

  if (String(record.code).trim() !== String(otp).trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect OTP" });
  }

  delete otpStore[email];
  console.log("OTP verified for", email);

  res.json({ success: true, message: "OTP verified successfully" });
});


// ---------------- START SERVER ----------------


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
