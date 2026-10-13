import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, 
  Coins, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Plane, 
  HelpCircle, 
  Phone, 
  MessageSquare, 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle,
  TrendingUp,
  CreditCard,
  Building2,
  Send,
  Zap,
  Globe
} from 'lucide-react';
import { CurrencyConverterCard } from './CurrencyConverterCard';
import { CURRENCIES, POPULAR_TRAVEL_PAIRS, FALLBACK_INR_RATES } from '../data/currencies';
import { fetchCurrencyRates } from '../api';

interface CurrencyPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
  onNavigateFlight?: () => void;
  onNavigateTourPackages?: () => void;
}

export const CurrencyPage: React.FC<CurrencyPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
  onNavigateFlight,
  onNavigateTourPackages,
}) => {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_INR_RATES);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Live');

  // Selected quick pair to feed into the top converter
  const [selectedPair, setSelectedPair] = useState<{ from: string; to: string }>({
    from: 'INR',
    to: 'SAR',
  });

  // Forex enquiry form state
  const [forexName, setForexName] = useState('');
  const [forexPhone, setForexPhone] = useState('');
  const [forexCurrency, setForexCurrency] = useState('SAR');
  const [forexAmount, setForexAmount] = useState('2000');
  const [forexType, setForexType] = useState<'cash' | 'card' | 'both'>('cash');
  const [forexCity, setForexCity] = useState('');
  const [forexTravelDate, setForexTravelDate] = useState('');
  const [forexSubmitted, setForexSubmitted] = useState(false);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const data = await fetchCurrencyRates('INR');
        if (data && data.rates) {
          setRates(data.rates);
          if (data.lastUpdated) {
            setLastUpdatedTime(new Date(data.lastUpdated).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }));
          }
        }
      } catch (e) {
        console.warn('Currency rates error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const handleForexSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forexName.trim() || !forexPhone.trim()) return;

    const message = `*Aazam Travel Agency - Foreign Exchange Assistance Inquiry*\n\n` +
      `👤 *Traveler:* ${forexName.trim()}\n` +
      `📞 *Phone:* ${forexPhone.trim()}\n` +
      `💵 *Target Currency:* ${forexCurrency}\n` +
      `💰 *Required Amount:* ${forexAmount} ${forexCurrency}\n` +
      `💳 *Format:* ${forexType === 'cash' ? 'Foreign Currency Notes (Cash)' : forexType === 'card' ? 'Multi-Currency Forex Card' : 'Both Cash Notes & Forex Card'}\n` +
      (forexTravelDate ? `📅 *Departure Date:* ${forexTravelDate}\n` : '') +
      (forexCity ? `📍 *City / Delivery:* ${forexCity.trim()}\n` : '') +
      `\nPlease provide the best currency exchange rates and delivery coordination.`;

    const url = `https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(message)}`;
    setForexSubmitted(true);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-[#0B2545] text-white border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors font-medium group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3 text-slate-300">
            <span className="hidden sm:inline">24/7 Travel Forex Desk:</span>
            <a
              href={`tel:${agencyPhone}`}
              className="text-orange-400 font-bold hover:underline"
            >
              {agencyPhone}
            </a>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0B2545] via-[#133E68] to-[#0A192F] text-white pt-12 pb-24 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-orange-300 text-xs font-black uppercase tracking-wider mb-4 border border-white/15">
              <Coins className="w-4 h-4 text-orange-400" />
              <span>Aazam Travel Agency · Currency & Forex Desk</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Live Currency Converter & <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                Travel Foreign Exchange
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Check real-time international exchange rates for Umrah & Hajj pilgrims (Saudi Riyal), Dubai holidays (UAE Dirham), Thailand, Europe, Singapore, and worldwide flight destinations.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Interbank Rates</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saudi Riyal (SAR) & Dirham (AED) Special</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Cash & Forex Card Guidance</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area: Negative Margin pulls converter up over hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-20 relative z-20 space-y-12">
        {/* 1. Main Currency Converter Card */}
        <CurrencyConverterCard
          key={`${selectedPair.from}-${selectedPair.to}`}
          initialFrom={selectedPair.from}
          initialTo={selectedPair.to}
          initialAmount={10000}
          agencyPhone={agencyPhone}
          agencyWhatsApp={agencyWhatsApp}
        />

        {/* 2. Popular Travel Currency Pairs Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>Travelers' Favorite Pairs</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Popular Destination Exchange Rates
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Click any destination card to convert instantly
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_TRAVEL_PAIRS.map((pair) => {
              const targetCurr = CURRENCIES.find((c) => c.code === pair.to);
              const rateInr = rates[pair.to] || FALLBACK_INR_RATES[pair.to] || 1;
              const inrPerUnit = rateInr > 0 ? (1 / rateInr) : 0;

              return (
                <button
                  key={`${pair.from}-${pair.to}`}
                  type="button"
                  onClick={() => {
                    setSelectedPair({ from: pair.from, to: pair.to });
                    window.scrollTo({ top: 220, behavior: 'smooth' });
                  }}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all text-left group hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{targetCurr?.flag || '🌐'}</span>
                        <span className="font-black text-slate-900 text-sm">
                          {pair.from} ➔ {pair.to}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {pair.badge}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 line-clamp-1">
                      {pair.label}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {pair.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">1 {pair.to} =</div>
                      <div className="text-sm font-black text-orange-600 font-mono">
                        ₹{inrPerUnit.toFixed(2)} INR
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                      Convert →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Multi-Currency Live Comparison Table for Indian Travelers */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Budget Estimator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                What Does Your Indian Rupee (INR) Buy Abroad?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Compare typical holiday and pilgrimage budgets across top destinations.
              </p>
            </div>

            <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
              Rates updated: <strong className="text-slate-800">{lastUpdatedTime}</strong>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0B2545] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">Country & Destination</th>
                  <th className="py-3 px-4 font-bold">Currency</th>
                  <th className="py-3 px-4 font-bold">₹10,000 INR</th>
                  <th className="py-3 px-4 font-bold">₹25,000 INR</th>
                  <th className="py-3 px-4 font-bold">₹50,000 INR</th>
                  <th className="py-3 px-4 font-bold">₹1,00,000 INR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { code: 'SAR', name: 'Saudi Arabia (Umrah/Hajj)' },
                  { code: 'AED', name: 'United Arab Emirates (Dubai)' },
                  { code: 'THB', name: 'Thailand (Bangkok/Phuket)' },
                  { code: 'SGD', name: 'Singapore' },
                  { code: 'MYR', name: 'Malaysia' },
                  { code: 'USD', name: 'United States & Global' },
                  { code: 'EUR', name: 'Europe (Schengen)' },
                  { code: 'GBP', name: 'United Kingdom (London)' },
                  { code: 'QAR', name: 'Qatar (Doha)' },
                  { code: 'IDR', name: 'Indonesia (Bali)' },
                  { code: 'TRY', name: 'Turkey (Istanbul)' },
                ].map((row, idx) => {
                  const curr = CURRENCIES.find((c) => c.code === row.code);
                  const rate = rates[row.code] || FALLBACK_INR_RATES[row.code] || 0.01;

                  return (
                    <tr
                      key={row.code}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <span className="text-lg">{curr?.flag}</span>
                        <span>{row.name}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        {row.code} ({curr?.symbol})
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {curr?.symbol} {(10000 * rate).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {curr?.symbol} {(25000 * rate).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-orange-600 font-bold">
                        {curr?.symbol} {(50000 * rate).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-700">
                        {curr?.symbol} {(100000 * rate).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Travel Forex Guide & Regulations */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Pilgrimage Cash Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              🇸🇦
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Umrah & Hajj Pilgrimage Cash Tips
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For Makkah and Madinah, always carry <strong>1,500 to 3,000 Saudi Riyals (SAR)</strong> in cash per pilgrim. Smaller shops, laundry, local taxis, and dates/Zamzam stalls often do not accept international cards.
            </p>
            <div className="pt-2 text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We assist with genuine Saudi Riyal cash notes</span>
            </div>
          </div>

          {/* Card 2: RBI Limits & Regulations */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              🇮🇳
            </div>
            <h3 className="text-lg font-black text-slate-900">
              RBI Cash & Forex Carrying Limits
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Under RBI Liberalised Remittance Scheme (LRS), Indian citizens can carry up to <strong>USD 3,000 in physical cash</strong> and the rest on a Multi-Currency Forex Card (up to USD 250,000 per financial year).
            </p>
            <div className="pt-2 text-xs text-blue-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>100% compliant documentation assistance</span>
            </div>
          </div>

          {/* Card 3: Avoid Airport Markup */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Avoid Airport Currency Counters
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Currency exchange counters at Indian and foreign airports charge exorbitant markups of <strong>8% to 15%</strong>. Exchange your foreign currency or arrange a Forex Card through Aazam Travel Agency before departure to save thousands!
            </p>
            <div className="pt-2 text-xs text-amber-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Pre-book your forex for lowest spreads</span>
            </div>
          </div>
        </section>

        {/* 5. Inquire Foreign Exchange / Forex Delivery Request Form */}
        <section className="bg-gradient-to-br from-[#0B2545] to-[#133E68] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                <span>Pan-India Travel Forex Desk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Need Cash Currency or a Forex Card for Your Trip?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Tell us your destination and required currency. Our travel desk will check the best live exchange rates and coordinate with authorized Forex partners for you.
              </p>
            </div>

            <form onSubmit={handleForexSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={forexName}
                    onChange={(e) => setForexName(e.target.value)}
                    placeholder="Full name as on passport"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:bg-white/15"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={forexPhone}
                    onChange={(e) => setForexPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:bg-white/15"
                  />
                </div>

                {/* Currency */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Currency Needed
                  </label>
                  <select
                    value={forexCurrency}
                    onChange={(e) => setForexCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B2545] border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-400"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0B2545] text-white">
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Amount Required
                  </label>
                  <input
                    type="text"
                    value={forexAmount}
                    onChange={(e) => setForexAmount(e.target.value)}
                    placeholder="e.g. 2,000 SAR or 1,000 USD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:bg-white/15"
                  />
                </div>

                {/* Format */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Forex Type
                  </label>
                  <select
                    value={forexType}
                    onChange={(e) => setForexType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B2545] border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-400"
                  >
                    <option value="cash" className="bg-[#0B2545] text-white">💵 Cash Notes</option>
                    <option value="card" className="bg-[#0B2545] text-white">💳 Multi-Currency Forex Card</option>
                    <option value="both" className="bg-[#0B2545] text-white">💵 + 💳 Both Cash & Card</option>
                  </select>
                </div>

                {/* Travel Date */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase">
                    Approx Travel Date
                  </label>
                  <input
                    type="date"
                    value={forexTravelDate}
                    onChange={(e) => setForexTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Prompt coordination via WhatsApp · Best transparent spreads guaranteed</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Forex Request via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
