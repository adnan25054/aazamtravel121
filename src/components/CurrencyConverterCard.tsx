import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRightLeft, 
  RefreshCw, 
  Search, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Info, 
  Check, 
  HelpCircle,
  ExternalLink,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { CURRENCIES, FALLBACK_INR_RATES, POPULAR_TRAVEL_PAIRS } from '../data/currencies';
import { fetchCurrencyRates } from '../api';
import { CurrencyItem } from '../types';

interface CurrencyConverterCardProps {
  initialFrom?: string;
  initialTo?: string;
  initialAmount?: number;
  agencyPhone?: string;
  agencyWhatsApp?: string;
  compact?: boolean;
  onNavigateForexContact?: () => void;
}

export const CurrencyConverterCard: React.FC<CurrencyConverterCardProps> = ({
  initialFrom = 'INR',
  initialTo = 'SAR',
  initialAmount = 10000,
  agencyPhone = '+91 94215 56220',
  agencyWhatsApp = '+91 94215 56220',
  compact = false,
  onNavigateForexContact,
}) => {
  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialTo);
  const [amount, setAmount] = useState<string>(String(initialAmount));
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_INR_RATES);
  const [loadingRates, setLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Live');
  const [rateSource, setRateSource] = useState<string>('Market Rates');
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [openFromSelect, setOpenFromSelect] = useState(false);
  const [openToSelect, setOpenToSelect] = useState(false);
  const [feeMode, setFeeMode] = useState<'standard' | 'forexCard'>('standard');

  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  // Load real-time rates
  const loadRates = async () => {
    setLoadingRates(true);
    try {
      const data = await fetchCurrencyRates('INR');
      if (data && data.rates) {
        setRates(data.rates);
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live');
        setRateSource(data.provider || 'Live Market Feed');
      }
    } catch (err) {
      console.warn('Using fallback rates:', err);
    } finally {
      setLoadingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Currency lookup objects
  const fromObj = useMemo(() => {
    return CURRENCIES.find((c) => c.code === fromCurrency) || CURRENCIES[0];
  }, [fromCurrency]);

  const toObj = useMemo(() => {
    return CURRENCIES.find((c) => c.code === toCurrency) || CURRENCIES[1];
  }, [toCurrency]);

  // Conversion rates calculation
  // rates[code] is rate relative to 1 INR
  const exchangeRate = useMemo(() => {
    const rateFrom = rates[fromCurrency] || FALLBACK_INR_RATES[fromCurrency] || 1;
    const rateTo = rates[toCurrency] || FALLBACK_INR_RATES[toCurrency] || 1;
    
    // (1 FROM in INR) = 1 / rateFrom
    // (1 FROM in TO) = rateTo / rateFrom
    if (rateFrom === 0) return 0;
    return rateTo / rateFrom;
  }, [rates, fromCurrency, toCurrency]);

  const inverseExchangeRate = useMemo(() => {
    if (exchangeRate === 0) return 0;
    return 1 / exchangeRate;
  }, [exchangeRate]);

  const numAmount = parseFloat(amount) || 0;
  const convertedAmount = numAmount * exchangeRate;

  // Filtered currency lists
  const filteredFromCurrencies = useMemo(() => {
    const q = searchFrom.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [searchFrom]);

  const filteredToCurrencies = useMemo(() => {
    const q = searchTo.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [searchTo]);

  const handleSwap = () => {
    const oldFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(oldFrom);
  };

  const quickAmounts = [1000, 5000, 10000, 25000, 50000, 100000];

  const whatsappInquiryText = `Hello Aazam Travel Agency! I want foreign exchange assistance for converting ${numAmount.toLocaleString('en-IN')} ${fromObj.code} (${fromObj.name}) to ${toObj.code} (${toObj.name}). Converted estimate is approx ${convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} ${toObj.code}. Please share your best cash and Forex card rates!`;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs mb-2 border border-white/10">
            <Coins className="w-3.5 h-3.5" />
            <span>Travel Forex & Currency Calculator</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Live Currency Converter</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Free & Instant
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Real-time exchange rates for Umrah pilgrims, Dubai holidays, international flights & worldwide travel.
          </p>
        </div>

        {/* Live Status & Refresh Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-200 text-[11px] font-medium">
              {rateSource} · {lastUpdated}
            </span>
          </div>
          <button
            onClick={loadRates}
            disabled={loadingRates}
            title="Refresh Live Exchange Rates"
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingRates ? 'animate-spin text-orange-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Main Input Grid: Amount, From, Swap, To */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* 1. Amount Input */}
          <div className="lg:col-span-4 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              You Pay / Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base select-none">
                {fromObj.symbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-9 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg sm:text-xl font-black text-slate-800 outline-none transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. From Currency Selector */}
          <div className="lg:col-span-3 space-y-1.5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              From Currency
            </label>
            <button
              type="button"
              onClick={() => {
                setOpenFromSelect(!openFromSelect);
                setOpenToSelect(false);
              }}
              className="w-full px-3.5 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 focus:border-orange-500 text-left bg-slate-50/50 hover:bg-white flex items-center justify-between gap-2 transition-all outline-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl leading-none">{fromObj.flag}</span>
                <div className="truncate">
                  <div className="font-black text-slate-900 text-base leading-tight">
                    {fromObj.code}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {fromObj.name}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md shrink-0">
                ▾
              </span>
            </button>

            {/* Custom Dropdown Modal/Menu for FROM */}
            {openFromSelect && (
              <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 max-h-80 overflow-hidden flex flex-col">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={(e) => setSearchFrom(e.target.value)}
                    placeholder="Search currency or country..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                  {filteredFromCurrencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setFromCurrency(c.code);
                        setOpenFromSelect(false);
                        setSearchFrom('');
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                        c.code === fromCurrency
                          ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{c.flag}</span>
                        <div className="truncate">
                          <span className="font-bold mr-1">{c.code}</span>
                          <span className="text-slate-500 text-[11px] truncate">{c.name}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono shrink-0">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Swap Button */}
          <div className="lg:col-span-1 flex justify-center pt-2 lg:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap Currencies"
              className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200/80 shadow-xs hover:shadow transition-all hover:scale-110 active:scale-95 flex items-center justify-center group"
            >
              <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* 4. To Currency Selector */}
          <div className="lg:col-span-4 space-y-1.5 relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              To Currency (Travel Destination)
            </label>
            <button
              type="button"
              onClick={() => {
                setOpenToSelect(!openToSelect);
                setOpenFromSelect(false);
              }}
              className="w-full px-3.5 py-3.5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 focus:border-orange-500 text-left bg-slate-50/50 hover:bg-white flex items-center justify-between gap-2 transition-all outline-none"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl leading-none">{toObj.flag}</span>
                <div className="truncate">
                  <div className="font-black text-slate-900 text-base leading-tight">
                    {toObj.code}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {toObj.name}
                  </div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md shrink-0">
                ▾
              </span>
            </button>

            {/* Custom Dropdown Modal/Menu for TO */}
            {openToSelect && (
              <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 max-h-80 overflow-hidden flex flex-col">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={(e) => setSearchTo(e.target.value)}
                    placeholder="Search currency or country..."
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-orange-500"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto flex-1 space-y-1 pr-1">
                  {filteredToCurrencies.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setToCurrency(c.code);
                        setOpenToSelect(false);
                        setSearchTo('');
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left text-xs flex items-center justify-between gap-2 transition-colors ${
                        c.code === toCurrency
                          ? 'bg-orange-50 text-orange-900 font-bold border border-orange-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{c.flag}</span>
                        <div className="truncate">
                          <span className="font-bold mr-1">{c.code}</span>
                          <span className="text-slate-500 text-[11px] truncate">{c.name}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono shrink-0">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-orange-500" />
            <span>Quick:</span>
          </span>
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setAmount(String(q))}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                amount === String(q)
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {fromObj.symbol} {q.toLocaleString('en-IN')}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount('1')}
            className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            1 {fromObj.code}
          </button>
        </div>

        {/* Conversion Result Hero Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-orange-50/40 to-amber-50/50 border-2 border-orange-200/80 shadow-inner">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Converted Amount ({toObj.name})
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                  {toObj.symbol} {convertedAmount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-lg font-black text-orange-600">
                  {toObj.code}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                {numAmount.toLocaleString('en-IN')} {fromObj.name} ({fromObj.code}) ={' '}
                <strong className="text-slate-900">
                  {convertedAmount.toLocaleString('en-IN', { maximumFractionDigits: 4 })} {toObj.code}
                </strong>
              </div>
            </div>

            {/* Exchange Rate Badges */}
            <div className="space-y-1.5 self-start md:self-auto bg-white p-3.5 rounded-xl border border-orange-200/60 shadow-xs">
              <div className="text-[11px] font-bold text-slate-500">Live Exchange Rate:</div>
              <div className="text-xs sm:text-sm font-black text-slate-800 font-mono">
                1 {fromObj.code} = {exchangeRate >= 1 ? exchangeRate.toFixed(4) : exchangeRate.toFixed(6)} {toObj.code}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                1 {toObj.code} = {inverseExchangeRate >= 1 ? inverseExchangeRate.toFixed(4) : inverseExchangeRate.toFixed(6)} {fromObj.code}
              </div>
            </div>
          </div>

          {/* Travel Note & Tips for this Currency */}
          {toObj.travelNotes && (
            <div className="mt-4 pt-4 border-t border-orange-200/60 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
              <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 font-bold mr-1">Travel Advice for {toObj.country}:</strong>
                <span>{toObj.travelNotes}</span>
              </div>
            </div>
          )}
        </div>

        {/* Travel Forex Assistance CTA Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Need physical foreign currency notes or Multi-Currency Forex Cards for your trip?
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappInquiryText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquire Forex on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
