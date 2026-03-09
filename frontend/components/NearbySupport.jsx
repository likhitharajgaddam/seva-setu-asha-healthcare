import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  ExternalLink,
  Navigation,
  Loader2,
  Hospital,
  Building2,
  AlertCircle,
} from "lucide-react";

import { getNearbyMedicalSupport } from "../services/geminiService";

const NearbySupport = ({ location, isOnline }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSupport = async () => {
    if (!isOnline) {
      setError("Medical facility search requires an internet connection.");
      return;
    }

    if (!location) {
      setError("Please enable GPS to find facilities near your current position.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getNearbyMedicalSupport(location);
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch nearby hospitals. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOnline && location && !data) {
      fetchSupport();
    }
  }, [isOnline, location]);

  if (loading) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl space-y-6">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          Locating Facilities...
        </h3>
        <p className="text-slate-400 font-medium">
          Scanning for nearest PHCs and Hospitals relative to your GPS coordinates.
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl space-y-6">
        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <Hospital className="w-10 h-10 text-slate-200" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Medical Support Network
          </h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto">
            {error || "Access a verified list of nearby health centers for referrals."}
          </p>
        </div>

        {isOnline && (
          <button
            onClick={fetchSupport}
            className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Find Nearby PHC/CHC
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8">
      <div className="bg-blue-600 rounded-[3rem] p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <Navigation className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-10 -rotate-12" />

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Emergency Referral Map
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight">Nearby Facilities</h2>
            </div>

            <button
              onClick={fetchSupport}
              className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all"
            >
              <MapPin className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/10 italic text-blue-100 leading-relaxed font-medium text-lg">
            "{data.text}"
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {(data?.groundingChunks || []).map((chunk, i) => {
          const place = chunk.maps;
          if (!place) return null;

          const isPHC =
            place.title.toLowerCase().includes("phc") ||
            place.title.toLowerCase().includes("centre");

          return (
            <div
              key={i}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all group"
            >
              <div className="flex items-center gap-5 mb-6">
                <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-inner">
                  {isPHC ? (
                    <Building2 className="w-7 h-7" />
                  ) : (
                    <Hospital className="w-7 h-7" />
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-slate-800 text-lg leading-tight truncate tracking-tight">
                    {place.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    Healthcare Facility
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
                >
                  <ExternalLink className="w-4 h-4" /> Open Maps
                </a>

                <button className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 shadow-sm">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex items-center gap-6">
        <div className="bg-amber-100 p-4 rounded-2xl text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div>
          <h5 className="font-black text-amber-900 text-sm mb-1 uppercase tracking-widest leading-none">
            Emergency Protocol
          </h5>
          <p className="text-xs text-amber-700 font-medium leading-relaxed">
            Always notify the Medical Officer (MO) at the facility before referring critical maternal
            cases for emergency transport.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NearbySupport;
