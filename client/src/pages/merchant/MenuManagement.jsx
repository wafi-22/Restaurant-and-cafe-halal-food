// client/src/pages/merchant/MenuManagement.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { UtensilsCrossed, Plus, Trash2, ArrowLeft, Building, WineOff, Check } from 'lucide-react';

export default function MenuManagement() {
  const [searchParams] = useSearchParams();
  const venueIdFromParam = searchParams.get('venue_id') || '';
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(venueIdFromParam);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // New item form
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Mains');
  const [isHalal, setIsHalal] = useState(true);
  const [containsAlcohol, setContainsAlcohol] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await api.venues.getMyVenues();
        if (res.venues) {
          setVenues(res.venues);
          if (!selectedVenueId && res.venues.length > 0) {
            setSelectedVenueId(res.venues[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load venues:', err);
      }
    }
    loadVenues();
  }, []);

  useEffect(() => {
    async function loadMenuItems() {
      if (!selectedVenueId) return;
      setLoading(true);
      try {
        const res = await api.menu.list(selectedVenueId);
        if (res.items) setItems(res.items);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenuItems();
  }, [selectedVenueId]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!name || !price || !selectedVenueId) return;

    setSubmitting(true);
    try {
      const res = await api.menu.create(selectedVenueId, {
        name,
        description,
        price: parseFloat(price),
        category,
        is_halal_certified: isHalal,
        contains_alcohol: containsAlcohol
      });

      if (res.item) {
        setItems((prev) => [...prev, res.item]);
        setShowAddModal(false);
        setName('');
        setDescription('');
        setPrice('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add dish.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to remove this dish?')) return;
    try {
      await api.menu.delete(selectedVenueId, itemId);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/merchant/dashboard"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Merchant Portal</span>
        </Link>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Dish</span>
        </button>
      </div>

      {/* Venue Selector */}
      {venues.length > 1 && (
        <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            <span>Active Establishment:</span>
          </label>
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
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

      {/* Menu Items Table / Cards */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4 text-brand-400" />
            <span>Menu Items ({items.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading menu items...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <UtensilsCrossed className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No dishes registered yet.</p>
            <p className="text-xs text-slate-400">Add dishes with individual Halal supply-chain tags.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Dish</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-900/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    {item.is_halal_certified && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/30 font-bold">
                        Halal Certified
                      </span>
                    )}
                    {!item.contains_alcohol && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300">
                        Zero Alcohol
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-bold font-mono text-gold-400 text-sm">
                    ${parseFloat(item.price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-elevated p-6 rounded-2xl max-w-md w-full border border-white/20 space-y-4">
            <h3 className="font-bold text-base text-white">Add New Dish</h3>

            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dry-Aged Ribeye or Saffron Brioche"
                  className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Description</label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients and culinary preparation..."
                  className="w-full p-2.5 text-xs rounded-xl glass-input text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="24.50"
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl glass-input text-white"
                  >
                    <option value="Starters" className="bg-slate-900">Starters</option>
                    <option value="Mains" className="bg-slate-900">Mains</option>
                    <option value="Steaks & Grills" className="bg-slate-900">Steaks & Grills</option>
                    <option value="Desserts" className="bg-slate-900">Desserts</option>
                    <option value="Artisan Mocktails" className="bg-slate-900">Artisan Mocktails</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isHalal}
                    onChange={(e) => setIsHalal(e.target.checked)}
                    className="rounded text-brand-600 w-4 h-4"
                  />
                  <span>100% Halal Certified Meat / Ingredients</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={containsAlcohol}
                    onChange={(e) => setContainsAlcohol(e.target.checked)}
                    className="rounded text-rose-500 w-4 h-4"
                  />
                  <span className="text-rose-300">Contains Alcohol / Cooking Wine (if any)</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  {submitting ? 'Adding...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
