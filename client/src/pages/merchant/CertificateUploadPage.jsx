// client/src/pages/merchant/CertificateUploadPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import MerchantCertificateUploader from '../../components/MerchantCertificateUploader.jsx';
import api from '../../services/api.js';
import { FileCheck2, ArrowLeft, Store, Building } from 'lucide-react';

export default function CertificateUploadPage() {
  const [searchParams] = useSearchParams();
  const initialVenueId = searchParams.get('venue_id') || '';
  const [venueId, setVenueId] = useState(initialVenueId);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await api.venues.getMyVenues();
        if (res.venues) {
          setVenues(res.venues);
          if (!venueId && res.venues.length > 0) {
            setVenueId(res.venues[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load merchant venues:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Back button */}
      <Link
        to="/merchant/dashboard"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Merchant Dashboard</span>
      </Link>

      {/* Venue Selector */}
      {venues.length > 1 && (
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            <span>Select Establishment:</span>
          </label>
          <select
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl glass-input text-white"
          >
            {venues.map((v) => (
              <option key={v.id} value={v.id} className="bg-slate-900">
                {v.name} ({v.city})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Uploader Engine */}
      <MerchantCertificateUploader
        venueId={venueId}
        onUploadSuccess={() => {
          // Success callback
        }}
      />
    </div>
  );
}
