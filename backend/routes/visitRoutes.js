const express = require("express");
const Visit = require("../models/visit");
const router = express.Router();


// Get visits by patient
router.get("/:patientId", async (req, res) => {
  const visits = await Visit.find({ patientId: req.params.patientId });
  res.json(visits);
});

// Add visit
router.post("/sync", async (req, res) => {
  try {
    const visits = req.body.visits;

    for (const v of visits) {
      await Visit.findOneAndUpdate(
        { id: v.id },
        v,
        { upsert: true }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.log("Sync error:", err);
    res.json({ success: false });
  }
});


module.exports = router;
