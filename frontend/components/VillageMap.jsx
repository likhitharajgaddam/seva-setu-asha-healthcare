import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Navigation, Compass, Search, Hospital, Building2, 
  ExternalLink, Loader2, ChevronRight, Info, Layers, CloudOff,
  Phone, LayoutGrid, Map as MapIcon
} from 'lucide-react';
import { backend } from '../backend';

const VillageMap = ({ patients, workerLocation, onSelectPatient, isOnline }) => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapMode, setMapMode] = useState('visual');
  const [satellite, setSatellite] = useState(false);

  const localizedPatients = (patients || []).filter(p => p.location);

  useEffect(() => {
    const fetchSupport = async () => {
      if (isOnline && workerLocation) {
        setLoading(true);
        try {
          const result = await backend.findNearbyHospitals(workerLocation);
          setFacilities(result.facilities || []);
        } catch (e) {
          console.error("Support fetch failed", e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSupport();
  }, [isOnline, workerLocation]);

  const mapUrl = useMemo(() => {
    if (!workerLocation) return '';
    const mode = satellite ? 'k' : 'm';
    return `https://maps.google.com/maps?q=${workerLocation.latitude},${workerLocation.longitude}&z=16&t=${mode}&output=embed`;
  }, [workerLocation, satellite]);

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none mb-3">
            Village Geography
          </h2>
          <p className="text-slate-500 font-medium">
            Real-time distribution of households and clinical support networks.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setMapMode(mapMode === 'visual' ? 'cards' : 'visual')}
            className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
          >
            {mapMode === 'visual' ? <LayoutGrid className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            {mapMode === 'visual' ? 'Show Facility Cards' : 'Show Interactive Map'}
          </button>

          {mapMode === 'visual' && (
            <button 
              onClick={() => setSatellite(!satellite)}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              {satellite ? 'Street View' : 'Satellite View'}
            </button>
          )}
        </div>
      </header>

      {mapMode === 'visual' ? (
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[4rem] border-8 border-white shadow-2xl h-[700px] relative overflow-hidden group">

              {/* FIXED CONDITION — NO MORE FORCE OFFLINE */}
              {workerLocation ? (
                <iframe
                  title="Village Map"
                  width="100%"
                  height="100%"
                  src={mapUrl}
                  className="border-0"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white p-12 text-center">
                  <CloudOff className="w-16 h-16 text-slate-700 mb-6" />
                  <h3 className="text-2xl font-black">Maps Unavailable</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">
                    Enable GPS or grant location access to continue.
                  </p>
                </div>
              )}

              {/* Patient Overlay Pins */}
              <div className="absolute inset-0 pointer-events-none">
                {localizedPatients.map(p => {
                  if (!p.location || !workerLocation) return null;

                  const latDiff = p.location.latitude - workerLocation.latitude;
                  const lngDiff = p.location.longitude - workerLocation.longitude;

                  const scale = 20000;
                  const style = {
                    top: `${50 - (latDiff * scale)}%`,
                    left: `${50 + (lngDiff * scale)}%`
                  };

                  if (parseFloat(style.top) < 0 || parseFloat(style.top) > 100) return null;

                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectPatient(p)}
                      className="absolute transition-all hover:scale-125 hover:z-30 group/pin pointer-events-auto"
                      style={style}
                    >
                      <div className="relative -translate-x-1/2 -translate-y-full">
                        <MapPin 
                          className={`w-10 h-10 ${
                            p.riskLevel === 'High' ? 'text-rose-600' : 'text-emerald-600'
                          } drop-shadow-2xl`} 
                          fill="currentColor"
                          fillOpacity={0.4}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-blue-400" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/50">
                  Field Directive
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Refer critical cases to the nearest verified PHC immediately.
              </p>
            </div>

            {loading ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Polling Registry...
                </p>
              </div>
            ) : facilities.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600">
                    <Hospital className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-black text-slate-800 text-sm truncate leading-tight">
                      {f.title}
                    </h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                      Health Facility
                    </p>
                  </div>
                </div>

                <a 
                  href={f.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-800"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Navigate
                </a>
              </div>
            ))}
          </aside>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.length > 0 ? facilities.map((fac, i) => (
            <div
              key={i}
              className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-10 flex flex-col hover:shadow-2xl hover:border-blue-100 transition-all group animate-in slide-in-from-bottom-4"
            >
              <div className="flex items-center gap-6 mb-10">
                <div className="bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                  <Hospital className="w-10 h-10" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-slate-800 text-xl leading-tight mb-1">
                    {fac.title}
                  </h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Healthcare Provider
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <a 
                  href={fac.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[4] flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Maps
                </a>

                <button className="flex-1 flex items-center justify-center py-5 bg-blue-50 text-blue-600 rounded-[2rem] border border-blue-100 hover:bg-blue-100 transition-all active:scale-95 shadow-sm">
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100">
              <Building2 className="w-24 h-24 text-slate-100 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                No Local Data Found
              </h3>
              <p className="text-slate-400 font-medium">
                Please connect to the internet once to cache nearby health facilities.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VillageMap;
