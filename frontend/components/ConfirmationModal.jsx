import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />

      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div
              className={`p-3 rounded-2xl ${
                variant === "danger"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              <AlertTriangle className="w-8 h-8" />
            </div>

            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
            {title}
          </h3>

          <p className="text-slate-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 bg-slate-50 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
              variant === "danger"
                ? "bg-rose-600 text-white shadow-rose-100 hover:bg-rose-700"
                : "bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600"
            }`}
          >
            {confirmLabel}
          </button>

          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
