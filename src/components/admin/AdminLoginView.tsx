import React, { useState } from 'react';
import { loginAdmin } from '../../api';
import { AdminUser } from '../../types';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles,
  User
} from 'lucide-react';

interface AdminLoginViewProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToSite: () => void;
  onNavigateCustomerLogin?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({
  onLoginSuccess,
  onBackToSite,
  onNavigateCustomerLogin,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      onLoginSuccess(result.user);
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@aazamtravels.com');
    setPassword('AazamTravels@2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#07192F] via-[#0B2545] to-[#133E68] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold backdrop-blur-md border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Website</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protected Staff Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
          
          {/* Ambient accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500" />

          {/* Logo & Headline */}
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex items-center justify-center mb-3">
              <img
                src="/logo.svg"
                alt="Aazam Travel Agency Official Logo"
                className="h-16 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2545] tracking-tight">
              Aazam Travel Agency
            </h1>
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mt-0.5">
              Secure Operations &amp; Admin Panel
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage train bookings, customer enquiries, tour packages, and website settings.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@aazamtravels.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Master Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm text-slate-800 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Enter Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Box & Not Admin switch */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            {onNavigateCustomerLogin && (
              <button
                type="button"
                onClick={onNavigateCustomerLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B2545] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-orange-500" />
                <span>Not Admin? Switch to Customer / User Portal</span>
              </button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">
                Agency Staff Quick Test
              </span>
              <button
                type="button"
                onClick={handleUseDemo}
                className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700 text-xs py-1 px-2 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Auto-fill Demo Credentials</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center mt-6 text-slate-400 text-xs">
          <p>© {new Date().getFullYear()} Aazam Travel Agency · Pan-India Operations Desk</p>
          <p className="text-[11px] text-slate-400/80 mt-1">
            Access strictly restricted to authorized agency operators.
          </p>
        </div>
      </div>

      <div />
    </div>
  );
};
