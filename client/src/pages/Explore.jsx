// client/src/pages/Explore.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VenueCard from '../components/VenueCard.jsx';
import InteractiveMap from '../components/InteractiveMap.jsx';
import CertificateViewerModal from '../components/CertificateViewerModal.jsx';
import api from '../services/api.js';
import {
  Search,
  Filter,
  WineOff,
  Sliders,
  CheckCircle,
  MapPin,
  RefreshCw,
  LocateFixed,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [certifiers, setCertifiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectVenue, setInspectVenue] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState([40.7527, -73.9772]);
  const [mapZoom, setMapZoom] = useState(12);

  // Filter States initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [venueType, setVenueType] = useState(searchParams.get('venue_type') || '');
  const [halalClassification, setHalalClassification] = useState(searchParams.get('halal_classification') || '');
  const [isAlcoholFree, setIsAlcoholFree] = useState(searchParams.get('is_alcohol_free') === 'true');
  const [hasPrayerSpace, setHasPrayerSpace] = useState(searchParams.get('has_prayer_space') === 'true');
  const [isHandSlaughtered, setIsHandSlaughtered] = useState(searchParams.get('is_hand_slaughtered_only') === 'true');
  const [verificationStatus, setVerificationStatus] = useState(searchParams.get('verification_status') || '');
  const [certifierId, setCertifierId] = useState(searchParams.get('certifying_body_id') || '');
  const [radius, setRadius] = useState(Number(searchParams.get('radius')) || 25);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Load Certifiers Directory for Filter Dropdown
  useEffect(() => {
    async function fetchCertifiers() {
      try {
        const res = await api.certifiers.list();
        if (res.certifiers) setCertifiers(res.certifiers);
      } catch (e) {
        console.error('Certifiers fetch error:', e);
      }
    }
    fetchCertifiers();
  }, []);

  // Fetch Venues on Filter Change
  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (city) params.city = city;
        if (venueType) params.venue_type = venueType;
        if (halalClassification) params.halal_classification = halalClassification;
        if (isAlcoholFree) params.is_alcohol_free = true;
        if (hasPrayerSpace) params.has_prayer_space = true;
        if (isHandSlaughtered) params.is_hand_slaughtered_only = true;
        if (verificationStatus) params.verification_status = verificationStatus;
        if (certifierId) params.certifying_body_id = certifierId;
        if (userCoords) {
          params.lat = userCoords.lat;
          params.lng = userCoords.lng;
          params.radius = radius;
        }

        const res = await api.venues.list(params);
        if (res.venues) {
          setVenues(res.venues);
          if (res.venues.length > 0 && !userCoords) {
            setMapCenter([parseFloat(res.venues[0].latitude), parseFloat(res.venues[0].longitude)]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch venues:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [
    search,
    city,
    venueType,
    halalClassification,
    isAlcoholFree,
    hasPrayerSpace,
    isHandSlaughtered,
    verificationStatus,
    certifierId,
    radius,
    userCoords
  ]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setMapCenter([coords.lat, coords.lng]);
        setMapZoom(13);
      },
      (err) => {
        alert('Could not determine your GPS location.');
      }
    );
  };

  const resetFilters = () => {
    setSearch('');
    setCity('');
    setVenueType('');
    setHalalClassification('');
    setIsAlcoholFree(false);
    setHasPrayerSpace(false);
    setIsHandSlaughtered(false);
    setVerificationStatus('');
    setCertifierId('');
    setRadius(25);
    setUserCoords(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue names, cuisines, steaks, bakeries, or dishes..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-white/10 transition-colors flex-1 md:flex-none justify-center"
          >
            <LocateFixed className="w-3.5 h-3.5 text-brand-400" />
            <span>Use My GPS</span>
          </button>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs bg-brand-600 text-white rounded-xl flex-1 justify-center font-medium"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          <button
            onClick={resetFilters}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 border border-white/5 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Discovery Layout: Filters + List + Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter Panel (Desktop & Mobile Drawer) */}
        <div className={`lg:col-span-3 space-y-5 ${showFiltersMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-400" /> Filter Criteria
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-brand-400 hover:text-brand-300 font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* City Preset */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">City / Metropolitan Area</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-200"
              >
                <option value="" className="bg-slate-900">All Global Cities</option>
                <option value="New York" className="bg-slate-900">New York (USA)</option>
                <option value="London" className="bg-slate-900">London (UK)</option>
                <option value="Toronto" className="bg-slate-900">Toronto (Canada)</option>
                <option value="Chicago" className="bg-slate-900">Chicago (USA)</option>
                <option value="Kuala Lumpur" className="bg-slate-900">Kuala Lumpur (Malaysia)</option>
              </select>
            </div>

            {/* Verification Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Verification Trust Level</label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-200"
              >
                <option value="" className="bg-slate-900">All Trust Levels</option>
                <option value="AI_VERIFIED" className="bg-slate-900">AI Verified Only</option>
                <option value="PENDING_HUMAN_REVIEW" className="bg-slate-900">Pending Auditor</option>
                <option value="EXPIRED" className="bg-slate-900">Expired Certificates</option>
                <option value="UNVERIFIED" className="bg-slate-900">Self-Declared</option>
              </select>
            </div>

            {/* Venue Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Venue Category</label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-200"
              >
                <option value="" className="bg-slate-900">All Categories</option>
                <option value="RESTAURANT" className="bg-slate-900">Restaurant / Steakhouse</option>
                <option value="CAFE" className="bg-slate-900">Cafe & Bakery</option>
                <option value="BAKERY" className="bg-slate-900">Artisan Bakery</option>
                <option value="BUTCHER_SHOP" className="bg-slate-900">Halal Butcher & Market</option>
                <option value="FOOD_TRUCK" className="bg-slate-900">Food Truck</option>
                <option value="DESSERT_PARLOR" className="bg-slate-900">Dessert & Gelato</option>
              </select>
            </div>

            {/* Certifier Authority Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Certifying Body Authority</label>
              <select
                value={certifierId}
                onChange={(e) => setCertifierId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl glass-input text-slate-200"
              >
                <option value="" className="bg-slate-900">All Certifier Bodies</option>
                {certifiers.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900">
                    {c.short_code} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Strict Dietary Toggles */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Strict Kitchen Guarantees
              </span>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAlcoholFree}
                  onChange={(e) => setIsAlcoholFree(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 bg-slate-900 border-white/20"
                />
                <span className="flex items-center gap-1.5">
                  <WineOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>Strictly Alcohol-Free Premises</span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPrayerSpace}
                  onChange={(e) => setHasPrayerSpace(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 bg-slate-900 border-white/20"
                />
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-gold-400" />
                  <span>Prayer Space on Premises</span>
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHandSlaughtered}
                  onChange={(e) => setIsHandSlaughtered(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 bg-slate-900 border-white/20"
                />
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hand-Slaughtered Only</span>
                </span>
              </label>
            </div>

            {/* Distance Radius Slider */}
            {userCoords && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Search Radius</span>
                  <span className="font-mono text-brand-400 font-bold">{radius} km</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Venues List View (Center) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {venues.length} Verified Establishments Found
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-panel h-48 rounded-2xl animate-pulse bg-slate-800/40" />
              ))}
            </div>
          ) : venues.length === 0 ? (
            <div className="glass-panel p-8 rounded-2xl text-center space-y-3">
              <Search className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="font-bold text-white text-base">No Matching Venues Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try widening your search radius or clearing specific dietary filters.
              </p>
              <button
                onClick={resetFilters}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-block mt-2"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-1">
              {venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  onInspectCertificate={(v) => setInspectVenue(v)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Leaflet Map (Right) */}
        <div className="lg:col-span-4 h-[550px] lg:h-[800px] sticky top-24">
          <InteractiveMap
            venues={venues}
            selectedVenue={selectedVenue}
            onSelectVenue={(v) => {
              setSelectedVenue(v);
              setMapCenter([parseFloat(v.latitude), parseFloat(v.longitude)]);
            }}
            userCoords={userCoords}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      {/* Modal */}
      {inspectVenue && (
        <CertificateViewerModal
          venue={inspectVenue}
          onClose={() => setInspectVenue(null)}
        />
      )}
    </div>
  );
}
