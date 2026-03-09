const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  },

  bp: String,
  weight: String,
  symptoms: String,
  notes: String,

  synced: Boolean
}, { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);
