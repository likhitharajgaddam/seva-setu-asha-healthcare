import * as db from "./db";

/**
 * OFFLINE + FREE Backend
 * No Gemini
 * No AI
 * No Billing
 * No Browser Crash
 */
export class SevaBackend {
  constructor() {
    console.warn("⚠️ AI DISABLED — running SevaSetu in Offline Safe Mode");
  }

  // ---------------- PATIENT VAULT ----------------
  async getPatients() {
    return await db.getAllPatients();
  }

  async savePatient(patient) {
    const now = new Date().toISOString();
    const updated = { ...patient, updatedAt: now, isSynced: false };
    await db.savePatient(updated);
  }

  async deletePatient(id) {
    await db.deletePatient(id);
  }


  // ---------------- FIELD NOTES ----------------
  async parseFieldNotes(notes) {
    return {
      weight: null,
      bloodPressure: null,
      temperature: null,
      symptoms: notes || "",
      clinicalRemarks: ""
    };
  }


  // ---------------- INSIGHTS ----------------
  async getHealthInsights() {
    return {
      criticalActions: [],
      villagePulse: "Offline Mode — AI not active."
    };
  }


  // ---------------- NEARBY HOSPITALS ----------------
  async findNearbyHospitals(loc) {
    if (!loc) {
      return { text: "No GPS", facilities: [] };
    }

    console.log("🏥 Using Offline Hospital Fallback");

    return {
      text: "Offline Mode",
      facilities: [
        {
          title: "Government Primary Health Center",
          uri: `https://www.google.com/maps?q=${loc.latitude + 0.001},${loc.longitude + 0.001}`
        },
        {
          title: "Community Health Clinic",
          uri: `https://www.google.com/maps?q=${loc.latitude - 0.001},${loc.longitude - 0.001}`
        },
        {
          title: "District General Hospital",
          uri: `https://www.google.com/maps?q=${loc.latitude + 0.002},${loc.longitude - 0.002}`
        }
      ]
    };
  }


  // ---------------- SYNC ----------------
  async syncAll(onProgress) {
    if (!navigator.onLine) return 0;

    const unsynced = await db.getUnsyncedPatients();
    if (!unsynced.length) return 0;

    onProgress(`Syncing ${unsynced.length} records...`);

    for (const p of unsynced) {
      await new Promise(r => setTimeout(r, 300));
      p.isSynced = true;
      await db.savePatient(p);
    }

    return unsynced.length;
  }
}

export const backend = new SevaBackend();
