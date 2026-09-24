// client/src/pages/merchant/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import VerificationBadge from '../../components/VerificationBadge.jsx';
import api from '../../services/api.js';
import {
  Store,
  FileCheck2,
  UtensilsCrossed,
  Plus,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Edit
} from 'lucide-react';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMerchantVenues() {
      try {
        const res = await api.venues.getMyVenues();
        if (res.venues) setVenues(res.venues);
      } catch (err) {
        console.error('Failed to load merchant venues:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMerchantVenues();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-brand-950/20 to-slate-900/90">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
            Merchant Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Welcome back, {user?.full_name || 'Chef'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Manage establishment credentials, track AI optical audits, and update your menu.
          </p>
        </div>

        <Link
          to="/merchant/venue/new"
          className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Venue</span>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Managed Venues</span>
          <div className="text-3xl font-extrabold text-white font-mono">{venues.length}</div>
          <span className="text-[11px] text-slate-400 block">Published in active directory</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Verification Status</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {venues.filter(v => v.verification_status === 'AI_VERIFIED').length} / {venues.length}
          </div>
          <span className="text-[11px] text-emerald-300 block">AI Verified by Gemini 2.5 Flash</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-semibold uppercase">Expiration Monitoring</span>
          <div className="text-3xl font-extrabold text-gold-400 font-mono">Active</div>
          <span className="text-[11px] text-slate-400 block">Next renewal audit in 10 months</span>
        </div>
      </div>

      {/* Managed Venues List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Store className="w-5 h-5 text-brand-400" />
          <span>Your Dining Venues</span>
        </h2>

        {loading ? (
          <div className="glass-panel p-8 text-center text-slate-400 animate-pulse">
            Loading your venues...
          </div>
        ) : venues.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center space-y-4">
            <Store className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-bold text-white text-base">No Venues Registered Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first venue profile and upload a Halal certificate to start receiving diners.
            </p>
            <Link
              to="/merchant/venue/new"
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Venue Profile</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="glass-panel rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-white">{venue.name}</h3>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{venue.address}, {venue.city}</span>
                      </span>
                    </div>

                    <VerificationBadge
                      status={venue.verification_status}
                      score={venue.active_certificate?.ai_confidence_score}
                      size="sm"
                    />
                  </div>

                  {/* Cert details if available */}
                  {venue.active_certificate && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Certifier:</span>
                        <strong className="text-white">{venue.active_certificate.certifying_body_code || 'IFANCA / HMC'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Valid Until:</span>
                        <strong className="text-emerald-400">{venue.active_certificate.expiration_date}</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2">
                  <Link
                    to={`/merchant/certificate/upload?venue_id=${venue.id}`}
                    className="btn-gold py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Upload Cert</span>
                  </Link>

                  <Link
                    to={`/merchant/menu?venue_id=${venue.id}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UtensilsCrossed className="w-3.5 h-3.5" />
                    <span>Menu Items</span>
                  </Link>

                  <Link
                    to={`/venue/${venue.id}`}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Live</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
