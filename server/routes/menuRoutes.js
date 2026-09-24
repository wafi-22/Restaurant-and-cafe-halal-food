// server/routes/menuRoutes.js
import express from 'express';
import db from '../config/db.js';
import { MenuItemSchema } from '../../shared/schemas.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true });

/**
 * GET /api/venues/:venueId/menu
 * List menu items for a venue
 */
router.get('/', async (req, res) => {
  try {
    const { venueId } = req.params;
    const result = await db.query('SELECT * FROM menu_items WHERE venue_id = $1 ORDER BY category ASC, name ASC', [venueId]);
    return res.json({
      success: true,
      items: result.rows || []
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve menu items.' });
  }
});

/**
 * POST /api/venues/:venueId/menu
 * [Merchant Protected] Add dish to menu
 */
router.post('/', requireAuth, requireRole(['merchant', 'admin']), async (req, res) => {
  try {
    const { venueId } = req.params;
    const parseResult = MenuItemSchema.safeParse({ ...req.body, venue_id: venueId });

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const { name, description, price, category, is_halal_certified, contains_alcohol, image_url } = parseResult.data;

    const insertResult = await db.query(
      `INSERT INTO menu_items (venue_id, name, description, price, category, is_halal_certified, contains_alcohol, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [venueId, name, description, price, category, is_halal_certified, contains_alcohol, image_url || '']
    );

    return res.status(201).json({
      success: true,
      message: 'Menu item created successfully.',
      item: insertResult.rows[0]
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to add menu item.' });
  }
});

/**
 * DELETE /api/venues/:venueId/menu/:itemId
 * [Merchant Protected] Remove dish from menu
 */
router.delete('/:itemId', requireAuth, requireRole(['merchant', 'admin']), async (req, res) => {
  try {
    const { itemId } = req.params;
    await db.query('DELETE FROM menu_items WHERE id = $1', [itemId]);
    return res.json({
      success: true,
      message: 'Menu item removed.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete menu item.' });
  }
});

export default router;
