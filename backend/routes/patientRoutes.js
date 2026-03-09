const express = require("express");
const Patient = require("../models/Patient");
const router = express.Router();

// Get all patients
router.get("/", async (req,res)=>{
  const patients = await Patient.find();
  res.json(patients);
});

// Save single patient
router.post("/", async (req,res)=>{
  try {
    const patient = await Patient.create(req.body);
    console.log("Patient Saved:", patient);
    res.json({ success:true, patient });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});

// Delete patient
router.delete("/:id", async (req,res)=>{
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({ success:true });
  } catch (err) {
    res.status(500).json({ success:false, message: err.message });
  }
});


router.post("/bulk", async (req, res) => {
  try {
    const patients = req.body;

    for (let p of patients) {
      await Patient.updateOne(
  { _id: p.id || p._id },
  { $set: { ...p, _id: p.id || p._id } },
  { upsert: true }
);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Bulk Sync Error:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
