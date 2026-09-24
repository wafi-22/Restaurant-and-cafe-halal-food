// client/src/pages/VenueDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VerificationBadge from '../components/VerificationBadge.jsx';
import CertificateViewerModal from '../components/CertificateViewerModal.jsx';
import AIChatWidget from '../components/AIChatWidget.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  MapPin,
  Star,
  WineOff,
  Phone,
  Globe,
  FileCheck2,
  Calendar,
  CheckCircle2,
  Sparkles,
  UtensilsCrossed,
  MessageSquare,
  ShieldCheck,
  Send,
  User,
  Clock
} from 'lucide-react';

export default function VenueDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inspectModalOpen, setInspectModalOpen] = useState(false);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [halalRating, setHalalRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    async function fetchVenue() {
      setLoading(true);
      try {
        const res = await api.venues.getById(id);
        if (res.venue) {
          setVenue(res.venue);
        }
      } catch (err) {
        console.error('Failed to fetch venue details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVenue();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.venues.addReview(venue.id, {
        rating,
        halal_authenticity_rating: halalRating,
        comment,
        photo_urls: []
      });

      if (res.success) {
        setReviewSuccess('Review published successfully!');
        setComment('');
        // Refresh venue reviews
        const updated = await api.venues.getById(id);
        if (updated.venue) setVenue(updated.venue);
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-brand-400 animate-spin mx-auto mb-2" />
        <p>Loading venue credentials and menu data...</p>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-white">
        <h2 className="text-xl font-bold">Venue Not Found</h2>
        <Link to="/explore" className="text-brand-400 text-sm mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  const activeCert = venue.active_certificate || (venue.certificates && venue.certificates[0]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Link to="/explore" className="hover:text-white">Directory</Link>
          <span>/</span>
          <span className="text-slate-200">{venue.city}</span>
          <span>/</span>
          <span className="text-brand-400 font-semibold">{venue.name}</span>
        </div>

        <button
          onClick={() => setInspectModalOpen(true)}
          className="btn-gold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Inspect Certificate Scan</span>
        </button>
      </div>

      {/* Hero Showcase Card */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-slate-900">
          <img
            src={venue.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80'}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-transparent to-black/30" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <VerificationBadge
              status={venue.verification_status}
              score={activeCert?.ai_confidence_score}
              size="lg"
            />
            {venue.certifying_body_code && (
              <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-amber-300">
                Audited By: {venue.certifying_body_code}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
              {venue.venue_type?.replace('_', ' ')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
              {venue.name}
            </h1>

            {/* Ratings & Authenticity Score */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-sm text-gold-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Star className="w-4 h-4 fill-current" />
                <span>{parseFloat(venue.average_rating || 0).toFixed(1)}</span>
                <span className="text-xs text-slate-400">({venue.review_count || 0} reviews)</span>
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                100% Halal Monitored
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-4 leading-relaxed">
              {venue.description || 'Premier establishment with dedicated Halal culinary pipeline and full regulatory documentation on file.'}
            </p>
          </div>

          {/* Contact & Address */}
          <div className="space-y-2 pt-4 border-t border-white/10 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0" />
              <span>{venue.address}, {venue.city}, {venue.country}</span>
            </div>
            {venue.phone_number && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>{venue.phone_number}</span>
              </div>
            )}
            {venue.website_url && (
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a
                  href={venue.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-400 hover:underline truncate"
                >
                  {venue.website_url}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Halal Integrity Attributes Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-400" />
          <span>Halal Dietary Transparency Checklist</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            venue.is_alcohol_free
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-slate-900/60 border-white/5 text-slate-400'
          }`}>
            <span className="font-semibold block">Alcohol-Free Premises</span>
            <span className="text-[11px] mt-1 font-mono font-bold">
              {venue.is_alcohol_free ? '✓ Strictly Enforced' : '✗ Alcohol Present'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            venue.has_prayer_space
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-slate-900/60 border-white/5 text-slate-400'
          }`}>
            <span className="font-semibold block">Prayer Space</span>
            <span className="text-[11px] mt-1 font-mono font-bold">
              {venue.has_prayer_space ? '✓ Dedicated Area' : '✗ Unavailable'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            venue.has_separate_prep_area
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-slate-900/60 border-white/5 text-slate-400'
          }`}>
            <span className="font-semibold block">Separate Halal Prep</span>
            <span className="text-[11px] mt-1 font-mono font-bold">
              {venue.has_separate_prep_area ? '✓ Dedicated Kitchen' : '✗ Shared Kitchen'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border flex flex-col justify-between ${
            venue.is_hand_slaughtered_only
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-slate-900/60 border-white/5 text-slate-400'
          }`}>
            <span className="font-semibold block">Hand-Slaughtered Only</span>
            <span className="text-[11px] mt-1 font-mono font-bold">
              {venue.is_hand_slaughtered_only ? '✓ 100% Zabiha' : '— Machine / Standard'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Menu items + In-Venue AI Concierge Q&A */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Menu items */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-brand-400" />
              <span>Verified Menu Items</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {venue.menu_items?.length || 0} items listed
            </span>
          </div>

          {(!venue.menu_items || venue.menu_items.length === 0) ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              No menu items currently published for this venue.
            </div>
          ) : (
            <div className="space-y-3">
              {venue.menu_items.map((item) => (
                <div
                  key={item.id}
                  className="glass-panel p-4 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.name}</span>
                      {item.is_halal_certified && (
                        <span className="px-1.5 py-0.2 rounded bg-brand-950 text-brand-300 border border-brand-500/30 text-[10px] font-bold">
                          Halal
                        </span>
                      )}
                      {!item.contains_alcohol && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                          Alcohol-Free
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <span className="text-[10px] text-slate-500 block">{item.category}</span>
                  </div>

                  <span className="font-bold font-mono text-gold-400 text-sm flex-shrink-0">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Community Reviews Section */}
          <div className="pt-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold-400" />
              <span>Community Reviews & Authenticity Feedback</span>
            </h3>

            {/* Submit Review Box */}
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4">
                <span className="text-xs font-bold text-white block">Post a Verified Diner Review</span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Overall Rating (1-5)</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg glass-input text-white"
                    >
                      <option value="5" className="bg-slate-900">5 Stars - Outstanding</option>
                      <option value="4" className="bg-slate-900">4 Stars - Very Good</option>
                      <option value="3" className="bg-slate-900">3 Stars - Average</option>
                      <option value="2" className="bg-slate-900">2 Stars - Poor</option>
                      <option value="1" className="bg-slate-900">1 Star - Avoid</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Halal Authenticity Confidence (1-5)</label>
                    <select
                      value={halalRating}
                      onChange={(e) => setHalalRating(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg glass-input text-white"
                    >
                      <option value="5" className="bg-slate-900">5/5 - Cert framed & Staff knowledgeable</option>
                      <option value="4" className="bg-slate-900">4/5 - Good transparency</option>
                      <option value="3" className="bg-slate-900">3/5 - Moderate certainty</option>
                      <option value="2" className="bg-slate-900">2/5 - Uncertain cross-prep</option>
                      <option value="1" className="bg-slate-900">1/5 - Suspicious claims</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience regarding food quality, meat provenance, and kitchen cleanliness..."
                    className="w-full p-3 text-xs rounded-xl glass-input text-white placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center justify-between">
                  {reviewSuccess && <span className="text-xs text-emerald-400 font-semibold">{reviewSuccess}</span>}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold ml-auto"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-400 flex items-center justify-between">
                <span>Sign in to post a community review and rate authenticity.</span>
                <Link to="/login" className="text-brand-400 font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {venue.reviews?.map((r) => (
                <div key={r.id} className="glass-panel p-4 rounded-xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-bold">
                        {r.user_name?.charAt(0) || 'D'}
                      </div>
                      <span className="font-semibold text-xs text-white">{r.user_name || 'Verified Diner'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-gold-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{r.rating}/5</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: In-Venue AI Concierge Q&A */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Ask AI Concierge About {venue.name}</span>
            </h3>
            <AIChatWidget selectedVenueId={venue.id} />
          </div>
        </div>
      </div>

      {/* Modal */}
      {inspectModalOpen && (
        <CertificateViewerModal
          venue={venue}
          onClose={() => setInspectModalOpen(false)}
        />
      )}
    </div>
  );
}
