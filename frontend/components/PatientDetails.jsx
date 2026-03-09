import React, { useState } from "react";
import {
  ChevronLeft,
  History,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const PatientDetails = ({
  patient,
  onBack,
  onUpdate,
  onDelete,
  workerLocation
}) => {
  const [showVisitForm, setShowVisitForm] = useState(false);
  
  const [newVisit, setNewVisit] = useState({
    symptoms: "",
    notes: "",
    weight: "",
    bloodPressure: "",
    temperature: ""
  });

  const visits = patient?.visits ?? [];   // IMPORTANT FIX

  const handleAddVisit = async () => {
    const visit = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
      ...newVisit,
      location: workerLocation || null
    };

    const updatedPatient = {
      ...patient,
      visits: [visit, ...visits],
      lastVisitDate: visit.date,
      isSynced: false
    };

    await onUpdate(updatedPatient);
    setShowVisitForm(false);
    setNewVisit({
      symptoms: "",
      notes: "",
      weight: "",
      bloodPressure: "",
      temperature: ""
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 font-black text-xs uppercase tracking-widest"
      >
        <ChevronLeft /> Back
      </button>

      <div className="bg-white p-8 rounded-3xl border">
        <h2 className="text-3xl font-black">{patient.name}</h2>
        <p className="text-slate-500">
          {patient.age} yrs • {patient.category}
        </p>

        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="w-4 h-4" /> {patient.village}
        </div>
      </div>

      {/* Visits Section */}
      <div className="bg-white p-8 rounded-3xl border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black flex items-center gap-2">
            <History /> Visit History
          </h3>

          <button
            onClick={() => setShowVisitForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black"
          >
            Add Visit
          </button>
        </div>

        {(!visits || visits.length === 0) ? (
          <div className="text-center py-20 text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-3" />
            No visits recorded yet
          </div>
        ) : (
          visits.map(v => (
            <div
              key={v.id}
              className="p-5 border rounded-2xl flex justify-between"
            >
              <div>
                <p className="font-black">{v.date}</p>
                <p className="text-slate-500 text-sm">{v.symptoms}</p>
              </div>

              {v.location && (
                <span className="text-[10px] text-emerald-600 font-black">
                  GPS Tagged
                </span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Visit Form */}
      {showVisitForm && (
        <div className="bg-white p-8 rounded-3xl border space-y-4">
          <h3 className="text-lg font-black">New Field Visit</h3>

          <input
            placeholder="Symptoms"
            className="border p-3 rounded-xl w-full"
            value={newVisit.symptoms}
            onChange={e =>
              setNewVisit(prev => ({ ...prev, symptoms: e.target.value }))
            }
          />

          <textarea
            placeholder="Notes"
            className="border p-3 rounded-xl w-full"
            value={newVisit.notes}
            onChange={e =>
              setNewVisit(prev => ({ ...prev, notes: e.target.value }))
            }
          />

          <button
            onClick={handleAddVisit}
            className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Visit
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
