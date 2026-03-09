const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const patients = req.body;

    for (const p of patients) {
      p.unsynced = false;
      await Patient.findOneAndUpdate(
        { healthId: p.healthId },
        p,
        { upsert: true, new: true }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error("SYNC ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
