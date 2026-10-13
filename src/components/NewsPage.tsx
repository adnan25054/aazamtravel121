import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  Train, 
  Plane, 
  Compass, 
  Globe2, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Share2, 
  Check, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { fetchTravelNews } from '../api';
import { NewsArticle } from '../types';

interface NewsPageProps {
  agencyPhone: string;
  agencyWhatsApp: string;
  onNavigateHome: () => void;
  onBookTrainClick: () => void;
}

type NewsCategory = 'all' | 'railway' | 'tourism' | 'aviation';

export const NewsPage: React.FC<NewsPageProps> = ({
  agencyPhone,
  agencyWhatsApp,
  onNavigateHome,
  onBookTrainClick,
}) => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<'live' | 'cache' | 'curated'>('live');
  const [totalCount, setTotalCount] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const categories: { id: NewsCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Travel News', icon: Globe2 },
    { id: 'railway', label: 'Indian Railways & IRCTC', icon: Train },
    { id: 'tourism', label: 'Tourism & Holiday Deals', icon: Compass },
    { id: 'aviation', label: 'Aviation & Flights', icon: Plane },
  ];

  const loadNews = async (cat = activeCategory, query = submittedQuery, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchTravelNews(cat, query, 1, 15);
      setArticles(res.articles || []);
      setTotalCount(res.totalResults || (res.articles ? res.articles.length : 0));
      setNewsSource(res.source);
    } catch (err: any) {
      console.error('Failed to load news:', err);
      setError('Unable to load latest news updates. Please check your internet or retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory, submittedQuery);
  }, [activeCategory, submittedQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSubmittedQuery('');
  };

  const handleShare = async (article: NewsArticle) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    navigator.clipboard?.writeText(article.url);
    setCopiedUrl(article.url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatPublishDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Recently';
      const now = new Date();
      const diffHrs = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
      if (diffHrs < 1) return 'Just now';
      if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
      const diffDays = Math.floor(diffHrs / 24);
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const cleanPhone = agencyPhone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = agencyWhatsApp.replace(/[^0-9]/g, '');

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const regularArticles = articles.length > 0 ? articles.slice(1) : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-gradient-to-r from-[#07192F] via-[#0B2545] to-[#133E68] text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50 shadow-md">
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
            <span className="text-orange-400 font-semibold">Travel & Railway News</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>Live Travel Intelligence & Advisories</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                India Travel, Railway & Tourism News
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                Stay updated with verified Indian Railways schedules, Vande Bharat launches, Tatkal booking guidelines, holiday tourism advisories, and aviation industry updates powered by NewsAPI.
              </p>
            </div>

            {/* Quick Action Assistance */}
            <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
              <button
                onClick={onBookTrainClick}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <Train className="w-4 h-4" />
                <span>Book Confirmed Tickets</span>
              </button>
              <a
                href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello Aazam Travel, I saw the travel news and want to book a ticket.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5"
              >
                <span>WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search train routes, Vande Bharat, Tatkal, flights, Kerala, Kashmir..."
                className="w-full pl-10 pr-24 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#133E68] text-white text-xs font-semibold transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Live Indicator & Refresh Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 border-t lg:border-t-0 pt-3 lg:pt-0">
              <span className="flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${newsSource === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
                <span>
                  {newsSource === 'live' ? 'Live NewsAPI Feed' : newsSource === 'cache' ? 'Verified Feed' : 'Curated Travel Desk'}
                </span>
              </span>

              <button
                onClick={() => loadNews(activeCategory, submittedQuery, true)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors disabled:opacity-50"
                title="Refresh news"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-orange-500' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-100 mt-4 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 opacity-90" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {submittedQuery && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
              <span>Showing search results for: <strong className="text-slate-700">"{submittedQuery}"</strong></span>
              <button onClick={handleClearSearch} className="text-orange-600 hover:underline font-semibold">
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
                <div className="h-44 bg-slate-200 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-slate-200 rounded w-5/6 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-full mb-3" />
                <div className="h-3 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-red-900">Failed to load news</h3>
            <p className="text-sm text-red-600 mt-1 mb-4">{error}</p>
            <button
              onClick={() => loadNews(activeCategory, submittedQuery)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-8 shadow-xs">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No news articles found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto mb-5">
              We couldn't find any recent travel news matching your query. Try clearing your search filters or browse another category.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
            >
              View All Travel News
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="space-y-8">
            {/* Top Featured Headline Article */}
            {featuredArticle && (
              <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 overflow-hidden hover:shadow-lg transition-all group">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[300px] overflow-hidden bg-slate-900">
                    <img
                      src={
                        featuredArticle.urlToImage ||
                        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80'
                      }
                      alt={featuredArticle.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                        Featured Story
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                        {featuredArticle.category === 'railway' ? 'Indian Railways' : featuredArticle.category === 'aviation' ? 'Aviation' : 'Tourism'}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span className="font-semibold text-orange-600">
                          {featuredArticle.source?.name || 'News Desk'}
                        </span>
                        <span>•</span>
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatPublishDate(featuredArticle.publishedAt)}</span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug group-hover:text-orange-600 transition-colors">
                        {featuredArticle.title}
                      </h2>

                      <p className="mt-3 text-sm text-slate-600 line-clamp-4 leading-relaxed">
                        {featuredArticle.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                      <a
                        href={featuredArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#133E68] text-white text-xs sm:text-sm font-semibold transition-all hover:gap-3"
                      >
                        <span>Read Full Story</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleShare(featuredArticle)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                        title="Share article"
                      >
                        {copiedUrl === featuredArticle.url ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Headline Grid */}
            {regularArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-orange-500" />
                    <span>Latest Updates & Advisories</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Showing {articles.length} stories
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularArticles.map((article, idx) => {
                    const fallbackImg = idx % 3 === 0
                      ? 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80'
                      : idx % 3 === 1
                      ? 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=800&auto=format&fit=crop&q=80'
                      : 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80';

                    return (
                      <article
                        key={`${article.url}-${idx}`}
                        className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group"
                      >
                        <div>
                          {/* Article Image */}
                          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                            <img
                              src={article.urlToImage || fallbackImg}
                              alt={article.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = fallbackImg;
                              }}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-slate-800 shadow-xs">
                                {article.category === 'railway' ? 'Railways' : article.category === 'aviation' ? 'Flight' : 'Tourism'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                              <span className="font-semibold text-orange-600 truncate max-w-[150px]">
                                {article.source?.name || 'News Desk'}
                              </span>
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{formatPublishDate(article.publishedAt)}</span>
                              </span>
                            </div>

                            <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
                              {article.title}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                              {article.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] hover:text-orange-600 transition-colors"
                          >
                            <span>Read source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleShare(article)}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                              title="Share article"
                            >
                              {copiedUrl === article.url ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Travel Advisory & Booking Help CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0B2545] to-[#1E3A8A] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold">
              <Train className="w-3.5 h-3.5" />
              <span>Planning Your Next Journey?</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Need assistance booking confirmed train or flight tickets?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Aazam Travel Agency provides 100% online IRCTC train ticket reservations across all 7,000+ stations in India, Tatkal booking guidance, flights, and customized holiday packages.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onBookTrainClick}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              Book Train Tickets
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
