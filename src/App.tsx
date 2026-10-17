import React, { useState, useEffect } from 'react';
import { 
  checkAdminSession, 
  fetchPackages, 
  fetchServices, 
  fetchSettings, 
  logoutAdmin 
} from './api';
import { 
  AdminUser, 
  Enquiry, 
  ServiceItem, 
  ServiceType, 
  TourPackage, 
  WebsiteSettings 
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookingHubSection } from './components/BookingHubSection';
import { TrainPage } from './components/TrainPage';
import { FlightPage } from './components/FlightPage';
import { NewsPage } from './components/NewsPage';
import { CurrencyPage } from './components/CurrencyPage';
import { CurrencyConverterCard } from './components/CurrencyConverterCard';
import { ServicesSection } from './components/ServicesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TourPackagesSection } from './components/TourPackagesSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { Logo } from './components/Logo';
import { WhatsAppSuccessModal } from './components/WhatsAppSuccessModal';
import { PolicyModals } from './components/PolicyModals';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminLoginView } from './components/admin/AdminLoginView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { 
  Phone, 
  MessageSquare, 
  Loader2, 
  ShieldCheck, 
  Lock, 
  Train,
  ArrowUp,
  Coins
} from 'lucide-react';

const DEFAULT_SETTINGS: WebsiteSettings = {
  businessName: 'Aazam Travel Agency',
  category: 'Online Travel Agent',
  tagline: 'Your Trusted Pan-India Travel & Train Booking Partner',
  location: 'Pan-India Online Booking Service',
  address: 'Online Travel Operations Desk (Serving All India)',
  phone: '+91 94215 56220',
  whatsapp: '+91 94215 56220',
  email: 'saazamshaikh@gmail.com',
  heroHeadline: '100% Online Train, Flight & Holiday Booking Across India',
  heroSubheadline:
    'Book confirmed train tickets (General & Tatkal for all Indian Railway stations), domestic flights, intercity buses, and holiday packages 100% online with instant WhatsApp confirmation.',
  announcement: '⚡ Pan-India Online IRCTC Train Ticket Reservation & Tatkal Booking Available for All Routes!',
  announcementActive: true,
  officeHours: 'Monday to Sunday: 8:00 AM – 10:00 PM (Online Support)',
  verifiedClaims: [
    '100% Online booking — order from anywhere in India without office visits.',
    'All-India IRCTC train tickets for every station and route.',
    'Instant E-Ticket confirmation via WhatsApp & Email.',
    'Fast & secure online payments via UPI, Google Pay & PhonePe.',
    'Dedicated customer support throughout your journey.',
    'Easy, prompt WhatsApp enquiries with zero paperwork.',
  ],
};

export default function App() {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth & Admin states
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Interactive modals
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
  const [submittedEnquiryData, setSubmittedEnquiryData] = useState<{
    enquiry: Enquiry;
    whatsappUrl: string;
  } | null>(null);

  const [preselectedContactService, setPreselectedContactService] = useState<ServiceType | undefined>(undefined);
  const [activeBookingTab, setActiveBookingTab] = useState<ServiceType>('train');

  // Page Routing: Support dedicated /train page, /flight page, /news page, /currency page, /bus routing, and standalone /admin portal
  const getInitialPage = (): 'home' | 'train' | 'flight' | 'news' | 'currency' | 'admin' => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/admin' || p === '/admin/' || p.startsWith('/admin/')) {
        return 'admin';
      }
      if (p === '/train' || p === '/trains' || p.startsWith('/train/') || p === '/pnr' || p === '/pnr/' || p.startsWith('/pnr/')) {
        return 'train';
      }
      if (p === '/flight' || p === '/flights' || p.startsWith('/flight/')) {
        return 'flight';
      }
      if (p === '/news' || p === '/news/' || p.startsWith('/news/')) {
        return 'news';
      }
      if (p === '/currency' || p === '/forex' || p.startsWith('/currency/')) {
        return 'currency';
      }
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<'home' | 'train' | 'flight' | 'news' | 'currency' | 'admin'>(getInitialPage);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p === '/admin' || p === '/admin/' || p.startsWith('/admin/')) {
        setCurrentPage('admin');
      } else if (p === '/train' || p === '/trains' || p.startsWith('/train/') || p === '/pnr' || p === '/pnr/' || p.startsWith('/pnr/')) {
        setCurrentPage('train');
      } else if (p === '/flight' || p === '/flights' || p.startsWith('/flight/')) {
        setCurrentPage('flight');
      } else if (p === '/news' || p === '/news/' || p.startsWith('/news/')) {
        setCurrentPage('news');
      } else if (p === '/currency' || p === '/forex' || p.startsWith('/currency/')) {
        setCurrentPage('currency');
      } else if (p === '/bus' || p === '/buses' || p.startsWith('/bus/')) {
        setCurrentPage('home');
        setActiveBookingTab('bus');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if initially loaded on /bus
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p === '/bus' || p === '/buses' || p.startsWith('/bus/')) {
        setActiveBookingTab('bus');
        setTimeout(() => {
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  const navigateToPage = (page: 'home' | 'train' | 'flight' | 'news' | 'currency' | 'admin', targetUrl?: string) => {
    setCurrentPage(page);
    let url = targetUrl;
    if (!url) {
      if (page === 'admin') url = '/admin';
      else if (page === 'train') url = '/train';
      else if (page === 'flight') url = '/flight';
      else if (page === 'news') url = '/news';
      else if (page === 'currency') url = '/currency';
      else url = '/';
    }
    if (window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch initial public data
  const loadPublicData = async () => {
    try {
      const [sData, srvData, pkgData] = await Promise.all([
        fetchSettings(),
        fetchServices(),
        fetchPackages(),
      ]);
      setSettings(sData);
      setServices(srvData);
      setPackages(pkgData);
    } catch (err) {
      console.error('Error fetching public agency data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check existing session
  const verifySession = async () => {
    try {
      const session = await checkAdminSession();
      if (session.authenticated && session.user) {
        setIsAdminLoggedIn(true);
        setAdminUser(session.user);
      } else {
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    } catch {
      setIsAdminLoggedIn(false);
      setAdminUser(null);
    }
  };

  useEffect(() => {
    loadPublicData();
    verifySession();
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    if (currentPage === 'admin') {
      navigateToPage('home', '/');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    // If clicking Train Booking, go to dedicated /train page!
    if (sectionId === 'train-booking' || sectionId === 'train' || sectionId === 'trains') {
      navigateToPage('train', '/train');
      return;
    }

    // If clicking Flight Booking or Track Flight, go to dedicated /flight page!
    if (sectionId === 'flight-booking' || sectionId === 'flight' || sectionId === 'flights' || sectionId === 'services-flight') {
      navigateToPage('flight', '/flight');
      return;
    }

    // If clicking Travel News, go to dedicated /news page!
    if (sectionId === 'news' || sectionId === 'travel-news') {
      navigateToPage('news', '/news');
      return;
    }

    // If clicking Currency Converter / Forex, go to dedicated /currency page!
    if (sectionId === 'currency' || sectionId === 'currency-converter' || sectionId === 'forex') {
      navigateToPage('currency', '/currency');
      return;
    }

    if (sectionId === 'station-search') {
      navigateToPage('train', '/train#stations');
      return;
    }

    if (sectionId === 'login' || sectionId === 'admin') {
      navigateToPage('admin', '/admin');
      return;
    }

    // If currently on another page and navigating to a home section
    if (currentPage !== 'home') {
      navigateToPage('home', '/');
      setTimeout(() => {
        if (sectionId === 'flight-booking' || sectionId === 'flights') {
          setActiveBookingTab('flight');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'bus-booking' || sectionId === 'services-bus' || sectionId === 'buses' || sectionId === 'bus') {
          setActiveBookingTab('bus');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'hotel-booking' || sectionId === 'hotels' || sectionId === 'hotel') {
          setActiveBookingTab('hotel');
          const el = document.getElementById('train-booking');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'packages' || sectionId === 'holiday-packages' || sectionId === 'tour-packages') {
          const el = document.getElementById('tour-packages') || document.getElementById('packages');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'religious-tours' || sectionId === 'religious' || sectionId === 'services-religious') {
          const el = document.getElementById('tour-packages') || document.getElementById('services');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (sectionId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    // Already on home page
    if (sectionId === 'flight-booking' || sectionId === 'flights') {
      setActiveBookingTab('flight');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'bus-booking' || sectionId === 'services-bus' || sectionId === 'buses' || sectionId === 'bus') {
      setActiveBookingTab('bus');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'hotel-booking' || sectionId === 'hotels' || sectionId === 'hotel') {
      setActiveBookingTab('hotel');
      const el = document.getElementById('train-booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'packages' || sectionId === 'holiday-packages' || sectionId === 'tour-packages') {
      const el = document.getElementById('tour-packages') || document.getElementById('packages');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'religious-tours' || sectionId === 'religious' || sectionId === 'services-religious') {
      const el = document.getElementById('tour-packages') || document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectServiceForBooking = (serviceKey: string) => {
    if (serviceKey === 'train') {
      navigateToPage('train', '/train');
    } else if (serviceKey === 'flight' || serviceKey === 'bus' || serviceKey === 'hotel') {
      if (currentPage !== 'home') {
        navigateToPage('home', '/');
      }
      setActiveBookingTab(serviceKey as ServiceType);
      handleScrollToSection('train-booking');
    } else {
      if (currentPage !== 'home') {
        navigateToPage('home', '/');
      }
      setPreselectedContactService(serviceKey as ServiceType);
      handleScrollToSection('contact');
    }
  };

  const cleanPhone = settings.phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = settings.whatsapp.replace(/[^0-9]/g, '');

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-[#0B2545]">
        <div className="p-4 rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="font-bold text-sm tracking-wide">Loading Aazam Travel Agency...</span>
        </div>
      </div>
    );
  }

  // Dedicated Standalone Admin View (NEVER shows public home layout underneath)
  if (currentPage === 'admin') {
    if (!isAdminLoggedIn || !adminUser) {
      return (
        <AdminLoginView
          onLoginSuccess={(user) => {
            setIsAdminLoggedIn(true);
            setAdminUser(user);
          }}
          onBackToSite={() => navigateToPage('home', '/')}
        />
      );
    }

    return (
      <AdminDashboard
        adminUser={adminUser}
        initialSettings={settings}
        initialServices={services}
        initialPackages={packages}
        onLogout={handleLogout}
        onClose={() => navigateToPage('home', '/')}
        onRefreshPublicData={loadPublicData}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Header */}
      <Header
        settings={settings}
        currentPage={currentPage}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => navigateToPage('admin', '/admin')}
        onOpenAdminDashboard={() => navigateToPage('admin', '/admin')}
        onNavigateSection={handleScrollToSection}
      />

      {/* Main Content: Dedicated Train Page OR Home Landing Page */}
      <main className="flex-1">
        {currentPage === 'train' ? (
          <TrainPage
            agencyPhone={settings.phone}
            agencyWhatsApp={settings.whatsapp}
            onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            onNavigateHome={() => navigateToPage('home', '/')}
            onNavigateSection={handleScrollToSection}
            initialTab={
              typeof window !== 'undefined' &&
              (window.location.pathname.startsWith('/pnr') || window.location.hash.includes('pnr'))
                ? 'pnr'
                : undefined
            }
          />
        ) : currentPage === 'flight' ? (
          <FlightPage
            agencyPhone={settings.phone}
            agencyWhatsApp={settings.whatsapp}
            onNavigateHome={() => navigateToPage('home', '/')}
            onBookFlightEnquiry={() => {
              setActiveBookingTab('flight');
              navigateToPage('home', '/');
              setTimeout(() => {
                const el = document.getElementById('train-booking');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            }}
          />
        ) : currentPage === 'news' ? (
          <NewsPage
            agencyPhone={settings.phone}
            agencyWhatsApp={settings.whatsapp}
            onNavigateHome={() => navigateToPage('home', '/')}
            onBookTrainClick={() => navigateToPage('train', '/train')}
          />
        ) : currentPage === 'currency' ? (
          <CurrencyPage
            agencyPhone={settings.phone}
            agencyWhatsApp={settings.whatsapp}
            onNavigateHome={() => navigateToPage('home', '/')}
          />
        ) : (
          <>
            {/* 1. Hero Section */}
            <Hero
              settings={settings}
              onBookTrainClick={() => navigateToPage('train', '/train')}
              onBookFlightClick={() => navigateToPage('flight', '/flight')}
              onBookHotelClick={() => {
                setActiveBookingTab('hotel');
                handleScrollToSection('train-booking');
              }}
              onExploreServicesClick={() => handleScrollToSection('services')}
              onSearchStationsClick={() => handleScrollToSection('station-search')}
              onCurrencyClick={() => navigateToPage('currency', '/currency')}
            />

            {/* 2. Unified Travel Booking Engine (Train, Flight, Hotel & Other Passengers) */}
            <BookingHubSection
              agencyPhone={settings.phone}
              agencyWhatsApp={settings.whatsapp}
              activeServiceTab={activeBookingTab}
              onTabChange={(t) => setActiveBookingTab(t)}
              onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            />

            {/* 3. Our Services Section */}
            <ServicesSection
              services={services}
              agencyWhatsApp={settings.whatsapp}
              onSelectServiceForBooking={handleSelectServiceForBooking}
              onOpenCurrencyConverter={() => navigateToPage('currency', '/currency')}
            />

            {/* 3.5 Interactive Live Currency Converter & Travel Forex Desk */}
            <section id="currency-converter" className="py-16 bg-slate-50/80 border-t border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Instant Live Tool</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0B2545] tracking-tight">
                    Live Travel Currency Converter & Forex
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">
                    Calculate real-time foreign currency exchange rates for Saudi Riyal (SAR for Umrah), UAE Dirham (AED), US Dollar (USD), Euro (EUR) & more before booking your trip.
                  </p>
                </div>
                <div className="max-w-4xl mx-auto">
                  <CurrencyConverterCard
                    agencyPhone={settings.phone}
                    agencyWhatsApp={settings.whatsapp}
                    onNavigateForexContact={() => navigateToPage('currency', '/currency')}
                  />
                </div>
              </div>
            </section>

            {/* 4. Why Choose Us & How It Works */}
            <WhyChooseUs />

            {/* 5. Tour Packages Section */}
            <TourPackagesSection
              packages={packages}
              agencyWhatsApp={settings.whatsapp}
              agencyPhone={settings.phone}
              onBookPackage={(pkg) => {
                setPreselectedContactService(pkg.category === 'Religious' ? 'religious' : 'tour');
                handleScrollToSection('contact');
              }}
            />

            {/* 6. Universal Contact & Booking Section */}
            <ContactSection
              settings={settings}
              preselectedService={preselectedContactService}
              onEnquirySuccess={(data) => setSubmittedEnquiryData(data)}
            />
          </>
        )}
      </main>

      {/* Footer */}
      {currentPage === 'home' ? (
        <Footer
          settings={settings}
          onOpenPrivacy={() => setPolicyModal('privacy')}
          onOpenTerms={() => setPolicyModal('terms')}
          onOpenAdminLogin={() => navigateToPage('admin', '/admin')}
          onNavigateSection={handleScrollToSection}
        />
      ) : (
        <footer className="bg-[#07192F] text-slate-400 py-6 border-t border-slate-800 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo iconClassName="h-8 w-auto" isDark={true} showSubtitle={false} />
              <span className="text-[11px] text-slate-400">
                Pan-India 100% Online IRCTC Train & Travel Booking Service
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>© {new Date().getFullYear()} Aazam Travel Agency · All Rights Reserved</span>
              <button
                onClick={() => navigateToPage('admin', '/admin')}
                className="text-slate-400 hover:text-orange-400 transition-colors"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </footer>
      )}


      {/* Floating Action Buttons (Bottom Left Sticky WhatsApp & Staff Status) */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center gap-3 pointer-events-auto">
        {/* Quick WhatsApp Floating Button */}
        <a
          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(
            'Hello Aazam Travel Agency, I need assistance with Pan-India online train & travel booking.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xl shadow-emerald-700/30 transition-all hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Direct WhatsApp Chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">WhatsApp Booking Desk</span>
        </a>

        {/* Admin Quick Switch (if logged in) */}
        {isAdminLoggedIn && (
          <button
            onClick={() => navigateToPage('admin', '/admin')}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#0B2545] text-white text-xs font-bold shadow-xl border border-blue-800 hover:bg-blue-900 transition-all"
            title="Open Admin Dashboard"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}
      </div>

      {/* WhatsApp Modal after Enquiry Submission (Notice requirement) */}
      {submittedEnquiryData && (
        <WhatsAppSuccessModal
          enquiry={submittedEnquiryData.enquiry}
          whatsappUrl={submittedEnquiryData.whatsappUrl}
          onClose={() => setSubmittedEnquiryData(null)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      <PolicyModals
        type={policyModal}
        onClose={() => setPolicyModal(null)}
      />

      {/* Admin Login Modal (popup shortcut) */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onLoginSuccess={(user) => {
          setIsAdminLoggedIn(true);
          setAdminUser(user);
          navigateToPage('admin', '/admin');
        }}
      />
    </div>
  );
}
