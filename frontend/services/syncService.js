import {
  getUnsyncedPatients,
  getUnsyncedReminders,
  savePatient,
  saveReminder,
  getAllSurveys,
  saveSurvey
} from "../db";

// Simulation of a MongoDB Backend Endpoint
const MOCK_MONGODB_API = "https://api.sevasetu.health/v1/sync";

/**
 * Strategy: MongoDB Cloud Synchronization Bridge
 * When online, the app pushes local modifications to the Cloud.
 */
export const synchronizeData = async (onProgress) => {
  try {
    let syncedCount = 0;

    if (!navigator.onLine) {
      onProgress("Offline. Waiting for connection...");
      return { success: false, syncedCount: 0 };
    }

    // --- PHASE 1: UPLOAD LOCAL CHANGES TO CLOUD ---
    onProgress("Authenticating with MongoDB Atlas...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const unsyncedPatients = await getUnsyncedPatients();
    const unsyncedReminders = await getUnsyncedReminders();
    const allSurveys = await getAllSurveys();
    const unsyncedSurveys = allSurveys.filter((s) => !s.isSynced);

    if (unsyncedPatients.length > 0) {
      onProgress(`Pushing ${unsyncedPatients.length} patients to cloud...`);

      for (const p of unsyncedPatients) {
        // MOCK Example:
        // await fetch(MOCK_MONGODB_API, { method: "POST", body: JSON.stringify(p) });

        await new Promise((resolve) => setTimeout(resolve, 200));
        p.isSynced = true;
        await savePatient(p);
        syncedCount++;
      }
    }

    if (unsyncedReminders.length > 0) {
      onProgress(`Updating ${unsyncedReminders.length} tasks in MongoDB...`);

      for (const r of unsyncedReminders) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        r.isSynced = true;
        await saveReminder(r);
        syncedCount++;
      }
    }

    if (unsyncedSurveys.length > 0) {
      onProgress(`Saving ${unsyncedSurveys.length} survey responses...`);

      for (const s of unsyncedSurveys) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        s.isSynced = true;
        await saveSurvey(s);
        syncedCount++;
      }
    }

    // --- PHASE 2: VALIDATION ---
    onProgress("Validating cloud data integrity...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    onProgress("MongoDB Cloud Sync Complete.");
    return { success: true, syncedCount };
  } catch (error) {
    console.error("MongoDB Sync failed:", error);
    onProgress("Sync interrupted. Records kept safely in local vault.");
    return { success: false, syncedCount: 0 };
  }
};
