const DB_NAME = "SevaSetuDB";
const DB_VERSION = 4;
const PATIENT_STORE = "patients";
const REMINDER_STORE = "reminders";
const SURVEY_STORE = "surveys";
const TEMPLATE_STORE = "survey_templates";

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(PATIENT_STORE)) {
        db.createObjectStore(PATIENT_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(REMINDER_STORE)) {
        db.createObjectStore(REMINDER_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(SURVEY_STORE)) {
        db.createObjectStore(SURVEY_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(TEMPLATE_STORE)) {
        db.createObjectStore(TEMPLATE_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// ---------------- Patients ----------------

export const savePatient = async (patient) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(PATIENT_STORE, "readwrite").objectStore(PATIENT_STORE);
    const request = store.put(patient);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllPatients = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(PATIENT_STORE, "readonly").objectStore(PATIENT_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deletePatient = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(PATIENT_STORE, "readwrite").objectStore(PATIENT_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ---------------- Reminders ----------------

export const saveReminder = async (reminder) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(REMINDER_STORE, "readwrite").objectStore(REMINDER_STORE);
    const request = store.put(reminder);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllReminders = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(REMINDER_STORE, "readonly").objectStore(REMINDER_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteReminder = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(REMINDER_STORE, "readwrite").objectStore(REMINDER_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ---------------- Surveys ----------------

export const saveSurvey = async (survey) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(SURVEY_STORE, "readwrite").objectStore(SURVEY_STORE);
    const request = store.put(survey);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllSurveys = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(SURVEY_STORE, "readonly").objectStore(SURVEY_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteSurvey = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(SURVEY_STORE, "readwrite").objectStore(SURVEY_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ---------------- Templates ----------------

export const saveTemplate = async (template) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(TEMPLATE_STORE, "readwrite").objectStore(TEMPLATE_STORE);
    const request = store.put(template);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getAllTemplates = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(TEMPLATE_STORE, "readonly").objectStore(TEMPLATE_STORE);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteTemplate = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const store = db.transaction(TEMPLATE_STORE, "readwrite").objectStore(TEMPLATE_STORE);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

// ---------------- Unsynced Helpers ----------------

export const getUnsyncedPatients = async () => {
  const all = await getAllPatients();
  return all.filter((p) => !p.isSynced);
};

export const getUnsyncedReminders = async () => {
  const all = await getAllReminders();
  return all.filter((r) => !r.isSynced);
};
