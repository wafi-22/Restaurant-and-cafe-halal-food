// client/src/components/InteractiveMap.jsx
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Fix Leaflet's default icon path issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Category-based marker generator
function createCustomPin(type, status) {
  let color = '#10b981'; // default emerald
  if (type === 'RESTAURANT') color = '#ef4444'; // Red
  else if (type === 'CAFE') color = '#f59e0b'; // Amber
  else if (type === 'BAKERY') color = '#ec4899'; // Pink
  else if (type === 'BUTCHER_SHOP') color = '#dc2626'; // Deep Crimson
  else if (type === 'FOOD_TRUCK') color = '#06b6d4'; // Cyan
  else if (type === 'DESSERT_PARLOR') color = '#8b5cf6'; // Purple

  const isVerified = status === 'AI_VERIFIED';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${color}; opacity: 0.25; ${isVerified ? 'animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}"></div>
        <div style="width: 26px; height: 26px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });
}

export default function InteractiveMap({ venues = [], selectedVenue, onSelectVenue, userCoords, center = [40.7527, -73.9772], zoom = 12 }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView(center, zoom);

      // Dark Matter Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Render Venue Pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Render User Location Pin if provided
    if (userCoords && userCoords.lat && userCoords.lng) {
      const userMarker = L.circleMarker([userCoords.lat, userCoords.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="font-size: 12px; padding: 4px; font-weight: bold; color: #1e293b;">
          📍 Your Current Location
        </div>
      `);
      markersRef.current.push(userMarker);
    }

    // Render Venues
    venues.forEach((v) => {
      const lat = parseFloat(v.latitude);
      const lng = parseFloat(v.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const icon = createCustomPin(v.venue_type, v.verification_status);
      const marker = L.marker([lat, lng], { icon }).addTo(map);

      const statusBadge = v.verification_status === 'AI_VERIFIED'
        ? '<span style="background: #064e3b; color: #6ee7b7; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold;">AI VERIFIED</span>'
        : `<span style="background: #78350f; color: #fde68a; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold;">${v.verification_status}</span>`;

      const popupHtml = `
        <div style="min-width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #f8fafc;">${v.name}</div>
          <div style="margin-bottom: 8px;">${statusBadge}</div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">📍 ${v.address}, ${v.city}</div>
          <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 8px;">
            ⭐ <strong>${v.average_rating || 0}</strong> | ${v.is_alcohol_free ? '🚫 Alcohol-Free' : 'Serves Alcohol'}
          </div>
          <a href="/venue/${v.id}" style="display: block; text-align: center; background: #059669; color: white; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 600; text-decoration: none; margin-top: 6px;">
            Inspect Profile & Cert
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectVenue) onSelectVenue(v);
      });

      markersRef.current.push(marker);
    });

    // If there are venues, fit bounds nicely
    if (venues.length > 0) {
      const group = new L.featureGroup(markersRef.current);
      try {
        map.fitBounds(group.getBounds().pad(0.15));
      } catch (e) {
        // ignore single point bounds error
      }
    }
  }, [venues, userCoords]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Legend Floating Pill */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel px-3 py-2 rounded-xl border border-white/10 flex items-center gap-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span>Steakhouse</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Cafe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
          <span>Bakery</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
}
