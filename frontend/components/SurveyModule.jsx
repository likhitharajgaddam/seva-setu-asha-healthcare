import React, { useState } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Users, 
  ArrowLeft, 
  BarChart, 
  Loader2, 
  CheckCircle2, 
  Trash2,
  Sparkles,
  ChevronRight,
  ClipboardCheck,
  Settings,
  PlusCircle,
  XCircle,
  Layout
} from 'lucide-react';
import { getSurveyAnalytics } from '../services/geminiService';

const DEFAULT_TEMPLATES = [
  {
    id: 'maternal_needs',
    title: 'Maternal Health Needs',
    description: 'Assess household readiness for upcoming deliveries and ANC checkups.',
    category: 'Maternal',
    questions: [
      { id: 'household_id', text: 'Household ID', type: 'text', required: true },
      { id: 'members', text: 'Total Family Members', type: 'number', required: true },
      { id: 'is_enrolled', text: 'Enrolled in JSY?', type: 'boolean', required: true },
      { id: 'nearest_phc', text: 'Distance to nearest PHC (km)', type: 'number', required: true },
      { id: 'complications', text: 'Previous Complications?', type: 'text', required: false }
    ]
  },
  {
    id: 'sanitation_audit',
    title: 'WASH & Sanitation Audit',
    description: 'Monitor clean water access and latrine usage in the community.',
    category: 'Environment',
    questions: [
      { id: 'toilet_usage', text: 'Functional Toilet Available?', type: 'boolean', required: true },
      { id: 'water_source', text: 'Primary Water Source', type: 'select', options: ['Piped', 'Handpump', 'Well', 'River'], required: true },
      { id: 'handwashing', text: 'Handwashing Station Available?', type: 'boolean', required: true }
    ]
  }
];

const SurveyModule = ({ 
  responses = [], 
  customTemplates = [],
  isOnline, 
  onSaveSurvey, 
  onDeleteSurvey, 
  onSaveTemplate,
  onDeleteTemplate,
  workerLocation 
}) => {


  const [view, setView] = useState('list');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentResponse, setCurrentResponse] = useState({});
  const [householdName, setHouseholdName] = useState('');
  const [village, setVillage] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [newTempTitle, setNewTempTitle] = useState('');
  const [newTempDesc, setNewTempDesc] = useState('');
  const [newTempCat, setNewTempCat] = useState('General');
  const [newQuestions, setNewQuestions] = useState([
    { id: crypto.randomUUID(), text: '', type: 'text', required: true }
  ]);

  const safeCustomTemplates = Array.isArray(customTemplates) ? customTemplates : [];
  const allTemplates = [...DEFAULT_TEMPLATES, ...(customTemplates || [])];



  const startSurvey = (template) => {
    setSelectedTemplate(template);
    setCurrentResponse({});
    setHouseholdName('');
    setVillage('');
    setView('fill');
  };

  const handleSaveResponse = () => {
  console.log("SAVE SURVEY CLICKED");

  if (!selectedTemplate || !householdName || !village) return;

  const response = {
    id: crypto.randomUUID(),
    templateId: selectedTemplate.id,
    templateTitle: selectedTemplate.title,
    householdName,
    village,
    answers: currentResponse,
    date: new Date().toISOString().split('T')[0],
    isSynced: false,
    location: workerLocation || undefined
  };

  console.log("SURVEY DATA", response);

  onSaveSurvey(response);   // <-- this MUST exist
  setView('list');
};


  const handleCreateTemplate = () => {
    if (!newTempTitle.trim() || newQuestions.length === 0) return;
    
    const template = {
      id: crypto.randomUUID(),
      title: newTempTitle.trim(),
      description: newTempDesc.trim() || 'Custom community health survey.',
      category: newTempCat,
      questions: newQuestions.filter(q => q.text.trim())
    };

    onSaveTemplate(template);

    setNewTempTitle('');
    setNewTempDesc('');
    setNewTempCat('General');
    setNewQuestions([{ id: crypto.randomUUID(), text: '', type: 'text', required: true }]);
  };

  const addQuestion = () => {
    setNewQuestions([...newQuestions, { id: crypto.randomUUID(), text: '', type: 'text', required: true }]);
  };

  const removeQuestion = (id) => {
    if (newQuestions.length <= 1) return;
    setNewQuestions(newQuestions.filter(q => q.id !== id));
  };

  const updateQuestion = (id, updates) => {
    setNewQuestions(newQuestions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const fetchAnalytics = async () => {
    if (!isOnline || responses?.length === 0) return;
    setLoadingAnalytics(true);
    try {
      const data = await getSurveyAnalytics(responses);
      setAnalytics(data);
      setView('analytics');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };


  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <ClipboardCheck className="w-10 h-10 text-emerald-600" />
            Health Surveys
          </h2>
          <p className="text-slate-500 font-medium">Conduct assessments or build custom field forms.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {view === 'list' && responses.length > 0 && (
            <button 
              onClick={fetchAnalytics}
              disabled={!isOnline}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                isOnline ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 grayscale'
              }`}
            >
              {loadingAnalytics ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Trends
            </button>
          )}
          {view === 'list' && (
            <button 
              onClick={() => setView('create')}
              className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              Start New
            </button>
          )}
          {view === 'create' && (
            <button 
              onClick={() => setView('manage_templates')}
              className="flex items-center gap-3 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <Settings className="w-4 h-4" />
              Form Builder
            </button>
          )}
          {view !== 'list' && (
            <button 
              onClick={() => { setView('list'); setSelectedTemplate(null); setAnalytics(null); }}
              className="flex items-center gap-3 bg-white border border-slate-200 text-slate-500 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </header>

      {view === 'list' && (
        <div className="space-y-8">
          {responses.length > 0 ? (
            <div className="grid gap-4">
              {responses.slice().reverse().map(resp => (
                <div key={resp.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner group-hover:scale-110 transition-transform">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-tight text-lg leading-none mb-2">{resp.householdName}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{resp.templateTitle} • {resp.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Village</span>
                      <span className="text-xs font-bold text-slate-600">{resp.village}</span>
                    </div>
                    <button 
                      onClick={() => onDeleteSurvey(resp.id)}
                      className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
               <ClipboardList className="w-20 h-20 text-slate-100 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-slate-800 mb-2">No Surveys Conducted</h3>
               <p className="text-slate-400 font-medium mb-8">Conduct household health assessments or create a custom form.</p>
               <button onClick={() => setView('create')} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-100">
                 Choose a Template
               </button>
            </div>
          )}
        </div>
      )}

      {view === 'create' && (
        <div className="space-y-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTemplates.map(temp => (
              <div 
                key={temp.id}
                className="bg-white rounded-[3rem] shadow-sm border border-slate-100 text-left group hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all overflow-hidden relative"
              >
                <button 
                  onClick={() => startSurvey(temp)}
                  className="w-full h-full p-8 text-left"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform ${temp.id.includes('maternal') ? 'bg-rose-50 text-rose-600' : temp.id.includes('sanitation') ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {temp.id.includes('maternal') ? <Users className="w-7 h-7" /> : <Layout className="w-7 h-7" />}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight mb-3">{temp.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{temp.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{temp.category}</span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                </button>
                {/* Delete button for custom templates */}
                {customTemplates.some(ct => ct.id === temp.id) && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteTemplate(temp.id, temp.title); }}
                    className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            <button 
              onClick={() => setView('manage_templates')}
              className="bg-slate-50 rounded-[3rem] shadow-sm border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center gap-4 group hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400 hover:text-indigo-600"
            >
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                <PlusCircle className="w-8 h-8" />
              </div>
              <span className="font-black text-sm uppercase tracking-widest">Create New Form</span>
            </button>
          </div>
        </div>
      )}

      {view === 'manage_templates' && (
        <div className="max-w-3xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
          <div className="bg-indigo-600 p-10 text-white">
            <h3 className="text-3xl font-black tracking-tight mb-2">Form Builder</h3>
            <p className="text-indigo-100 font-medium">Define custom columns and questions for your field surveys.</p>
          </div>

          <div className="p-10 space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Survey Title</label>
                <input 
                  type="text" 
                  value={newTempTitle}
                  onChange={e => setNewTempTitle(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-lg"
                  placeholder="e.g. Household Water Access"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    value={newTempCat}
                    onChange={e => setNewTempCat(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-bold appearance-none"
                  >
                    <option value="General">General</option>
                    <option value="Maternal">Maternal</option>
                    <option value="Nutrition">Nutrition</option>
                    <option value="Environment">Environment</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <input 
                    type="text" 
                    value={newTempDesc}
                    onChange={e => setNewTempDesc(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none font-medium"
                    placeholder="Short summary of survey goal..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest">Define Questions (Columns)</h4>
                <button 
                  onClick={addQuestion}
                  className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Add Field
                </button>
              </div>

              <div className="space-y-4">
                {newQuestions.map((q, idx) => (
                  <div key={q.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center group">
                    <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">
                      {idx + 1}
                    </div>
                    
                    <div className="flex-1 w-full space-y-1">
                      <input 
                        type="text" 
                        value={q.text}
                        onChange={e => updateQuestion(q.id, { text: e.target.value })}
                        className="w-full bg-transparent border-none outline-none font-bold text-slate-800 placeholder:text-slate-300"
                        placeholder="Enter Question or Data Point Name..."
                      />
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <select 
  value={q.type}
  onChange={e => updateQuestion(q.id, { type: e.target.value })}
  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
>
  <option value="text">Text</option>
  <option value="number">Number</option>
  <option value="boolean">Yes/No</option>
</select>

                      
                      <button 
                        onClick={() => removeQuestion(q.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleCreateTemplate}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6" />
                Save Custom Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'fill' && selectedTemplate && (
        <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
          <div className="bg-emerald-600 p-10 text-white">
            <h3 className="text-3xl font-black tracking-tight mb-2">{selectedTemplate.title}</h3>
            <p className="text-emerald-100 font-medium">{selectedTemplate.description}</p>
          </div>

          <div className="p-10 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6 pb-8 border-b border-slate-50">
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Household Name</label>
                 <input 
                  type="text" 
                  value={householdName} 
                  onChange={e => setHouseholdName(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold"
                  placeholder="e.g. Meena's Family"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Village</label>
                 <input 
                  type="text" 
                  value={village} 
                  onChange={e => setVillage(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold"
                  placeholder="Village name"
                 />
               </div>
            </div>

            {selectedTemplate.questions.map(q => (
              <div key={q.id} className="space-y-3">
                <label className="text-sm font-black text-slate-700 flex items-center justify-between">
                  {q.text} {q.required && <span className="text-rose-500">*</span>}
                </label>
                
                {q.type === 'text' && (
                  <input 
                    type="text" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-medium"
                    value={currentResponse[q.id] || ''}
                    onChange={e => setCurrentResponse({...currentResponse, [q.id]: e.target.value})}
                  />
                )}

                {q.type === 'number' && (
                  <input 
                    type="number" 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-black text-lg"
                    value={currentResponse[q.id] || ''}
                    onChange={e => setCurrentResponse({...currentResponse, [q.id]: e.target.value})}
                  />
                )}

                {q.type === 'boolean' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setCurrentResponse({...currentResponse, [q.id]: true})}
                      className={`flex-1 p-4 rounded-2xl font-black text-sm uppercase transition-all border ${currentResponse[q.id] === true ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => setCurrentResponse({...currentResponse, [q.id]: false})}
                      className={`flex-1 p-4 rounded-2xl font-black text-sm uppercase transition-all border ${currentResponse[q.id] === false ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                    >
                      No
                    </button>
                  </div>
                )}

                {q.type === 'select' && q.options && (
                  <select 
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none font-bold appearance-none"
                    value={currentResponse[q.id] || ''}
                    onChange={e => setCurrentResponse({...currentResponse, [q.id]: e.target.value})}
                  >
                    <option value="">Select Option</option>
                    {q.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                )}
              </div>
            ))}

            <div className="pt-8">
              <button 
                onClick={handleSaveResponse}
                className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <CheckCircle2 className="w-6 h-6" />
                Complete Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'analytics' && analytics && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-8">
           <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
             <BarChart className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white opacity-5" />
             <div className="relative z-10">
               <div className="flex items-center gap-4 mb-8">
                 <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
                   <Sparkles className="w-8 h-8 text-white" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-black tracking-tight">AI Health Trends</h3>
                   <p className="text-slate-400 font-medium">Community analysis based on survey data</p>
                 </div>
               </div>

               <p className="text-xl font-medium leading-relaxed mb-12 text-slate-200 italic">
                 "{analytics.summary}"
               </p>

               <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Observed Trends</h4>
                   <ul className="space-y-3">
                     {analytics.trends.map((t, i) => (
  <li key={i} className="flex gap-4 text-sm font-medium text-slate-300">
    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shrink-0 mt-1.5" />
    {t}
  </li>
))}

                   </ul>
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">Priority Actions</h4>
                   <ul className="space-y-3">
                     {analytics.priorities.map((p, i) => (
  <li key={i} className="flex gap-4 text-sm font-medium text-slate-300">
    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
    {p}
  </li>
))}

                   </ul>
                 </div>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SurveyModule;
