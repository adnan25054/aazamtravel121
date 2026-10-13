import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  RefreshCw, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Phone, 
  MessageSquare,
  Sparkles,
  Luggage,
  Calendar,
  Building2,
  Navigation
} from 'lucide-react';
import { fetchFlights } from '../api';
import { AviationFlightItem } from '../types';

interface FlightPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
  onBookFlightEnquiry: () => void;
}

const POPULAR_AIRPORTS = [
  { code: 'DEL', name: 'Delhi', airport: 'Indira Gandhi Int.' },
  { code: 'BOM', name: 'Mumbai', airport: 'Chhatrapati Shivaji' },
  { code: 'BLR', name: 'Bengaluru', airport: 'Kempegowda Int.' },
  { code: 'HYD', name: 'Hyderabad', airport: 'Rajiv Gandhi Int.' },
  { code: 'MAA', name: 'Chennai', airport: 'Chennai Int.' },
  { code: 'CCU', name: 'Kolkata', airport: 'Netaji Subhash Chandra' },
  { code: 'GOI', name: 'Goa', airport: 'Dabolim Int.' },
  { code: 'DXB', name: 'Dubai', airport: 'Dubai Int.' },
  { code: 'JED', name: 'Jeddah', airport: 'King Abdulaziz Int.' },
];

const POPULAR_QUICK_FLIGHTS = [
  { code: 'AI101', label: 'AI101 (Air India)' },
  { code: '6E205', label: '6E205 (IndiGo)' },
  { code: 'EK503', label: 'EK503 (Emirates)' },
  { code: 'AI804', label: 'AI804 (Air India)' },
  { code: 'UK897', label: 'UK897 (Vistara)' },
];

export const FlightPage: React.FC<FlightPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
  onBookFlightEnquiry,
}) => {
  const [flightNumberInput, setFlightNumberInput] = useState('');
  const [selectedDep, setSelectedDep] = useState('');
  const [selectedArr, setSelectedArr] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [flights, setFlights] = useState<AviationFlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'live' | 'cache' | 'curated'>('live');
  const [activeTab, setActiveTab] = useState<'track' | 'schedule' | 'routes'>('track');

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const loadFlightData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchFlights({
        flightIata: flightNumberInput.trim() || undefined,
        depIata: selectedDep || undefined,
        arrIata: selectedArr || undefined,
        flightStatus: selectedStatus !== 'all' ? selectedStatus : undefined,
        limit: 15,
      });

      setFlights(res.data || []);
      setDataSource(res.source);
    } catch (err: any) {
      console.error('Failed to fetch flight data:', err);
      setError('Unable to load flight tracking radar. Please check the flight number or try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFlightData();
  }, [selectedDep, selectedArr, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFlightData();
  };

  const handleResetFilters = () => {
    setFlightNumberInput('');
    setSelectedDep('');
    setSelectedArr('');
    setSelectedStatus('all');
    setTimeout(() => {
      loadFlightData();
    }, 50);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'active' || s === 'en-route') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>In Flight (En Route)</span>
        </span>
      );
    }
    if (s === 'landed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Landed Confirmed</span>
        </span>
      );
    }
    if (s === 'scheduled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>On Schedule</span>
        </span>
      );
    }
    if (s === 'cancelled') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          <span>Cancelled</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 uppercase">
        <span>{status}</span>
      </span>
    );
  };

  const formatFlightTime = (timeIso?: string | null) => {
    if (!timeIso) return '--:--';
    try {
      const d = new Date(timeIso);
      if (isNaN(d.getTime())) return '--:--';
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '--:--';
    }
  };

  const formatFlightDate = (timeIso?: string | null) => {
    if (!timeIso) return '';
    try {
      const d = new Date(timeIso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-[#07192F] via-[#0B2545] to-[#1E3A8A] text-white pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-6">
            <button 
              onClick={onNavigateHome}
              className="hover:text-orange-400 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-orange-400 font-semibold">Live Flight Radar & Tracker</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-semibold mb-3">
                <Plane className="w-3.5 h-3.5 text-sky-400" />
                <span>Powered by Aviationstack Live Radar</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Track Your Flight Status & Timetable
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Check real-time flight tracking, airport departure & arrival gates, baggage belt numbers, flight delay updates, and book competitive domestic and international air tickets online.
              </p>
            </div>

            {/* Quick Flight Booking Desk CTA */}
            <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <button
                onClick={onBookFlightEnquiry}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                <span>Book Flight Tickets</span>
              </button>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Aazam Travel Agency, I want to book a domestic/international flight ticket.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Flight Search & Tracker Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-5 sm:p-7 mb-8">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Flight Number Input */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Flight Number (IATA)
                </label>
                <div className="relative">
                  <Plane className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={flightNumberInput}
                    onChange={(e) => setFlightNumberInput(e.target.value)}
                    placeholder="e.g. AI101, 6E205, EK503"
                    className="w-full pl-10 pr-3 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase transition-all"
                  />
                </div>
              </div>

              {/* Departure Airport Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Origin Airport
                </label>
                <select
                  value={selectedDep}
                  onChange={(e) => setSelectedDep(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
                >
                  <option value="">All Departure Airports</option>
                  {POPULAR_AIRPORTS.map((a) => (
                    <option key={`dep-${a.code}`} value={a.code}>
                      {a.code} - {a.name} ({a.airport})
                    </option>
                  ))}
                </select>
              </div>

              {/* Arrival Airport Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Destination Airport
                </label>
                <select
                  value={selectedArr}
                  onChange={(e) => setSelectedArr(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
                >
                  <option value="">All Arrival Airports</option>
                  {POPULAR_AIRPORTS.map((a) => (
                    <option key={`arr-${a.code}`} value={a.code}>
                      {a.code} - {a.name} ({a.airport})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter & Action Button */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Flight Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium transition-all"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active (In Flight)</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="landed">Landed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Submit Toolbar & Quick Picks */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              {/* Quick Pick Sample Flights */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                <span className="text-slate-400 font-medium shrink-0">Popular:</span>
                {POPULAR_QUICK_FLIGHTS.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setFlightNumberInput(item.code);
                      setSelectedDep('');
                      setSelectedArr('');
                      setTimeout(() => loadFlightData(), 50);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 font-semibold whitespace-nowrap transition-colors"
                  >
                    {item.code}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {(flightNumberInput || selectedDep || selectedArr || selectedStatus !== 'all') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Reset
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>Track Flight</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Radar Feed Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Plane className="w-6 h-6 text-orange-500 -rotate-45" />
              <span>Live Flight Tracking Board</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing active departures, real-time airborne flights, and arrival terminal allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className={`w-2 h-2 rounded-full ${dataSource === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span>{dataSource === 'live' ? 'Aviationstack Live' : 'Verified Radar'}</span>
            </span>

            <button
              onClick={() => loadFlightData(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-colors disabled:opacity-50"
              title="Refresh Radar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-16 bg-slate-100 rounded-xl" />
                  <div className="h-16 bg-slate-100 rounded-xl" />
                  <div className="h-16 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-red-900">Flight Radar Lookup Error</h3>
            <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
            <button
              onClick={() => loadFlightData()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              Retry Tracking
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && flights.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-8 shadow-xs">
            <Plane className="w-12 h-12 text-slate-300 mx-auto mb-3 -rotate-45" />
            <h3 className="text-lg font-bold text-slate-800">No flights found matching your filter</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto mb-5">
              Try tracking by common flight IATA codes like AI101, 6E205, EK503, or clear your airport filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
            >
              Show All Flights
            </button>
          </div>
        )}

        {/* Flight Cards List */}
        {!loading && !error && flights.length > 0 && (
          <div className="space-y-4">
            {flights.map((flight, idx) => {
              const depTime = formatFlightTime(flight.departure.actual || flight.departure.estimated || flight.departure.scheduled);
              const arrTime = formatFlightTime(flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled);
              const depDate = formatFlightDate(flight.departure.scheduled || flight.flight_date);

              const hasDelay = (flight.departure.delay || 0) > 0 || (flight.arrival.delay || 0) > 0;
              const delayMins = (flight.departure.delay || 0) || (flight.arrival.delay || 0);

              return (
                <div
                  key={`${flight.flight.iata}-${idx}`}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Flight Header Bar */}
                  <div className="bg-slate-50/80 px-5 sm:px-6 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white font-black flex items-center justify-center text-sm shadow-xs">
                        {flight.airline.iata || flight.flight.iata.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {flight.flight.iata}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            ({flight.airline.name})
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {flight.aircraft?.iata ? `Aircraft: ${flight.aircraft.iata}` : 'Commercial Flight'} • {depDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {hasDelay && (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                          Delayed +{delayMins} min
                        </span>
                      )}
                      {getStatusBadge(flight.flight_status)}
                    </div>
                  </div>

                  {/* Flight Route Diagram & Timings */}
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Departure Column */}
                      <div className="md:col-span-4 text-left">
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {depTime}
                        </div>
                        <div className="text-sm font-bold text-orange-600 mt-0.5">
                          {flight.departure.iata || 'DEP'}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 line-clamp-1 mt-0.5">
                          {flight.departure.airport}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500">
                          {flight.departure.terminal && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                              Terminal {flight.departure.terminal}
                            </span>
                          )}
                          {flight.departure.gate && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                              Gate {flight.departure.gate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Flight Path Graphic & Live Speed/Alt */}
                      <div className="md:col-span-4 flex flex-col items-center justify-center py-2">
                        <div className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                          <span>Nonstop</span>
                        </div>
                        <div className="w-full relative flex items-center justify-center">
                          <div className="w-full h-0.5 bg-slate-200" />
                          <div className="absolute w-8 h-8 rounded-full bg-orange-50 border-2 border-orange-500 text-orange-600 flex items-center justify-center shadow-xs">
                            <Plane className="w-4 h-4 transform rotate-45" />
                          </div>
                        </div>

                        {flight.live && flight.live.altitude ? (
                          <div className="mt-2 text-[11px] font-semibold text-emerald-600 flex items-center gap-2">
                            <span>Alt: {flight.live.altitude} ft</span>
                            <span>•</span>
                            <span>Speed: {flight.live.speed_horizontal} km/h</span>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-slate-400 font-medium">
                            {flight.flight_status === 'active' ? 'Cruising at scheduled flight level' : 'Tracked via Radar'}
                          </div>
                        )}
                      </div>

                      {/* Arrival Column */}
                      <div className="md:col-span-4 text-left md:text-right">
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {arrTime}
                        </div>
                        <div className="text-sm font-bold text-orange-600 mt-0.5">
                          {flight.arrival.iata || 'ARR'}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 line-clamp-1 mt-0.5">
                          {flight.arrival.airport}
                        </div>
                        <div className="mt-2 flex flex-wrap md:justify-end gap-2 text-[11px] text-slate-500">
                          {flight.arrival.terminal && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                              Terminal {flight.arrival.terminal}
                            </span>
                          )}
                          {flight.arrival.gate && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                              Gate {flight.arrival.gate}
                            </span>
                          )}
                          {flight.arrival.baggage && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
                              Belt {flight.arrival.baggage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flight Footer Actions */}
                  <div className="bg-slate-50/50 px-5 sm:px-6 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Verified Radar Feed • Aazam Travel Desk Support Available</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(`Hello Aazam Travel Agency, I want to book tickets or get fare for flight ${flight.flight.iata} from ${flight.departure.iata || ''} to ${flight.arrival.iata || ''}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Book This Flight</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Airport Booking & Airfare Enquiry Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B2545] to-[#1E3A8A] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold">
              <Luggage className="w-3.5 h-3.5" />
              <span>Domestic & International Air Ticketing</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Looking for cheap flights or group airline bookings?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Aazam Travel Agency compares all airlines (IndiGo, Air India, SpiceJet, Emirates, Qatar Airways) with web check-in assistance, meal preferences, and instant digital tickets delivered on WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onBookFlightEnquiry}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              Enquire Flight Airfares
            </button>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm text-center transition-all"
            >
              Call {agencyPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
