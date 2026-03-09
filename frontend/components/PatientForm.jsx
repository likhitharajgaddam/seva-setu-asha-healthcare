import React, { useState } from "react";
import {
  ChevronLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  CheckCircle2,
  HeartPulse
} from "lucide-react";

const PatientForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Female",
    category: "General",
    phone: "",
    village: "",
    address: "",
    riskLevel: "Low",
  });

  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("GPS not supported");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setIsLocating(false);
      },
      () => {
        alert("Enable GPS & retry");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.phone || !formData.village) {
      alert("Fill all required fields");
      return;
    }

    if (formData.phone.length < 10) {
      alert("Enter valid mobile number");
      return;
    }

    setIsSubmitting(true);
    const now = new Date().toISOString();

    const newPatient = {
      id: crypto.randomUUID(),
      ...formData,
      age: parseInt(formData.age),
      isSynced: false,
      visits: [],
      createdAt: now,
      updatedAt: now,
      lastVisitDate: new Date().toISOString().split("T")[0],
      location: location || undefined
    };

    setTimeout(() => {
      onSave(newPatient);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <button
        onClick={onCancel}
        className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Discard & Back
      </button>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-10 text-white relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <User className="w-32 h-32" />
          </div>

          <div className="relative z-10">
            <div className="bg-white/20 p-3 rounded-2xl w-fit mb-6">
              <User className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl font-black tracking-tight mb-2">
              New Patient Entry
            </h2>

            <p className="text-blue-100 font-medium">
              Capture essential health & household healthcare data
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-10 space-y-10">

          {/* PERSONAL DETAILS */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Personal Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              {/* NAME */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Full Patient Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g Smt. Devi"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl"
                  />
                </div>
              </div>

              {/* AGE */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Age (Years) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    required
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="Years"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* HEALTH PROFILE */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Health Profile
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* CATEGORY */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Health Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl"
                >
                  <option>General</option>
                  <option>Maternal</option>
                  <option>Infant</option>
                  <option>Elderly</option>
                  <option>Chronic</option>
                  <option>Disability</option>
                  
                </select>
              </div>

              {/* RISK */}
              <div className="space-y-2">
  <label className="text-sm font-bold text-slate-700">
    Initial Risk Status
  </label>

  <div className="relative">
    <select
      value={formData.riskLevel}
      onChange={(e) =>
        setFormData({ ...formData, riskLevel: e.target.value })
      }
      className={`w-full px-4 py-3.5 rounded-2xl border font-bold cursor-pointer outline-none transition-all
        ${
          formData.riskLevel === "High"
            ? "bg-rose-50 border-rose-200 text-rose-700"
            : formData.riskLevel === "Medium"
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : "bg-emerald-50 border-emerald-200 text-emerald-700"
        }
      `}
    >
      <option value="Low">Low Health Risk</option>
      <option value="Medium">Medium Health Risk</option>
      <option value="High">High Health Risk</option>
    </select>
  </div>
</div>
</div>
          </section>

          {/* LOCATION */}
          <section className="space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Location & Reach
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* VILLAGE */}
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Village / Hamlet *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    value={formData.village}
                    onChange={(e) =>
                      setFormData({ ...formData, village: e.target.value })
                    }
                    placeholder="e.g Rampur"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl"
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    placeholder="10-digit mobile"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl"
                  />
                </div>
              </div>
            </div>

            {/* GPS */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
  <div className="flex items-center justify-between">
    <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
      <MapPin className="w-4 h-4 text-blue-600" />
      GPS Coordinates
    </p>

    {location && (
      <span className="text-[10px] bg-white px-2 py-1 rounded-md border border-slate-100 font-mono text-slate-500">
        {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
      </span>
    )}
  </div>

  <button
    type="button"
    onClick={handleGetLocation}
    className={`w-full py-4 px-6 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 transition-all font-bold ${
      location 
        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
        : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'
    }`}
  >
    {isLocating ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : location ? (
      <>
        <CheckCircle2 className="w-5 h-5" />
        Household Location Captured
      </>
    ) : (
      <>
        <MapPin className="w-5 h-5" />
        Tag GPS Location
      </>
    )}
  </button>
</div>

          </section>

          {/* ADDRESS */}
          <div>
            <label className="text-sm font-bold text-slate-700">
              Address / Landmark
            </label>

            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="e.g Near school…"
              className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl h-28"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold"
            >
              {isSubmitting ? "Saving..." : "Complete Registration"}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 border border-slate-200 py-4 rounded-xl font-bold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
