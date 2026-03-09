import React, { useMemo } from "react";

const Schedule = ({ patients }) => {

  const reminders = useMemo(() => {
    const list = [];

    (patients || []).forEach(p => {
      const visits = p.visits || [];

      // NO VISIT YET → First checkup message
      if (visits.length === 0) {
        list.push({
          type: "First Checkup Required",
          detail: "No field visit recorded yet",
          patient: p.name,
          village: p.village || "Unknown",
          date: "ASAP"
        });
        return;
      }

      // LAST VISIT CHECK
      const last = new Date(visits[0].date);
      const today = new Date();

      const diff = Math.floor(
        (today - last) / (1000 * 60 * 60 * 24)
      );

      if (diff >= 30) {
        list.push({
          type: "Follow-up Visit Due",
          detail: `Last visit ${diff} days ago`,
          patient: p.name,
          village: p.village || "Unknown",
          date: "Due Now"
        });
      }

    });

    return list;
  }, [patients]);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black">ASHA Visit Schedule</h2>

      {(!reminders || reminders.length === 0) ? (
        <p className="text-slate-400 mt-10">
          No scheduled visits yet.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {reminders.map((r, i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-3xl border shadow-sm flex justify-between"
            >
              <div>
                <h3 className="font-black text-lg">{r.type}</h3>
                <p className="text-slate-500">{r.detail}</p>
                <p className="text-sm mt-2">
                  👩‍⚕️ {r.patient} • 🏡 {r.village}
                </p>
              </div>

              <span className="text-blue-600 font-black">
                {r.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedule;
