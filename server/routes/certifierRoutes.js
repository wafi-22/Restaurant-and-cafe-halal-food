// server/routes/certifierRoutes.js
import express from 'express';
import db from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/certifiers
 * Fetch list of recognized Halal Certifying Bodies
 */
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM certifying_bodies ORDER BY is_globally_recognized DESC, name ASC');
    return res.json({
      success: true,
      certifiers: result.rows || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve certifying bodies directory.'
    });
  }
});

/**
 * POST /api/certifiers
 * [Admin Protected] Add new certifying authority
 */
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { name, short_code, country, website_url, is_globally_recognized } = req.body;
    if (!name || !short_code || !country) {
      return res.status(400).json({ success: false, error: 'Name, short_code, and country are required.' });
    }

    const insertResult = await db.query(
      `INSERT INTO certifying_bodies (name, short_code, country, website_url, is_globally_recognized)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, short_code, country, website_url || null, is_globally_recognized !== false]
    );

    return res.status(201).json({
      success: true,
      message: 'Certifying body registered successfully.',
      certifier: insertResult.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to register certifying body.'
    });
  }
});

export default router;
