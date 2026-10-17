import React from 'react';
import { 
  CheckCircle2, 
  Send, 
  Clock, 
  Ticket, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface HowBookingWorksSectionProps {
  agencyWhatsApp: string;
  onSelectServiceClick?: () => void;
}

export const HowBookingWorksSection: React.FC<HowBookingWorksSectionProps> = ({
  agencyWhatsApp,
  onSelectServiceClick,
}) => {
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const steps = [
    {
      step: '01',
      title: 'Select Travel Service',
      description: 'Choose your desired service: Train tickets (IRCTC), Flights, AC Buses, Hotels, or Tour Packages.',
      icon: Ticket,
      accent: 'from-orange-500 to-amber-500',
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Submit Journey Details',
      description: 'Enter boarding station / origin, destination, travel dates, passenger count, and preferred class.',
      icon: Send,
      accent: 'from-blue-600 to-sky-500',
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Get Quotation & Availability',
      description: 'Our travel desk verifies live seat availability and provides the genuine quotation on WhatsApp or Call.',
      icon: Clock,
      accent: 'from-indigo-600 to-purple-600',
      badge: 'Step 3',
    },
    {
      step: '04',
      title: 'Authorized Confirmation',
      description: 'Review details, complete secure online payment (UPI/GPay), and receive your authorized E-Ticket & PNR on WhatsApp.',
      icon: CheckCircle2,
      accent: 'from-emerald-600 to-teal-600',
      badge: 'Step 4',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0B2545] text-xs font-bold uppercase tracking-wider mb-2.5 border border-blue-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Transparent Booking Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            How Booking Works with Aazam Travel Agency
          </h2>
          <p className="mt-3 text-base text-slate-600">
            We make your travel planning effortless and 100% transparent. Follow our straightforward 4-step process from enquiry to confirmed journey.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="relative bg-slate-50/70 hover:bg-white rounded-3xl p-7 border border-slate-200/90 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Step Number Top Watermark */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-slate-300 group-hover:text-orange-400/80 transition-colors">
                    {st.step}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[11px] font-bold">
                    {st.badge}
                  </span>
                </div>

                {/* Icon Container */}
                <div className="mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${st.accent} text-white flex items-center justify-center shadow-md shadow-slate-300/40 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2 leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {st.description}
                  </p>
                </div>

                {/* Step Progress Marker */}
                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-2 text-[11px] font-bold text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>100% Online Assistance</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Essential Legal & Transparency Disclaimer Banner */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500 text-white shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2">
                <span>Important Transparency Notice:</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold uppercase tracking-wider">
                  Enquiry vs. Confirmed Ticket
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-900/90 mt-1 leading-relaxed max-w-3xl">
                Submitting a form creates a <strong>booking enquiry</strong>. A reservation is officially confirmed only after availability verification by our booking agent and receipt of the official IRCTC Electronic Reservation Slip (ERS), airline booking confirmation, or hotel voucher. No false or simulated PNRs are ever issued.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            {onSelectServiceClick && (
              <button
                type="button"
                onClick={onSelectServiceClick}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Start Enquiry Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <a
              href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
                'Hello Aazam Travel Agency! I want to understand your booking process and discuss ticket assistance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
