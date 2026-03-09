import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  Cloud, 
  CloudOff, 
  Filter, 
  Trash2,
  LayoutGrid,
  ChevronDown,
  Download
} from 'lucide-react';

// If your categories are fixed, define here
const HEALTH_CATEGORIES = [
  'General',
  'Maternal Health',
  'Child Health',
  'Chronic Illness',
  'Senior Citizen'
];

const PatientList = ({ patients, onSelect, onDelete }) => {

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return (patients || []).filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm);
      
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesRisk = riskFilter === 'All' || p.riskLevel === riskFilter;

      let matchesDate = true;
      if (dateFilter !== 'All') {
        const lastVisit = new Date(p.lastVisitDate);
        const now = new Date();
        const diffDays = Math.ceil(Math.abs(now - lastVisit) / (1000 * 60 * 60 * 24));

        if (dateFilter === 'Recent') matchesDate = diffDays <= 7;
        else if (dateFilter === 'Needs Attention') matchesDate = diffDays > 30 && diffDays <= 60;
        else if (dateFilter === 'Overdue') matchesDate = diffDays > 60;
      }

      return matchesSearch && matchesCategory && matchesRisk && matchesDate;
    });
  }, [patients, searchTerm, categoryFilter, riskFilter, dateFilter]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const generateCSV = (data, filename) => {
    if (!data || data.length === 0)
      return alert("No data available to export.");

    const headers = [
      'Patient ID','Name','Age','Gender','Category',
      'Village','Phone','Risk Level',
      'Last Visit Date','Total Checkups'
    ];
    
    const rows = data.map(p => [
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
    const csvContent = BOM + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `${filename}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setIsExportOpen(false);
  };

  const clearFilters = () => {
    setCategoryFilter('All');
    setRiskFilter('All');
    setDateFilter('All');
    setSearchTerm('');
  };

  const isAnyFilterActive =
    categoryFilter !== 'All' ||
    riskFilter !== 'All' ||
    dateFilter !== 'All' ||
    searchTerm !== '';

  return (
    <div className="space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Community Directory</h2>
          <p className="text-slate-500 font-medium">Managing {patients.length} total patient health records.</p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          {isAnyFilterActive && (
            <button 
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 transition-all font-bold text-xs uppercase tracking-widest"
            >
              Reset
            </button>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-2xl hover:bg-emerald-700 transition-all font-black text-xs uppercase tracking-[0.1em] shadow-xl shadow-emerald-100 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Export Options
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExportOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExportOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsExportOpen(false)} 
                />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={() => generateCSV(filteredPatients, `Filtered_Patients_${new Date().toISOString().split('T')[0]}`)}
                    className="w-full text-left px-5 py-4 hover:bg-emerald-50 rounded-2xl transition-all flex items-center gap-3 group"
                  >
                    <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Filter className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Filtered View</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{filteredPatients.length} records</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => generateCSV(patients, `Master_Ledger_${new Date().toISOString().split('T')[0]}`)}
                    className="w-full text-left px-5 py-4 hover:bg-blue-50 rounded-2xl transition-all flex items-center gap-3 group"
                  >
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">Master Ledger</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">All {patients.length} patients</p>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-4 bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, village, or phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-slate-100 bg-slate-50/50 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white focus:border-blue-500 outline-none text-sm transition-all font-bold text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative group">
            <select
  value={categoryFilter}
  onChange={e => setCategoryFilter(e.target.value)}
  className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 outline-none text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-slate-100 transition-all"
>
  <option value="All">All Categories</option>
  {HEALTH_CATEGORIES.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>

            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 outline-none text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-slate-100 transition-all"
            >
              <option value="All">All Risks</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="w-full pl-5 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 outline-none text-xs font-black uppercase tracking-widest appearance-none cursor-pointer focus:ring-4 focus:ring-slate-100 transition-all"
            >
              <option value="All">All Visits</option>
              <option value="Recent">Recent (7 Days)</option>
              <option value="Needs Attention">Due (30+ Days)</option>
              <option value="Overdue">Overdue (60+ Days)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none group-hover:text-slate-500 transition-colors" />
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <div 
              key={patient.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100 transition-all cursor-pointer group animate-in fade-in flex items-center gap-4"
            >
              <div 
                onClick={() => onSelect(patient)}
                className="flex-1 flex gap-6 items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-black text-blue-600 text-2xl shadow-inner group-hover:scale-110 transition-transform">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-black text-slate-900 text-xl truncate tracking-tight">
                      {patient.name}
                    </h3>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full border font-black uppercase tracking-[0.15em] ${getRiskColor(patient.riskLevel)}`}>
                      {patient.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold mb-4">{patient.category} • {patient.age} years</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {patient.village}
                    </div>
                    <span className={`text-[10px] px-3 py-1.5 rounded-full border font-black uppercase tracking-widest flex items-center gap-1.5 ${patient.isSynced ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {patient.isSynced ? <Cloud className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
                      {patient.isSynced ? 'Synced' : 'Local'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(patient.id);
                  }}
                  className="p-4 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                  title="Delete Record"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <div 
                  onClick={() => onSelect(patient)}
                  className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <LayoutGrid className="w-20 h-20 text-slate-100 mx-auto mb-6" />
            <p className="text-slate-500 font-black text-xl mb-2 tracking-tight">No matching records found</p>
            <p className="text-slate-400 mb-8 font-medium">Adjust your search or filters to explore the directory.</p>
            <button onClick={clearFilters} className="text-blue-600 font-black hover:underline uppercase tracking-widest text-xs">Reset All Search Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
