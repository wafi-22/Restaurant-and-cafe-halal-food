// client/src/components/VenueCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  WineOff,
  Sparkles,
  FileCheck2,
  Navigation,
  Check,
  Building
} from 'lucide-react';
import VerificationBadge from './VerificationBadge.jsx';

export default function VenueCard({ venue, onInspectCertificate }) {
  const formatClassification = (cls) => {
    switch (cls) {
      case 'FULL_HALAL_MONITORED':
        return '100% Halal Monitored';
      case 'FULL_HALAL_OWNER_VERIFIED':
        return 'Owner Verified 100%';
      case 'PARTIAL_HALAL_OPTIONS':
        return 'Partial Halal Options';
      case 'MUSLIM_OWNED_NO_CERT':
        return 'Muslim Owned (No Paper Cert)';
      default:
        return cls;
    }
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-brand-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10 flex flex-col group">
      {/* Image Thumbnail Container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={venue.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80'}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <VerificationBadge
            status={venue.verification_status}
            score={venue.active_certificate?.ai_confidence_score}
            size="sm"
          />
        </div>

        {/* Certifier Tag */}
        {venue.certifying_body_code && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-amber-300">
            {venue.certifying_body_code}
          </div>
        )}

        {/* Category & Distance pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="px-2.5 py-0.5 rounded-md bg-brand-950/80 border border-brand-500/30 text-brand-300 font-medium">
            {venue.venue_type?.replace('_', ' ')}
          </span>
          {venue.distance_km !== undefined && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-slate-200">
              <Navigation className="w-3 h-3 text-brand-400" />
              {venue.distance_km} km away
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title and Rating */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/venue/${venue.id}`}
              className="font-bold text-base text-white group-hover:text-brand-300 transition-colors line-clamp-1"
            >
              {venue.name}
            </Link>
            <div className="flex items-center gap-1 text-xs text-gold-400 font-bold bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{parseFloat(venue.average_rating || 0).toFixed(1)}</span>
              <span className="text-[10px] text-slate-400">({venue.review_count || 0})</span>
            </div>
          </div>

          {/* Halal Classification */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{formatClassification(venue.halal_classification)}</span>
          </div>

          {/* Location */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>{venue.address}, {venue.city}</span>
          </div>

          {/* Amenity Pills */}
          <div className="mt-3 flex flex-wrap gap-1 text-[11px]">
            {venue.is_alcohol_free && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-white/5">
                <WineOff className="w-3 h-3 text-rose-400" /> Alcohol-Free
              </span>
            )}
            {venue.has_prayer_space && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-white/5">
                <Check className="w-3 h-3 text-gold-400" /> Prayer Area
              </span>
            )}
            {venue.is_hand_slaughtered_only && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-white/5">
                <Check className="w-3 h-3 text-emerald-400" /> Hand-Slaughtered
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          {venue.active_certificate || venue.verification_status === 'AI_VERIFIED' ? (
            <button
              onClick={() => onInspectCertificate && onInspectCertificate(venue)}
              className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Inspect Certificate</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-500">Uncertified establishment</span>
          )}

          <Link
            to={`/venue/${venue.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-brand-600 text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
