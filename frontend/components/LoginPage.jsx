import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  UserCircle,
  HelpCircle,
} from "lucide-react";

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState("login"); // login | register | recover
  const [workerId, setWorkerId] = useState("");
  const [fullName, setFullName] = useState("");
  const [pin, setPin] = useState("");
  const [recoveryWord, setRecoveryWord] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
    setFullName("");
    setPin("");
    setRecoveryWord("");
  }, [mode]);

  const getStoredAccounts = () => {
    const stored = localStorage.getItem("sevasetu_accounts");

    if (!stored) {
      const defaultAcc = {
        ASHAID: { pin: "1234", name: "ASHA", recoveryWord: "SEVA" },
      };
      localStorage.setItem("sevasetu_accounts", JSON.stringify(defaultAcc));
      return defaultAcc;
    }

    const parsed = JSON.parse(stored);
    const migrated = {};

    Object.keys(parsed).forEach((key) => {
      const data = parsed[key];

      if (typeof data === "string") {
        migrated[key] = {
          pin: data,
          name: "Worker",
          recoveryWord: "RECOVER",
        };
      } else {
        migrated[key] = {
          pin: data.pin,
          name: data.name || "Worker",
          recoveryWord: data.recoveryWord || "RECOVER",
        };
      }
    });

    return migrated;
  };

  const handleLogin = () => {
    const accounts = getStoredAccounts();
    const account = accounts[workerId];

    if (account && account.pin === pin) {
      onLogin(workerId, account.name);
    } else {
      setError("Invalid Worker ID or PIN. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits.");
      setIsLoading(false);
      return;
    }

    if (!recoveryWord.trim() || recoveryWord.length < 3) {
      setError("Please provide a recovery word.");
      setIsLoading(false);
      return;
    }

    const accounts = getStoredAccounts();

    if (accounts[workerId]) {
      setError("This Worker ID is already registered.");
      setIsLoading(false);
      return;
    }

    accounts[workerId] = {
      pin,
      name: fullName.trim(),
      recoveryWord: recoveryWord.trim().toUpperCase(),
    };

    localStorage.setItem("sevasetu_accounts", JSON.stringify(accounts));

    onLogin(workerId, fullName.trim());
  };

  const handleRecover = () => {
    const accounts = getStoredAccounts();
    const account = accounts[workerId];

    if (!account) {
      setError("Worker ID not found.");
      setIsLoading(false);
      return;
    }

    const isWordCorrect =
      account.recoveryWord === recoveryWord.trim().toUpperCase();

    if (!isWordCorrect) {
      setError("Security recovery word does not match our records.");
      setIsLoading(false);
      return;
    }

    if (pin.length !== 4) {
      setError("Please set a new 4-digit PIN.");
      setIsLoading(false);
      return;
    }

    accounts[workerId] = { ...account, pin };
    localStorage.setItem("sevasetu_accounts", JSON.stringify(accounts));

    setError("PIN successfully reset. Please login.");
    setMode("login");
    setIsLoading(false);
    setPin("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (mode === "register") handleRegister();
      else if (mode === "recover") handleRecover();
      else handleLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl" />

      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center justify-center p-4 rounded-[2rem] shadow-xl transition-all duration-500 ${
              mode === "recover"
                ? "bg-indigo-600 shadow-indigo-200"
                : mode === "register"
                ? "bg-emerald-600 shadow-emerald-200"
                : "bg-blue-600 shadow-blue-200"
            }`}
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            SevaSetu
          </h1>

          <p className="text-slate-500 font-medium">
            {mode === "register"
              ? "Worker Registration"
              : mode === "recover"
              ? "Reset Secure PIN"
              : "Field Worker Portal"}{" "}
            • Offline-Ready
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === "register" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>

                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 transition-all font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Worker ID
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  required
                  type="text"
                  value={workerId}
                  onChange={(e) => setWorkerId(e.target.value.toUpperCase())}
                  placeholder="e.g. ASHA ID"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {(mode === "register" || mode === "recover") && (
              <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-top-2">
                <div className="h-px bg-slate-100 w-full" />

                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] text-center">
                  Security Essentials
                </p>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Secret Recovery Word
                  </label>

                  <div className="relative">
                    <HelpCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                    <input
                      required
                      type="text"
                      value={recoveryWord}
                      onChange={(e) => setRecoveryWord(e.target.value)}
                      placeholder="e.g. MOTHER NAME"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                {mode === "login" ? "Secure PIN" : "Set New 4-Digit PIN"}
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

                <input
                  required
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) =>
                    setPin(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="4-digit PIN"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-500 transition-all font-medium tracking-widest"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-white ${
                mode === "recover"
                  ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                  : mode === "register"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "recover"
                    ? "Reset PIN"
                    : mode === "register"
                    ? "Create Profile"
                    : "Secure Login"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {mode === "login" && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setMode("recover")}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                Forgot your PIN?
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mx-auto transition-colors"
            >
              {mode === "login" ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  New Field Worker? Register
                </>
              ) : (
                <>Back to Login</>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] bg-emerald-50 w-fit mx-auto px-4 py-2 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              Dual-Layer Local Encryption
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Technical Support: 1800-ASHA-HELP
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
