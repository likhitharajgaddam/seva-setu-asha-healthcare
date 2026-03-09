import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  Bell,
  Stethoscope,
  Loader2,
  LogOut,
  ClipboardList,
  Map as MapIcon
} from "lucide-react";

import { backend } from "./backend";

import Dashboard from "./components/Dashboard";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import PatientDetails from "./components/PatientDetails";
import ASHATraining from "./components/ASHATraining";
import SurveyModule from "./components/SurveyModule";
import VillageMap from "./components/VillageMap";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import ConfirmationModal from "./components/ConfirmationModal";
import Schedule from "./components/Schedule";


const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "map", label: "Village Map", icon: MapIcon },
  { id: "add", label: "New Patient", icon: UserPlus },
  { id: "list", label: "Directory", icon: Users },
  { id: "reminders", label: "Schedule", icon: Bell },
  { id: "surveys", label: "Field Surveys", icon: ClipboardList },
  { id: "training", label: "Training", icon: GraduationCap }
];

const App = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");
  const [surveyResponses, setSurveyResponses] = useState([]);
  const [surveyTemplates, setSurveyTemplates] = useState([]);


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(
    !sessionStorage.getItem("asha_worker_id")
  );

  const [currentWorkerId, setCurrentWorkerId] = useState(null);
  const [currentWorkerName, setCurrentWorkerName] = useState(null);

  const [workerLocation, setWorkerLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(
    sessionStorage.getItem("tracking_active") === "true"
  );

  const watchIdRef = useRef(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: "patient",
    id: "",
    title: "",
    message: ""
  });

  // Load Patients
  const loadData = useCallback(async () => {
    try {
      const data = await backend.getPatients();
      setPatients(data || []);

      if (selectedPatient) {
        const updated = data.find((p) => p.id === selectedPatient.id);
        if (updated) setSelectedPatient({ ...updated });
      }
    } catch (err) {
      console.error("Vault access error:", err);
    }
  }, [selectedPatient?.id]);
  const saveSurvey = (response) => {
  console.log("Saving Survey to App State", response);
  setSurveyResponses(prev => [...prev, response]);
};

const deleteSurvey = (id) => {
  setSurveyResponses(prev => prev.filter(r => r.id !== id));
};

const saveTemplate = (template) => {
  console.log("Saving Template", template);
  setSurveyTemplates(prev => [...prev, template]);
};

const deleteTemplate = (id) => {
  setSurveyTemplates(prev => prev.filter(t => t.id !== id));
};


  // Sync
  const handleSyncAll = useCallback(async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await backend.syncAll((msg) => setSyncMessage(msg));
      await loadData();
    } finally {
      setIsSyncing(false);
      setSyncMessage("");
    }
  }, [loadData]);

  // GPS Tracking
  const startTracking = useCallback(() => {
    if ("geolocation" in navigator) {
      setIsTracking(true);
      sessionStorage.setItem("tracking_active", "true");

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) =>
          setWorkerLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }),
        () => setIsTracking(false),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    sessionStorage.removeItem("tracking_active");
    if (watchIdRef.current !== null)
      navigator.geolocation.clearWatch(watchIdRef.current);
  }, []);

  // App Init
  useEffect(() => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setWorkerLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      err => {
        console.log("Location denied");
      }
    );
  }
}, []);
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleSyncAll();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const savedWorkerId = sessionStorage.getItem("asha_worker_id");
    const savedWorkerName = sessionStorage.getItem("asha_worker_name");

    if (savedWorkerId && savedWorkerName) {
      setCurrentWorkerId(savedWorkerId);
      setCurrentWorkerName(savedWorkerName);
      setIsAuthenticated(true);
      setShowLanding(false);
    }

    loadData().then(() => {
      setIsLoading(false);
      if (navigator.onLine) handleSyncAll();
      if (sessionStorage.getItem("tracking_active") === "true")
        startTracking();
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      stopTracking();
    };
  }, []);

  // Login
  const handleLogin = (workerId, name) => {
    setCurrentWorkerId(workerId);
    setCurrentWorkerName(name);
    setIsAuthenticated(true);

    sessionStorage.setItem("asha_worker_id", workerId);
    sessionStorage.setItem("asha_worker_name", name);
  };

  // Save Patient
  const handleSavePatient = async (patient) => {
    await backend.savePatient(patient);
    await loadData();
    setActiveView("list");
    if (navigator.onLine) handleSyncAll();
  };

  // Loading Screen
  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Booting SevaBackend...
        </p>
      </div>
    );

  if (showLanding)
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row h-full">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={async () => {
          if (confirmModal.type === "patient")
            await backend.deletePatient(confirmModal.id);
          await loadData();
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() =>
          setConfirmModal((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 h-screen z-40 bg-white border-r border-slate-200 w-64 transform transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            SevaSetu
          </h1>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                activeView === item.id
                  ? "bg-blue-600 text-white font-black shadow-xl shadow-blue-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold text-sm"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/50">
          <div
            className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${
              isOnline
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-amber-50 border-amber-100 text-amber-700"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                isOnline ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {isOnline ? "Cloud Linked" : "Vault Mode"}
          </div>

          <button
            onClick={() => {
              stopTracking();
              sessionStorage.removeItem("asha_worker_id");
              setIsAuthenticated(false);
              setShowLanding(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 font-black text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
        {activeView === "dashboard" && (
          <Dashboard
            workerName={currentWorkerName || "Health Worker"}
            patients={patients}
            reminders={reminders}
            onNewPatient={() => setActiveView("add")}
            onViewList={() => setActiveView("list")}
            onViewMap={() => setActiveView("map")}
            onSync={handleSyncAll}
            isSyncing={isSyncing}
            isOnline={isOnline}
            workerLocation={workerLocation}
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setActiveView("details");
            }}
          />
        )}

        {activeView === "map" && (
          <VillageMap
            patients={patients}
            workerLocation={workerLocation}
            onSelectPatient={(p) => {
              setSelectedPatient(p);
              setActiveView("details");
            }}
            isOnline={isOnline}
          />
        )}

        {activeView === "add" && (
          <PatientForm
            onSave={handleSavePatient}
            onCancel={() => setActiveView("dashboard")}
          />
        )}

        {activeView === "list" && (
          <PatientList
            patients={patients}
            onSelect={(p) => {
              setSelectedPatient(p);
              setActiveView("details");
            }}
            onDelete={(id) =>
              setConfirmModal({
                isOpen: true,
                type: "patient",
                id,
                title: "Delete Patient?",
                message: "This will remove the local record."
              })
            }
          />
        )}

        {activeView === "details" && selectedPatient && (
          <PatientDetails
            patient={selectedPatient}
            onBack={() => setActiveView("list")}
            onUpdate={handleSavePatient}
            onDelete={(id) =>
              setConfirmModal({
                isOpen: true,
                type: "patient",
                id,
                title: "Delete Patient?",
                message: "Remove permanently?"
              })
            }
            onToggleSync={() => {}}
            workerLocation={workerLocation}
          />
        )}
        {activeView === "reminders" && (
  <Schedule
    patients={patients}
  />
)}
{/* FIELD SURVEYS */}
{activeView === "surveys" && (
  <SurveyModule
  responses={surveyResponses}
  customTemplates={surveyTemplates}
  isOnline={isOnline}
  onSaveSurvey={saveSurvey}
  onDeleteSurvey={deleteSurvey}
  onSaveTemplate={saveTemplate}
  onDeleteTemplate={deleteTemplate}
  workerLocation={location}
/>

)}

{/* TRAINING MODULE */}
{activeView === "training" && (
  <ASHATraining />
)}


      </main>
    </div>
  );
};

export default App;
