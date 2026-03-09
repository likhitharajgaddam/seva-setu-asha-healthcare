import React from "react";
import {
  Users,
  Baby,
  HeartPulse,
  AlertTriangle,
  ChevronRight,
  Cloud,
  CloudOff,
  Loader2,
  Calendar,
  Bell,
  CheckCircle,
  RefreshCw,
  FileSpreadsheet,
  Navigation,
  UserPlus,
  Map as MapIcon
} from "lucide-react";

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Dashboard = ({
  workerName,
  patients,
  reminders,
  onNewPatient,
  onViewList,
  onViewMap,
  onSync,
  isSyncing,
  isOnline,
  workerLocation,
  onSelectPatient
}) => {
  const pregnantCount = patients.filter(
    (p) => p.category === "Pregnant"
  ).length;

  const infantCount = patients.filter(
    (p) => p.category === "Infant"
  ).length;

  const highRiskCount = patients.filter(
    (p) => p.riskLevel === "High"
  ).length;

  const unsyncedPatients = patients.filter((p) => !p.isSynced).length;
  const unsyncedReminders = reminders.filter((r) => !r.isSynced).length;
  const totalUnsynced = unsyncedPatients + unsyncedReminders;

  const stats = [
    {
      label: "Village Total",
      value: patients.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      label: "Maternal Care",
      value: pregnantCount,
      icon: HeartPulse,
      color: "text-rose-600",
      bg: "bg-rose-100"
    },
    {
      label: "Infants",
      value: infantCount,
      icon: Baby,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    },
    {
      label: "Critical Risk",
      value: highRiskCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-100"
    }
  ];

  const nearbyPatients = React.useMemo(() => {
    if (!workerLocation) return [];

    return patients
      .filter((p) => p.location)
      .map((p) => ({
        ...p,
        distance: getDistance(
          workerLocation.latitude,
          workerLocation.longitude,
          p.location.latitude,
          p.location.longitude
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [patients, workerLocation]);

  const upcomingReminders = reminders
    .filter((r) => !r.isCompleted)
    .sort(
      (a, b) =>
        new Date(a.dueDate).getTime() -
        new Date(b.dueDate).getTime()
    )
    .slice(0, 3);

  const exportAllToExcel = () => {
    if (patients.length === 0)
      return alert("No patient data to export.");

    const headers = [
      "ID",
      "Name",
      "Age",
      "Gender",
      "Category",
      "Village",
      "Phone",
      "Risk Level",
      "Last Visit",
      "Total Checkups"
    ];

    const rows = patients.map((p) => [
      `"${p.id}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      p.age,
      `"${p.gender}"`,
      `"${p.category}"`,
      `"${p.village.replace(/"/g, '""')}"`,
      `"${p.phone}"`,
      `"${p.riskLevel}"`,
      `"${p.lastVisitDate}"`,
      p.visits.length
    ]);

    const BOM = "\uFEFF";
    const csvString =
      BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvString], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `Village_Health_Ledger_${new Date()
        .toISOString()
        .split("T")[0]}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Namaste, {workerName}</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 opacity-80">Serving Village Communities</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={onNewPatient}
            className="flex items-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Quick Register
          </button>

          <div className={`p-4 rounded-[2.5rem] border-2 flex items-center gap-4 transition-all duration-300 shadow-sm ${
            totalUnsynced > 0 
              ? (isOnline ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100') 
              : 'bg-emerald-50 border-emerald-100'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
              isSyncing ? 'bg-blue-600 scale-110' : 
              totalUnsynced > 0 ? (isOnline ? 'bg-blue-600' : 'bg-amber-600') : 'bg-emerald-600'
            } text-white`}>
              {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : 
               totalUnsynced > 0 ? (isOnline ? <Cloud className="w-6 h-6" /> : <CloudOff className="w-6 h-6" />) : 
               <CheckCircle className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">
                {isSyncing ? 'Synchronizing' : totalUnsynced > 0 ? 'Pending Sync' : 'Device Encrypted'}
              </p>
              <p className={`text-sm font-black leading-none ${
                isSyncing ? 'text-blue-700' : 
                totalUnsynced > 0 ? (isOnline ? 'text-blue-700' : 'text-amber-700') : 'text-emerald-700'
              }`}>
                {isSyncing ? 'Cloud Update...' : 
                 totalUnsynced > 0 ? `${totalUnsynced} Local Updates` : 'Storage Secured'}
              </p>
            </div>
            {totalUnsynced > 0 && isOnline && !isSyncing && (
              <button onClick={onSync} className="ml-2 p-3 bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700 active:scale-90 transition-all">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[3rem] shadow-sm border border-slate-100 hover:border-blue-100 transition-all group overflow-hidden relative">
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform relative z-10`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{stat.value}</p>
            <stat.icon className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-slate-50 opacity-[0.03] rotate-12" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {workerLocation && nearbyPatients.length > 0 ? (
            <div className="bg-slate-900 text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black flex items-center gap-4 tracking-tight">
                    <span className="bg-emerald-500 w-3 h-3 rounded-full animate-ping" />
                    Priority Home Visits
                  </h3>
                  <div className="bg-white/10 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Proximity Sort</span>
                  </div>
                </div>
                <div className="grid gap-4">
                  {nearbyPatients.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => onSelectPatient(p)}
                      className="flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 rounded-[2.5rem] transition-all border border-white/5 group/btn"
                    >
                      <div className="flex items-center gap-6 text-left">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                          p.riskLevel === 'High' ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
                        }`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-lg mb-1">{p.name}</p>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Village: {p.village}</span>
                             <div className="w-1 h-1 rounded-full bg-white/20" />
                             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                               {p.distance < 1000 ? `${Math.round(p.distance)}m` : `${(p.distance/1000).toFixed(1)}km`} away
                             </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 p-4 rounded-2xl group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                        <ChevronRight className="w-6 h-6" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-[4rem] border-2 border-dashed border-slate-100 text-center space-y-4">
               <Navigation className="w-16 h-16 text-slate-100 mx-auto" />
               <h3 className="text-xl font-black text-slate-800">Visit Route Planning</h3>
               <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">Enable GPS tracking to see households sorted by distance from your current position.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
              <button 
                onClick={onViewMap}
                className="group flex flex-col p-8 bg-slate-900 text-white rounded-[3.5rem] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 active:scale-[0.98] text-left relative overflow-hidden"
              >
                <MapIcon className="absolute right-[-10px] bottom-[-10px] w-40 h-40 opacity-10" />
                <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-10 shadow-lg">
                  <MapIcon className="w-10 h-10" />
                </div>
                <span className="text-3xl font-black tracking-tight leading-tight">Village <br />Geography</span>
              </button>
              
              <button 
                onClick={exportAllToExcel}
                className="group flex flex-col p-8 bg-emerald-600 text-white rounded-[3.5rem] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 active:scale-[0.98] text-left relative overflow-hidden"
              >
                <FileSpreadsheet className="absolute right-[-10px] bottom-[-10px] w-40 h-40 opacity-10" />
                <div className="bg-white/20 w-16 h-16 rounded-3xl flex items-center justify-center mb-10 shadow-lg">
                  <FileSpreadsheet className="w-10 h-10" />
                </div>
                <span className="text-3xl font-black tracking-tight leading-tight">Master <br />Health Ledger</span>
              </button>
            </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-10">
               <h3 className="font-black text-slate-800 text-xl tracking-tight">Daily Alerts</h3>
               <div className="bg-rose-50 p-2 rounded-xl"><Bell className="w-6 h-6 text-rose-500" /></div>
            </div>
            <div className="space-y-6">
              {upcomingReminders.map(r => (
                <div key={r.id} className="flex gap-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                  <div className={`w-1.5 rounded-full bg-blue-500`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate leading-tight mb-2">{r.title}</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Target: {r.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingReminders.length === 0 && (
                <div className="text-center py-12 opacity-30">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No Alerts Pending</p>
                </div>
              )}
            </div>
            <button 
              onClick={onViewList}
              className="w-full mt-10 py-5 border-2 border-dashed border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-400 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95"
            >
              Full Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
