// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSearch from '../components/HeroSearch.jsx';
import VenueCard from '../components/VenueCard.jsx';
import CertificateViewerModal from '../components/CertificateViewerModal.jsx';
import AIChatWidget from '../components/AIChatWidget.jsx';
import api from '../services/api.js';
import {
  ShieldCheck,
  Sparkles,
  Award,
  Compass,
  FileSearch,
  ScanEye,
  CheckCircle,
  WineOff,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function Home() {
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [certifiers, setCertifiers] = useState([]);
  const [inspectVenue, setInspectVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [venuesRes, certsRes] = await Promise.all([
          api.venues.list({ limit: 6, verification_status: 'AI_VERIFIED' }),
          api.certifiers.list()
        ]);
        if (venuesRes.venues) {
          setFeaturedVenues(venuesRes.venues.slice(0, 6));
        }
        if (certsRes.certifiers) {
          setCertifiers(certsRes.certifiers);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <HeroSearch />

      {/* Trust Metrics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="glass-panel-elevated p-6 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center border border-white/10">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold gold-gradient-text font-mono">98.4%</span>
            <p className="text-xs text-slate-300 font-medium">AI Optical Confidence</p>
            <span className="text-[10px] text-slate-400 block">Gemini 2.5 Flash Vision</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-extrabold emerald-gradient-text font-mono">6 Global</span>
            <p className="text-xs text-slate-300 font-medium">Certified Bodies Indexed</p>
            <span className="text-[10px] text-slate-400 block">JAKIM, IFANCA, HMC & more</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-white font-mono">Zero</span>
            <p className="text-xs text-slate-300 font-medium">Hallucination Guarantee</p>
            <span className="text-[10px] text-slate-400 block">Strict RAG database binding</span>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-brand-400 font-mono">Real-Time</span>
            <p className="text-xs text-slate-300 font-medium">Status & Expiration Radar</p>
            <span className="text-[10px] text-slate-400 block">Automatic demotion on lapse</span>
          </div>
        </div>
      </div>

      {/* Featured AI-Verified Establishments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Featured AI-Verified Culinary Destinations
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Establishments with active certificates audited by Gemini 2.5 Flash Vision.
            </p>
          </div>

          <Link
            to="/explore"
            className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 font-semibold group self-start sm:self-auto"
          >
            <span>View All Venues</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredVenues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onInspectCertificate={(v) => setInspectVenue(v)}
            />
          ))}
        </div>
      </div>

      {/* How the AI Verification Engine Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ScanEye className="w-4 h-4 text-gold-400" /> Under the Hood
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              How Google Gemini 2.5 Flash Verifies Halal Accreditation
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              Our multi-stage verification pipeline analyzes physical regulatory documentation with zero-trust machine vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-base text-white">Multimodal Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Establishments submit high-res certificates (.pdf, .png, .jpg). The document buffer is streamed directly into Google Gemini 2.5 Flash Vision.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-base text-white">OCR & Regulatory Seal Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Extracts certifier authority, registration number, scope of accreditation, and confirms that the business trade name matches the venue profile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-base text-white">Confidence & Fraud Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enforces JSON schema output, generates an authenticity score (0-100%), and flags expired dates or unverified seals for administrative review.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Global Certifier Directory Spotlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Recognized Certifying Authorities</h2>
            <p className="text-xs text-slate-400 mt-0.5">Accreditation bodies trusted globally for rigorous audits.</p>
          </div>
          <Link to="/certifiers" className="text-xs text-brand-400 hover:text-brand-300 font-semibold">
            Explore All Certifiers →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {certifiers.slice(0, 6).map((cb) => (
            <div
              key={cb.id}
              className="p-4 rounded-xl glass-panel border border-white/5 hover:border-brand-500/30 transition-all text-center space-y-1.5"
            >
              <Award className="w-6 h-6 text-gold-400 mx-auto" />
              <span className="font-bold text-white text-xs block">{cb.short_code}</span>
              <span className="text-[10px] text-slate-400 block truncate">{cb.country}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Split Section: Merchant Portal Callout + AI Concierge Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Merchant Callout */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-4 h-4" /> For Restaurant & Cafe Owners
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Get Your Venue Verified by AI & Earn Consumer Trust.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload your Halal certificate to receive instant computer-vision verification. Diners can inspect your accreditation credentials with transparency, boosting foot traffic and customer confidence.
            </p>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="btn-primary px-6 py-3 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <span>Register Your Establishment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/merchant/dashboard"
              className="px-5 py-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition-colors"
            >
              Access Merchant Portal
            </Link>
          </div>
        </div>

        {/* AI Concierge Mini Widget */}
        <div className="lg:col-span-5">
          <AIChatWidget />
        </div>
      </div>

      {/* Certificate Viewer Modal Popup */}
      {inspectVenue && (
        <CertificateViewerModal
          venue={inspectVenue}
          onClose={() => setInspectVenue(null)}
        />
      )}
    </div>
  );
}
