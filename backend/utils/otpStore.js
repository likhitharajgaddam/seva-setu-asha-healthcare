// utils/otpStore.js

const otpStore = {};  // store OTPs in memory

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000); // 6 digit OTP
}

module.exports = {
  otpStore,
  generateOtp
};
