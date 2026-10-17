import React, { useState, useEffect } from 'react';
import { CustomerUser, Enquiry } from '../types';
import { 
  fetchCustomerEnquiries, 
  trackEnquiry, 
  cancelCustomerEnquiry, 
  getStoredCustomer,
  setStoredCustomer
} from '../api';
import { 
  Luggage, 
  Search, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Phone, 
  FileText, 
  X, 
  ShieldCheck, 
  ArrowRight,
  Train,
  Plane,
  Bus,
  Building2,
  Compass,
  Heart
} from 'lucide-react';

interface MyBookingsPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  train: Train,
  flight: Plane,
  bus: Bus,
  hotel: Building2,
  tour: Compass,
  religious: Heart,
};

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  New: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Contacted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  Pending: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
  onNavigateLogin,
}) => {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(getStoredCustomer());
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick Reference search (ENQ-... or BKG-...)
  const [searchRef, setSearchRef] = useState('');
  const [singleTrackedEnquiry, setSingleTrackedEnquiry] = useState<Enquiry | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Cancellation modal state
  const [cancellingEnquiry, setCancellingEnquiry] = useState<Enquiry | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const loadUserEnquiries = async (phone: string, email?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCustomerEnquiries(phone, email);
      setEnquiries(data);
    } catch (err: any) {
      setError(err.message || 'Could not load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.phone) {
      loadUserEnquiries(currentUser.phone, currentUser.email);
    }
  }, [currentUser]);

  const handleTrackSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackError(null);
    if (!searchRef.trim()) return;

    setTrackingLoading(true);
    try {
      const res = await trackEnquiry(searchRef.trim());
      setSingleTrackedEnquiry(res.enquiry);
    } catch (err: any) {
      setTrackError(err.message || 'No booking enquiry found with this reference.');
      setSingleTrackedEnquiry(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingEnquiry) return;

    setCancelLoading(true);
    try {
      await cancelCustomerEnquiry(cancellingEnquiry.id, currentUser?.phone, cancelReason);
      setCancelSuccessMsg('Cancellation request submitted. Our team will verify and message you on WhatsApp.');
      // Refresh list
      if (currentUser?.phone) {
        loadUserEnquiries(currentUser.phone, currentUser.email);
      }
      setTimeout(() => {
        setCancellingEnquiry(null);
        setCancelReason('');
        setCancelSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to request cancellation.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#0B2545] via-[#133E68] to-[#0B2545] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
              <Luggage className="w-4 h-4" />
              <span>Customer Portal · Aazam Travel Agency</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Bookings & Enquiry Tracker
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-200 max-w-xl">
              Track your train, flight, bus, hotel, and tour requests. Review journey information and get direct WhatsApp coordination.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/20 text-xs">
                <span className="text-slate-300 block">Logged in as</span>
                <span className="font-bold text-white text-sm">{currentUser.name}</span>
                <span className="text-orange-300 block">{currentUser.phone}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/25"
              >
                Log In / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 space-y-8">
        
        {/* Quick Search Pod (Track by Booking Reference) */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200">
          <form onSubmit={handleTrackSingle} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Track by Booking / Enquiry Reference (e.g. ENQ-1001 or BKG-1001)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={trackingLoading || !searchRef.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              {trackingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Track Enquiry</span>
            </button>
          </form>

          {trackError && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{trackError}</span>
            </div>
          )}

          {/* Single Tracked Enquiry Card Result */}
          {singleTrackedEnquiry && (
            <div className="mt-6 p-6 rounded-2xl bg-orange-50/70 border border-orange-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0B2545]">
                    Ref: {singleTrackedEnquiry.id.replace('ENQ-', 'BKG-')}
                  </span>
                  <span className="text-xs uppercase font-bold text-orange-600 bg-white px-2 py-0.5 rounded-md border border-orange-200">
                    {singleTrackedEnquiry.serviceType}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[singleTrackedEnquiry.status]?.bg || 'bg-slate-100'} ${STATUS_COLORS[singleTrackedEnquiry.status]?.text || 'text-slate-800'} ${STATUS_COLORS[singleTrackedEnquiry.status]?.border || 'border-slate-200'}`}>
                  {singleTrackedEnquiry.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700 bg-white p-4 rounded-xl border border-orange-100">
                <div>
                  <span className="text-slate-500 block">Route / Destination</span>
                  <span className="font-bold text-sm text-slate-900">{singleTrackedEnquiry.origin} ➔ {singleTrackedEnquiry.destination}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Travel Date</span>
                  <span className="font-bold text-sm text-slate-900">{singleTrackedEnquiry.travelDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Passengers / Guests</span>
                  <span className="font-bold text-sm text-slate-900">{singleTrackedEnquiry.passengers} Persons</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-600">
                  Primary Contact: <strong>{singleTrackedEnquiry.customerName}</strong> ({singleTrackedEnquiry.customerPhone})
                </span>
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                    `Hello Aazam Travel Agency! I am following up on booking ref *${singleTrackedEnquiry.id.replace('ENQ-', 'BKG-')}* (${singleTrackedEnquiry.origin} to ${singleTrackedEnquiry.destination}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User's Enquiries List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#0B2545] flex items-center gap-2">
              <span>Your Submitted Enquiries</span>
              {enquiries.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
                  {enquiries.length}
                </span>
              )}
            </h2>
            {currentUser && (
              <button
                type="button"
                onClick={() => loadUserEnquiries(currentUser.phone, currentUser.email)}
                className="text-xs text-orange-600 font-semibold hover:underline"
              >
                Refresh List
              </button>
            )}
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-500 border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-orange-500" />
              <span>Loading your enquiries...</span>
            </div>
          ) : !currentUser ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-4">
              <Luggage className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">Please Log In to View Your History</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Log in with the mobile number you used while creating enquiries to see all your booking statuses in one place.
              </p>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Log In with Mobile Number
              </button>
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Enquiries Found Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't submitted any travel booking enquiries under mobile number <strong>{currentUser.phone}</strong>.
              </p>
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
              >
                Start a New Travel Booking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => {
                const IconComponent = SERVICE_ICONS[enq.serviceType] || Luggage;
                const statusStyle = STATUS_COLORS[enq.status] || STATUS_COLORS.New;
                const formattedDate = new Date(enq.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={enq.id}
                    className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4"
                  >
                    {/* Top Row: Ref & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 text-[#0B2545]">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-[#0B2545]">
                              {enq.id.replace('ENQ-', 'BKG-')}
                            </span>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                              · {enq.serviceType}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600">Submitted on {formattedDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                          {enq.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="text-slate-600 uppercase font-bold text-[10px] block">Route / Destination</span>
                        <span className="font-bold text-sm text-slate-900 block mt-0.5">
                          {enq.origin} ➔ {enq.destination}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-600 uppercase font-bold text-[10px] block">Travel Date</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {enq.travelDate}
                          {enq.returnDate ? ` (Return: ${enq.returnDate})` : ''}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-600 uppercase font-bold text-[10px] block">Class / Quota</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {enq.preferredClass || 'Standard'} {enq.quota ? `· ${enq.quota}` : ''}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-600 uppercase font-bold text-[10px] block">Passengers</span>
                        <span className="font-semibold text-slate-800 block mt-0.5">
                          {enq.passengers} Person(s)
                        </span>
                      </div>
                    </div>

                    {/* Manifest / Passengers list if provided */}
                    {enq.passengerList && enq.passengerList.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700">
                        <span className="font-bold text-[11px] text-slate-500 uppercase block mb-1">
                          Passenger Manifest:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {enq.passengerList.map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium">
                              {p.name} ({p.age}y, {p.gender})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Official updates sent directly via WhatsApp
                      </span>

                      <div className="flex items-center gap-2">
                        {enq.status !== 'Cancelled' && (
                          <button
                            type="button"
                            onClick={() => setCancellingEnquiry(enq)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 font-medium text-xs transition-colors"
                          >
                            Cancel Request
                          </button>
                        )}

                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                            `Hello Aazam Travel Agency! I want to check status of my booking *${enq.id.replace('ENQ-', 'BKG-')}* (${enq.origin} ➔ ${enq.destination}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat on WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 inline mr-1.5" />
          <span>
            Aazam Travel Agency operates transparently. All confirmed railway E-Tickets contain legitimate IRCTC PNR numbers provided directly upon ticket issuance. No simulated data is shown.
          </span>
        </div>
      </div>

      {/* Cancellation Request Modal */}
      {cancellingEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0B2545]">Request Cancellation</h3>
              <button
                type="button"
                onClick={() => setCancellingEnquiry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Submit your cancellation request for booking <strong>{cancellingEnquiry.id.replace('ENQ-', 'BKG-')}</strong> ({cancellingEnquiry.origin} to {cancellingEnquiry.destination}).
            </p>

            {cancelSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cancelSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCancelSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Reason for Cancellation
                  </label>
                  <textarea
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Journey postponed, change of travel dates, personal reasons..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-xs font-medium resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancellingEnquiry(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={cancelLoading}
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {cancelLoading ? 'Submitting...' : 'Confirm Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
