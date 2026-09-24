// client/src/components/HeroSearch.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, LocateFixed, WineOff, CheckCircle2, ChevronRight } from 'lucide-react';

export default function HeroSearch({ onLocationDetect, currentCity = 'New York' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    navigate(`/explore?${params.toString()}`);
  };

  const handleQuickTag = (tagType, val) => {
    const params = new URLSearchParams();
    params.append(tagType, val);
    navigate(`/explore?${params.toString()}`);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        if (onLocationDetect) {
          onLocationDetect(pos.coords.latitude, pos.coords.longitude);
        }
        navigate(`/explore?lat=${pos.coords.latitude}&lng=${pos.coords.longitude}&radius=20`);
      },
      (err) => {
        setLocating(false);
        // Fallback gracefully
        navigate(`/explore?city=New York`);
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        {/* Verification Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs text-brand-300 font-medium mb-6 shadow-lg shadow-brand-500/10 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Multimodal AI Certificate Audits with Google Gemini 2.5 Flash</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
          Discover Confirmed <br className="hidden sm:inline" />
          <span className="gold-gradient-text">Halal Dining</span> With{' '}
          <span className="emerald-gradient-text">Zero Guesswork</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          The world's first AI-audited dining directory. Scanned certificates, multi-factor certifier credibility metrics, cross-contamination verification, and live AI dietary advisory.
        </p>

        {/* Search Bar Container */}
        <div className="glass-panel-elevated p-2 sm:p-2.5 rounded-2xl max-w-3xl mx-auto mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center flex-1 w-full px-3 py-2.5 rounded-xl bg-slate-900/70 border border-white/5">
              <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Wagyu steakhouse, bakery, artisanal cafe, or cuisine..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleLocateMe}
                disabled={locating}
                className="flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-colors flex-1 sm:flex-none"
              >
                <LocateFixed className={`w-4 h-4 text-brand-400 ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating...' : 'Near Me'}</span>
              </button>

              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold flex-1 sm:flex-none"
              >
                <span>Find Halal</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Global Dining Hubs */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1 text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1">
            <MapPin className="w-3 h-3 text-brand-400" /> Dining Hubs:
          </span>
          {['New York', 'London', 'Toronto', 'Chicago', 'Kuala Lumpur'].map((city) => (
            <button
              key={city}
              onClick={() => handleQuickTag('city', city)}
              className="px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700 border border-white/5 text-slate-300 hover:text-white transition-colors"
            >
              {city}
            </button>
          ))}
        </div>

        {/* Dietary Attribute Quick Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <button
            onClick={() => handleQuickTag('is_alcohol_free', 'true')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-brand-950 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-brand-300 transition-all"
          >
            <WineOff className="w-3.5 h-3.5 text-rose-400" />
            <span>Strictly Alcohol-Free</span>
          </button>

          <button
            onClick={() => handleQuickTag('has_prayer_space', 'true')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-brand-950 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-brand-300 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" />
            <span>Prayer Space on Premises</span>
          </button>

          <button
            onClick={() => handleQuickTag('is_hand_slaughtered_only', 'true')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-brand-950 border border-white/10 hover:border-brand-500/40 text-slate-300 hover:text-brand-300 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hand-Slaughtered Only</span>
          </button>

          <button
            onClick={() => handleQuickTag('verification_status', 'AI_VERIFIED')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Verified Only</span>
          </button>
        </div>
      </div>
    </div>
  );
}
