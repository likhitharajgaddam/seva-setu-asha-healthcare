import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  CloudOff
} from "lucide-react";

import { getHealthInsights } from "../services/geminiService";

const AIInsights = ({ patients, isOnline }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    if (!isOnline) {
      setError(
        "AI Analysis requires an active internet connection. Please sync when you are back in a network area."
      );
      return;
    }

    if (!patients || patients.length === 0) {
      setError(
        "Please register patient records first to generate community insights."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHealthInsights(patients);
      setInsights(data);
    } catch (err) {
      console.error(err);
      setError(
        "The AI engine is currently busy. Please try again in a few moments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOnline && patients.length > 0 && !insights) {
      fetchInsights();
    }
  }, [isOnline, patients.length]);

  // Loading
  if (loading) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl space-y-6">
        <div className="relative inline-block">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
          Generating Health Intelligence...
        </h3>
        <p className="text-slate-400 font-medium max-w-xs mx-auto italic">
          Reviewing field records for high-priority maternal and child health
          patterns.
        </p>
      </div>
    );
  }

  // Empty / Error
  if (error || !insights) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 shadow-xl space-y-8">
        <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          {isOnline ? (
            <Sparkles className="w-12 h-12 text-blue-200" />
          ) : (
            <CloudOff className="w-12 h-12 text-amber-300" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Village Insights
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
            {error ||
              "Your digital companion is ready to analyze community trends and provide field guidance."}
          </p>
        </div>

        {isOnline && (
          <button
            onClick={fetchInsights}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            Start AI Analysis
          </button>
        )}
      </div>
    );
  }

  // Main Insights UI
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>

        <div className="relative z-10 space-y-12">
          <header className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-3 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-400/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  AI Strategic Briefing
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tight">
                Community Health Profile
              </h2>
            </div>

            <button
              onClick={fetchInsights}
              className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/5"
            >
              <TrendingUp className="w-6 h-6" />
            </button>
          </header>

          <div className="space-y-6">
            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">
              Critical Follow-up Targets
            </h3>

            <div className="grid gap-4">
              {insights.criticalCases.map((c, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        c.urgency === "High"
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-900/40"
                          : "bg-amber-500 text-white shadow-lg shadow-amber-900/40"
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div>
                      <h4 className="font-black text-lg mb-1 leading-none">
                        {c.patientName}
                      </h4>
                      <p className="text-sm text-white/50">{c.reason}</p>
                    </div>
                  </div>

                  <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/5 group-hover:border-blue-400/30 transition-all">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">
                      Recommended Action
                    </p>
                    <p className="text-sm font-bold">{c.actionItem}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 border-t border-white/10 pt-12">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <TrendingUp className="w-4 h-4" /> Observed Patterns
              </h3>
              <p className="text-xl text-white/90 leading-relaxed font-medium italic">
                "{insights.villageReport}"
              </p>
            </div>

            <div className="bg-blue-600/30 p-8 rounded-[3rem] border border-blue-400/20 space-y-4">
              <h3 className="text-xs font-black text-amber-400 uppercase tracking-[0.3em] flex items-center gap-3">
                <Lightbulb className="w-4 h-4" /> Field Protocol Reminder
              </h3>
              <p className="text-base text-blue-100 font-bold leading-relaxed">
                {insights.trainingTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-black text-slate-800 tracking-tight">
              Reporting Status
            </h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              All current field records included in analysis
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          Verified {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default AIInsights;
