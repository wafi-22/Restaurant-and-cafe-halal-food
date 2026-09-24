// client/src/pages/merchant/VenueEdit.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { Store, MapPin, Building, WineOff, CheckCircle2, ArrowRight } from 'lucide-react';

export default function VenueEdit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    venue_type: 'RESTAURANT',
    halal_classification: 'FULL_HALAL_MONITORED',
    description: '',
    address: '',
    city: 'New York',
    state: 'NY',
    postal_code: '',
    country: 'United States',
    latitude: 40.7527,
    longitude: -73.9772,
    phone_number: '',
    website_url: '',
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
    is_alcohol_free: true,
    has_prayer_space: true,
    has_separate_prep_area: true,
    is_hand_slaughtered_only: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      };

      const res = await api.venues.create(payload);
      if (res.venue) {
        navigate(`/merchant/certificate/upload?venue_id=${res.venue.id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create venue profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 pb-24">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
        <div>
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
            Merchant Venue Registry
          </span>
          <h1 className="text-2xl font-extrabold text-white mt-1">Register Food Establishment</h1>
          <p className="text-xs text-slate-400 mt-1">
            Provide establishment details and dietary compliance attributes for public discovery.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Basic Venue Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Establishment Name</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Al-Barakah Artisanal Kitchen"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Venue Category</label>
                <select
                  name="venue_type"
                  value={formData.venue_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                >
                  <option value="RESTAURANT" className="bg-slate-900">Restaurant / Fine Dining</option>
                  <option value="CAFE" className="bg-slate-900">Cafe & Roastery</option>
                  <option value="BAKERY" className="bg-slate-900">Artisan Bakery</option>
                  <option value="BUTCHER_SHOP" className="bg-slate-900">Halal Butcher / Market</option>
                  <option value="FOOD_TRUCK" className="bg-slate-900">Food Truck</option>
                  <option value="DESSERT_PARLOR" className="bg-slate-900">Dessert & Gelato</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Halal Status Classification</label>
              <select
                name="halal_classification"
                value={formData.halal_classification}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
              >
                <option value="FULL_HALAL_MONITORED" className="bg-slate-900">100% Halal Monitored (Third-Party Audited)</option>
                <option value="FULL_HALAL_OWNER_VERIFIED" className="bg-slate-900">Full Halal Owner Verified (Self-Documented)</option>
                <option value="PARTIAL_HALAL_OPTIONS" className="bg-slate-900">Partial Halal Options (Selected meats)</option>
                <option value="MUSLIM_OWNED_NO_CERT" className="bg-slate-900">Muslim Owned (No paper certificate)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Description</label>
              <textarea
                rows="3"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Highlight culinary specialties, meat provenance, and kitchen hygiene controls..."
                className="w-full p-3 text-xs rounded-xl glass-input text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Location & GPS */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Geographic Location</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-300">Street Address</label>
              <input
                type="text"
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 145 Main Street"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">City</label>
                <input
                  type="text"
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">State / Region</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Postal Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300">Country</label>
                <input
                  type="text"
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Latitude (GPS)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Longitude (GPS)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Kitchen & Premises Features */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kitchen & Premises Checklist</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_alcohol_free"
                  checked={formData.is_alcohol_free}
                  onChange={handleChange}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Strictly Alcohol-Free Premises</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_prayer_space"
                  checked={formData.has_prayer_space}
                  onChange={handleChange}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Prayer Space on Premises</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  name="has_separate_prep_area"
                  checked={formData.has_separate_prep_area}
                  onChange={handleChange}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Separate Halal Prep Area</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_hand_slaughtered_only"
                  checked={formData.is_hand_slaughtered_only}
                  onChange={handleChange}
                  className="rounded text-brand-600 w-4 h-4"
                />
                <span>Hand-Slaughtered Only</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/merchant/dashboard')}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <span>{submitting ? 'Saving Profile...' : 'Save & Proceed to Certificate Upload'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
