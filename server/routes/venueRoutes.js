// server/routes/venueRoutes.js
import express from 'express';
import db, { calculateDistance } from '../config/db.js';
import { CreateVenueSchema, UpdateVenueSchema, QueryVenueSchema, CreateReviewSchema } from '../../shared/schemas.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * GET /api/venues
 * Query venues with spatial radius, category, halal classification, and verification filters
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const parseResult = QueryVenueSchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: parseResult.error.format()
      });
    }

    const {
      city,
      lat,
      lng,
      radius,
      venue_type,
      halal_classification,
      is_alcohol_free,
      has_prayer_space,
      is_hand_slaughtered_only,
      certifying_body_id,
      verification_status,
      search
    } = parseResult.data;

    const venuesResult = await db.query('SELECT * FROM venues');
    let venues = venuesResult.rows || [];

    // Filter in-memory or augmented logic
    if (city) {
      const targetCity = city.toLowerCase();
      venues = venues.filter(v => v.city && v.city.toLowerCase().includes(targetCity));
    }

    if (venue_type) {
      venues = venues.filter(v => v.venue_type === venue_type);
    }

    if (halal_classification) {
      venues = venues.filter(v => v.halal_classification === halal_classification);
    }

    if (is_alcohol_free !== undefined) {
      venues = venues.filter(v => Boolean(v.is_alcohol_free) === Boolean(is_alcohol_free));
    }

    if (has_prayer_space !== undefined) {
      venues = venues.filter(v => Boolean(v.has_prayer_space) === Boolean(has_prayer_space));
    }

    if (is_hand_slaughtered_only !== undefined) {
      venues = venues.filter(v => Boolean(v.is_hand_slaughtered_only) === Boolean(is_hand_slaughtered_only));
    }

    if (verification_status) {
      venues = venues.filter(v => v.verification_status === verification_status);
    }

    if (search) {
      const q = search.toLowerCase();
      venues = venues.filter(v =>
        v.name.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.city && v.city.toLowerCase().includes(q)) ||
        (v.address && v.address.toLowerCase().includes(q))
      );
    }

    // Attach distance and filter by radius if coordinates supplied
    if (lat !== undefined && lng !== undefined) {
      venues = venues
        .map(v => {
          const dist = calculateDistance(lat, lng, parseFloat(v.latitude), parseFloat(v.longitude));
          return { ...v, distance_km: dist };
        })
        .filter(v => (radius ? v.distance_km <= radius : true))
        .sort((a, b) => a.distance_km - b.distance_km);
    }

    return res.json({
      success: true,
      count: venues.length,
      venues
    });
  } catch (error) {
    console.error('Error fetching venues:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve venues.'
    });
  }
});

/**
 * GET /api/venues/merchant/my-venues
 * Fetch venues owned by the current authenticated merchant
 */
router.get('/merchant/my-venues', requireAuth, requireRole(['merchant', 'admin']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM venues WHERE owner_id = $1', [req.user.id]);
    return res.json({
      success: true,
      venues: result.rows || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve merchant venues.'
    });
  }
});

/**
 * GET /api/venues/:id
 * Fetch detailed venue profile with active certificate, menu items, and community reviews
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const venueId = req.params.id;
    const venueResult = await db.query('SELECT * FROM venues WHERE v.id = $1', [venueId]);
    const venue = venueResult.rows?.[0];

    if (!venue) {
      return res.status(404).json({
        success: false,
        error: 'Venue not found.'
      });
    }

    // Fetch active certificates
    const certsResult = await db.query('SELECT * FROM halal_certificates WHERE venue_id = $1', [venue.id]);
    const certificates = certsResult.rows || [];

    // Fetch menu items
    const menuResult = await db.query('SELECT * FROM menu_items WHERE venue_id = $1', [venue.id]);
    const menu_items = menuResult.rows || [];

    // Fetch reviews
    const reviewsResult = await db.query('SELECT * FROM reviews WHERE venue_id = $1', [venue.id]);
    const reviews = reviewsResult.rows || [];

    return res.json({
      success: true,
      venue: {
        ...venue,
        certificates,
        menu_items,
        reviews
      }
    });
  } catch (error) {
    console.error('Error fetching venue details:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve venue profile.'
    });
  }
});

/**
 * POST /api/venues
 * Merchant venue creation
 */
router.post('/', requireAuth, requireRole(['merchant', 'admin']), async (req, res) => {
  try {
    const parseResult = CreateVenueSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const data = parseResult.data;
    const venueId = crypto.randomUUID();
    const baseSlug = slugify(data.name);
    const slug = `${baseSlug}-${venueId.slice(0, 6)}`;

    const insertResult = await db.query(
      `INSERT INTO venues (
        id, owner_id, name, slug, venue_type, halal_classification,
        description, address, city, state, postal_code, country,
        latitude, longitude, phone_number, website_url, image_url,
        is_alcohol_free, has_prayer_space, has_separate_prep_area,
        is_hand_slaughtered_only, verification_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [
        venueId,
        req.user.id,
        data.name,
        slug,
        data.venue_type,
        data.halal_classification,
        data.description || '',
        data.address,
        data.city,
        data.state || '',
        data.postal_code || '',
        data.country,
        data.latitude,
        data.longitude,
        data.phone_number || '',
        data.website_url || '',
        req.body.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=80',
        data.is_alcohol_free,
        data.has_prayer_space,
        data.has_separate_prep_area,
        data.is_hand_slaughtered_only,
        'UNVERIFIED'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Venue profile created successfully. Upload a Halal certificate for automated verification.',
      venue: insertResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating venue:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create venue profile.'
    });
  }
});

/**
 * PUT /api/venues/:id
 * Merchant / Admin update venue profile
 */
router.put('/:id', requireAuth, requireRole(['merchant', 'admin']), async (req, res) => {
  try {
    const venueId = req.params.id;
    const existing = await db.query('SELECT * FROM venues WHERE v.id = $1', [venueId]);
    const venue = existing.rows?.[0];

    if (!venue) {
      return res.status(404).json({ success: false, error: 'Venue not found.' });
    }

    // Merchant ownership check (unless admin)
    if (req.user.role !== 'admin' && venue.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden. You are not authorized to edit this venue.'
      });
    }

    const parseResult = UpdateVenueSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const data = parseResult.data;

    // Merge changes
    const updated = {
      ...venue,
      ...data,
      image_url: req.body.image_url || venue.image_url
    };

    // Update in database store
    const store = db.getMemoryStore();
    const index = store.venues.findIndex(v => v.id === venue.id);
    if (index !== -1) {
      store.venues[index] = updated;
    }

    return res.json({
      success: true,
      message: 'Venue details updated successfully.',
      venue: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update venue.'
    });
  }
});

/**
 * POST /api/venues/:id/reviews
 * Submit community review
 */
router.post('/:id/reviews', requireAuth, async (req, res) => {
  try {
    const venueId = req.params.id;
    const payload = { ...req.body, venue_id: venueId };

    const parseResult = CreateReviewSchema.safeParse(payload);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const { rating, comment, halal_authenticity_rating, photo_urls } = parseResult.data;

    const insertResult = await db.query(
      `INSERT INTO reviews (venue_id, user_id, rating, comment, halal_authenticity_rating, photo_urls)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [venueId, req.user.id, rating, comment, halal_authenticity_rating, photo_urls]
    );

    return res.status(201).json({
      success: true,
      message: 'Review posted successfully.',
      review: insertResult.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to post review.'
    });
  }
});

export default router;
