const express = require("express");
const router = express.Router();

const { sendOtpEmail, sendSignupEmail } = require("../services/emailService");
const { saveOtp, verifyOtp } = require("../utils/otpStore");

// ---------- Signup Confirmation ----------
router.post("/send-confirmation", async (req, res) => {
  const { email, name, username } = req.body;

  if (!email) return res.json({ success: false, message: "Email required" });

  try {
    await sendSignupEmail(email, name, username);
    res.json({ success: true });
  } catch {
    res.json({ success: true, message: "Email failed (demo mode ok)" });
  }
});

// ---------- Request OTP ----------
router.post("/request-otp", async (req, res) => {
  const { email, name } = req.body;

  if (!email) return res.json({ success: false, message: "Email required" });

  const otp = saveOtp(email);

  try {
    await sendOtpEmail(email, name || "ASHA Worker", otp);
    res.json({ success: true, message: "OTP sent", devOtp: otp });
  } catch {
    res.json({
      success: true,
      message: "Email failed (demo ok) check server console",
      devOtp: otp,
    });
  }
});

// ---------- Verify OTP ----------
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const ok = verifyOtp(email, otp);

  if (!ok) return res.json({ success: false, message: "Invalid / expired OTP" });

  res.json({ success: true, message: "OTP verified" });
});

module.exports = router;
