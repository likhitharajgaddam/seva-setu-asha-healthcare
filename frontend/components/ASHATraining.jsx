import React, { useState, useMemo } from "react";
import {
  GraduationCap,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Baby,
  HeartPulse,
  Utensils,
  Droplets,
  ShieldAlert,
  ArrowLeft,
  Search,
  Apple,
  Info,
  Activity,
  ShieldCheck
} from "lucide-react";

const diseaseDatabase = [
  {
    id: "anemia",
    title: "Anemia (Low Blood)",
    desc: "Condition where blood lacks enough healthy red blood cells, causing fatigue and pregnancy risks.",
    overcome: [
      "Daily intake of Iron Folic Acid (IFA) tablets.",
      "Regular bi-annual deworming with Albendazole.",
      "Ensuring 4 ANC checkups to monitor hemoglobin levels."
    ],
    foods: [
      "Green leafy vegetables (Palak, Methi).",
      "Jaggery (Gur) and black Chana.",
      "Meat, eggs, and liver (if acceptable).",
      "Vitamin C rich fruits (Amla, Lemon) for absorption."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    icon: HeartPulse,
    color: "text-rose-600",
    bg: "bg-rose-50",
    category: "Nutrition"
  },
  {
    id: "diarrhea",
    title: "Diarrhea",
    desc: "Loose, watery stools that can lead to rapid dehydration and death in children.",
    overcome: [
      "Immediate start of ORS (Oral Rehydration Salts).",
      "Zinc supplementation for 14 days.",
      "Continue breastfeeding and normal feeding."
    ],
    foods: [
      "Rice water or salted Lassi.",
      "Mashed bananas (Potassium source).",
      "Soft khichdi with minimal oil.",
      "Boiled and cooled water only."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1585238341267-1cfec2046a55?q=80&w=800&auto=format&fit=crop",
    icon: Droplets,
    color: "text-blue-600",
    bg: "bg-blue-50",
    category: "Sanitation"
  },
  {
    id: "malaria",
    title: "Malaria",
    desc: "Mosquito-borne fever causing shivering, headache, and severe weakness.",
    overcome: [
      "Complete the full course of ACT (Artesunate) treatment.",
      "Mandatory use of LLIN (Insecticide treated nets).",
      "Clear stagnant water around the household."
    ],
    foods: [
      "Frequent small meals to maintain energy.",
      "Plenty of fluids (Coconut water, Juices).",
      "High protein diet (Dal, milk) once fever subsides."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1533224400192-d3522199f730?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    icon: ShieldAlert,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    category: "Communicable"
  },
  {
    id: "tb",
    title: "Tuberculosis (TB)",
    desc: "Infectious disease primarily affecting lungs, marked by persistent cough for >2 weeks.",
    overcome: [
      "Strict adherence to DOTS (Directly Observed Treatment).",
      "Never skip a dose even if feeling better.",
      "Isolation and mask-wearing in the early treatment phase."
    ],
    foods: [
      "High calorie and high protein diet.",
      "Milk, paneer, and sprouted pulses.",
      "Groundnuts and Til (Sesame) for healthy fats."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop",
    icon: Info,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    category: "Communicable"
  },
  {
    id: "pneumonia",
    title: "Pneumonia (Childhood)",
    desc: "Infection that inflames air sacs in lungs; look for fast breathing and chest in-drawing.",
    overcome: [
      "Immediate referral if danger signs like grunting are present.",
      "Antibiotic course as prescribed.",
      "Keep the child warm and ensure hydration."
    ],
    foods: [
      "Warm soups and liquids.",
      "Continued breastfeeding.",
      "Soft, home-cooked food."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800&auto=format&fit=crop",
    icon: Baby,
    color: "text-orange-600",
    bg: "bg-orange-50",
    category: "Infant Health"
  },
  {
    id: "diabetes",
    title: "Diabetes",
    desc: "Chronic condition where blood sugar levels are too high.",
    overcome: [
      "Regular screening.",
      "Do not skip medication.",
      "Daily physical activity."
    ],
    foods: [
      "Whole grains like Bajra / Jowar.",
      "Green leafy vegetables.",
      "Avoid sugary drinks & sweets.",
      "Small, frequent meals."
    ],
    overcomeImage:
      "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=800&auto=format&fit=crop",
    foodImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
    category: "Non-Communicable"
  }
];

const ASHATraining = () => {
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiseases = useMemo(() => {
    return diseaseDatabase.filter(
      (d) =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // ---- DETAILS PAGE ----
  if (selectedDisease) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
        <button
          onClick={() => setSelectedDisease(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-black text-xs uppercase tracking-widest"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Modules
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Overview */}
          <div className="space-y-8">
            <div
              className={`p-10 rounded-[3rem] ${selectedDisease.bg} border border-slate-100 shadow-sm`}
            >
              <div className="flex items-center gap-6 mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center ${selectedDisease.color} shadow-lg`}
                >
                  <selectedDisease.icon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {selectedDisease.title}
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {selectedDisease.category}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 font-medium leading-relaxed text-lg">
                {selectedDisease.desc}
              </p>
            </div>

            {/* Prevention */}
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-500" /> Prevention
                & Care
              </h3>

              <div className="aspect-video rounded-[2rem] overflow-hidden mb-6">
                <img
                  src={selectedDisease.overcomeImage}
                  alt="Clinical Care"
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-4">
                {selectedDisease.overcome.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-slate-600 font-medium leading-relaxed"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nutrition */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                <Apple className="w-6 h-6 text-rose-500" /> Nutritional Guidance
              </h3>

              <div className="aspect-video rounded-[2rem] overflow-hidden mb-6">
                <img
                  src={selectedDisease.foodImage}
                  alt="Recommended Foods"
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-4">
                {selectedDisease.foods.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-slate-600 font-medium leading-relaxed"
                  >
                    <Utensils className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN LIST PAGE ----
  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            Skill Enhancement
          </h2>
          <p className="text-slate-500 font-medium">
            Standardized field protocols and medical education.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none font-bold text-xs uppercase tracking-widest"
          />
        </div>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiseases.map((disease) => (
          <button
            key={disease.id}
            onClick={() => setSelectedDisease(disease)}
            className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 text-left group hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all overflow-hidden relative"
          >
            <div
              className={`${disease.bg} ${disease.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}
            >
              <disease.icon className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">
              {disease.title}
            </h3>

            <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed mb-6">
              {disease.desc}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {disease.category}
              </span>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ASHATraining;
