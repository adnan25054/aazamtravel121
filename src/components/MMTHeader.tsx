import React, { useState } from 'react';
import { 
  Building, 
  Briefcase, 
  Luggage, 
  Heart, 
  User, 
  ChevronDown, 
  Menu, 
  X, 
  Phone, 
  MessageSquare, 
  Lock,
  Globe,
  Train,
  Plane,
  Sparkles
} from 'lucide-react';
import { WebsiteSettings } from '../types';

interface MMTHeaderProps {
  settings: WebsiteSettings;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onNavigateSection: (id: string) => void;
}

export const MMTHeader: React.FC<MMTHeaderProps> = ({
  settings,
  isAdminLoggedIn,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <header className="w-full bg-[#0b1728] text-white border-b border-white/10 sticky top-0 z-50 shadow-md">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        
        {/* Left: MakeMyTrip-style Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigateSection('hero')}
            className="flex items-center gap-2 group text-left focus:outline-none"
            aria-label="Aazam Travel Agency Home"
          >
            {/* Signature MakeMyTrip style wordmark: aazam [my] trip */}
            <div className="flex items-center tracking-tight font-extrabold text-2xl sm:text-3xl font-sans select-none">
              <span className="text-white group-hover:text-sky-300 transition-colors">aazam</span>
              <span className="mx-1 px-1.5 py-0.5 rounded-md bg-[#e41d36] text-white text-xs sm:text-sm font-black shadow-xs tracking-normal uppercase">
                my
              </span>
              <span className="text-white group-hover:text-sky-300 transition-colors">trip</span>
            </div>
            
            <div className="hidden lg:flex flex-col border-l border-white/20 pl-2 text-[10px] text-slate-300 leading-tight">
              <span className="font-bold text-orange-400">AAZAM TRAVEL</span>
              <span className="text-slate-400">IRCTC & Online Desk</span>
            </div>
          </button>
        </div>

        {/* Right Nav Links - Identical to MakeMyTrip Header */}
        <div className="hidden xl:flex items-center gap-6 text-xs text-slate-200 font-medium">
          
          {/* 1. List Your Property */}
          <button 
            onClick={() => {
              const waText = encodeURIComponent("Hello Aazam Travel Agency, I want to partner with you / list travel service.");
              window.open(`https://wa.me/${cleanWhatsApp}?text=${waText}`, '_blank');
            }}
            className="flex items-center gap-2.5 hover:text-white transition-colors group text-left py-1"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/30">
              <Building className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-white text-[11px]">List Your Property</span>
              <span className="text-[10px] text-slate-400">Grow your business!</span>
            </div>
          </button>

          {/* 2. Introducing myBiz */}
          <button 
            onClick={() => {
              const waText = encodeURIComponent("Hello Aazam Travel, I want to inquire about corporate / business travel bookings.");
              window.open(`https://wa.me/${cleanWhatsApp}?text=${waText}`, '_blank');
            }}
            className="flex items-center gap-2.5 hover:text-white transition-colors group text-left py-1"
          >
            <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/30">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1 font-bold text-white text-[11px]">
                <span className="text-rose-400 font-black">myBiz</span>
                <span>Introducing myBiz</span>
              </div>
              <span className="text-[10px] text-slate-400">Business Travel Solution</span>
            </div>
          </button>

          {/* 3. My Trips / Check PNR */}
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/train#pnr';
              }
            }}
            className="flex items-center gap-2 hover:text-white transition-colors py-1 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Luggage className="w-3.5 h-3.5" />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-white text-[11px]">Check PNR / Trips</span>
              <span className="text-[10px] text-slate-400">Live IRCTC PNR Status</span>
            </div>
          </button>

          {/* 4. Wishlist */}
          <button 
            onClick={() => onNavigateSection('packages')}
            className="flex items-center gap-2 hover:text-white transition-colors py-1 text-left"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-rose-500/30" />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-white text-[11px]">Wishlist</span>
              <span className="text-[10px] text-slate-400">Save favourites</span>
            </div>
          </button>

          {/* 5. Login or Create Account Button (Blue Pill) */}
          <div className="relative">
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  onOpenAdminDashboard();
                } else {
                  setAccountDropdownOpen(!accountDropdownOpen);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#008cff] to-[#0073e6] hover:from-[#007ee6] hover:to-[#0066cc] text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span>{isAdminLoggedIn ? 'Admin Staff Portal' : 'Login or Create Account'}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Account Popover */}
            {accountDropdownOpen && !isAdminLoggedIn && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-3 px-4 z-50">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Aazam Travel Customer Access
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Instantly book & retrieve your IRCTC e-tickets, flights, and hotel vouchers via WhatsApp!
                </p>
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Aazam Travel Agency, I want to access my travel bookings.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs mb-2 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Quick Login</span>
                </a>
                <button
                  onClick={() => {
                    setAccountDropdownOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Agency Staff / Admin Portal</span>
                </button>
              </div>
            )}
          </div>

          {/* 6. Currency & Country Switcher */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
            >
              <span>🇮🇳</span>
              <span>{selectedCurrency}</span>
              <span className="text-slate-400">| English</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3 py-1 font-bold text-slate-400 text-[10px] uppercase">
                  Select Currency
                </div>
                {[
                  { code: 'INR', flag: '🇮🇳', label: 'Indian Rupee (₹)' },
                  { code: 'SAR', flag: '🇸🇦', label: 'Saudi Riyal (SAR)' },
                  { code: 'AED', flag: '🇦🇪', label: 'UAE Dirham (AED)' },
                  { code: 'USD', flag: '🇺🇸', label: 'US Dollar ($)' },
                  { code: 'EUR', flag: '🇪🇺', label: 'Euro (€)' },
                ].map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCurrency(c.code);
                      setCurrencyDropdownOpen(false);
                      onNavigateSection('currency');
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-blue-50 ${
                      selectedCurrency === c.code ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{c.flag} {c.code}</span>
                    <span className="text-[10px] text-slate-500">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex xl:hidden items-center gap-2">
          <a
            href={`https://wa.me/${cleanWhatsApp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-emerald-600 text-white shadow-xs"
            aria-label="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
          <a
            href={`tel:${cleanPhone}`}
            className="p-2 rounded-lg bg-white/10 text-white border border-white/10"
            aria-label="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#071322] border-t border-white/10 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('hero');
              }}
              className="p-2.5 rounded-xl bg-white/5 text-left text-white font-medium hover:bg-white/10"
            >
              ✈️ Flight & Train Hub
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('currency');
              }}
              className="p-2.5 rounded-xl bg-white/5 text-left text-white font-medium hover:bg-white/10"
            >
              💱 Currency Converter
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('packages');
              }}
              className="p-2.5 rounded-xl bg-white/5 text-left text-white font-medium hover:bg-white/10"
            >
              ☂️ Tour Packages
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateSection('contact');
              }}
              className="p-2.5 rounded-xl bg-white/5 text-left text-white font-medium hover:bg-white/10"
            >
              📞 Contact Office
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) onOpenAdminDashboard();
                else onOpenAdminLogin();
              }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Staff Dashboard' : 'Admin Portal'}</span>
            </button>
            <span className="text-slate-400">📞 {settings.phone}</span>
          </div>
        </div>
      )}
    </header>
  );
};
