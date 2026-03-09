import React from "react";
import {
  Stethoscope,
  ShieldCheck,
  CloudOff,
  Zap,
  ArrowRight,
  HeartPulse,
  Baby,
  Users
} from "lucide-react";

const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden relative">
      {/* Animated Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-indigo-50 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-200">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">
            SevaSetu
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span className="text-blue-600">Home</span>
          <span className="hover:text-slate-600 cursor-pointer transition-colors">
            Safety
          </span>
          <span className="hover:text-slate-600 cursor-pointer transition-colors">
            Offline First
          </span>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-24 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
              <Zap className="w-4 h-4 fill-blue-700" />
              Trusted by 5,000+ ASHA Workers
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Compassionate Care,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Data Driven
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Empowering village health workers with offline-first patient
              records, automated reminders, and AI-powered maternal health
              insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Launch Portal
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-[2rem]">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  System Ready
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-slate-100">
              <div>
                <p className="text-3xl font-black text-slate-900">100%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Offline Access
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-slate-900">0.0s</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Data Latency
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-slate-900">MIL</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Military Grade
                </p>
              </div>
            </div>
          </div>

          {/* Illustration / Cards */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <div className="relative bg-gradient-to-br from-blue-100 to-indigo-100 w-full aspect-square rounded-[4rem] overflow-hidden shadow-inner border-8 border-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <Stethoscope className="w-64 h-64 text-blue-200/50 -rotate-12" />
              </div>

              <div className="absolute top-10 left-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-[bounce_4s_infinite]">
                <HeartPulse className="w-10 h-10 text-rose-500 mb-3" />
                <p className="font-black text-slate-800 text-sm">
                  Maternal Tracking
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Safe Deliveries
                </p>
              </div>

              <div className="absolute bottom-20 right-10 p-6 bg-white rounded-3xl shadow-xl border border-slate-100 animate-[bounce_5s_infinite_1s]">
                <Baby className="w-10 h-10 text-emerald-500 mb-3" />
                <p className="font-black text-slate-800 text-sm">
                  Immunization
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Timely Alerts
                </p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl border-4 border-white">
                <ShieldCheck className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Offline Badge */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl border-4 border-slate-800 flex items-center gap-4 w-fit whitespace-nowrap">
              <CloudOff className="w-8 h-8 text-blue-400" />
              <div>
                <p className="font-black text-lg leading-none mb-1">
                  Local First Architecture
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Works without Internet in remote areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section */}
      <section className="bg-slate-50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-12">
            Built for Grassroots Health
          </h3>

          <div className="flex flex-wrap justify-center gap-16 opacity-40 grayscale">
            <div className="flex items-center gap-3 font-black text-2xl text-slate-900">
              <Users className="w-8 h-8" /> Community
            </div>

            <div className="flex items-center gap-3 font-black text-2xl text-slate-900">
              <ShieldCheck className="w-8 h-8" /> NHM Compliant
            </div>

            <div className="flex items-center gap-3 font-black text-2xl text-slate-900">
              <Zap className="w-8 h-8" /> Instant Sync
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
