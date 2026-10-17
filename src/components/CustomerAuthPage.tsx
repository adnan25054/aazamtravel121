import React, { useState } from 'react';
import { CustomerUser } from '../types';
import { customerLogin, getStoredCustomer, setStoredCustomer } from '../api';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  ArrowRight,
  Luggage,
  Lock,
  LogOut
} from 'lucide-react';

interface CustomerAuthPageProps {
  onLoginSuccess: (user: CustomerUser) => void;
  onNavigateMyBookings: () => void;
  onNavigateHome: () => void;
}

export const CustomerAuthPage: React.FC<CustomerAuthPageProps> = ({
  onLoginSuccess,
  onNavigateMyBookings,
  onNavigateHome,
}) => {
  const existingUser = getStoredCustomer();
  const [name, setName] = useState(existingUser?.name || '');
  const [phone, setPhone] = useState(existingUser?.phone || '');
  const [email, setEmail] = useState(existingUser?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await customerLogin(name.trim(), phone.trim(), email.trim() || undefined);
      onLoginSuccess(res.user);
      onNavigateMyBookings();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setStoredCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
        
        {/* Header */}
        <div className="p-8 bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white text-center relative">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Luggage className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Customer Account</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            Log in to view your submitted train, flight & hotel booking enquiries and check live status.
          </p>
        </div>

        {/* Existing Session Prompt */}
        {existingUser ? (
          <div className="p-8 text-center space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-left">
              <span className="text-xs font-bold text-emerald-700 block uppercase tracking-wider mb-1">
                Currently Logged In As:
              </span>
              <p className="font-bold text-base text-[#0B2545]">{existingUser.name}</p>
              <p className="text-xs text-slate-600">{existingUser.phone} {existingUser.email ? `· ${existingUser.email}` : ''}</p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onNavigateMyBookings}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all"
              >
                <span>View My Bookings & Enquiries</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Switch Account / Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mobile / WhatsApp Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">+91</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98223 45678"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                Enter the number you used while submitting booking enquiries
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email Address (Optional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging In...</span>
                </>
              ) : (
                <>
                  <span>Continue to My Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={onNavigateHome}
                className="hover:text-slate-800 transition-colors"
              >
                ← Back to Home
              </button>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Safe & Private Session
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
