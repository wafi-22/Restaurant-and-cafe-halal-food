// server/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';
import { RegisterUserSchema, LoginUserSchema } from '../../shared/schemas.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Create a new user (diner or merchant)
 */
router.post('/register', async (req, res) => {
  try {
    const parseResult = RegisterUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const { email, password, full_name, role } = parseResult.data;

    // Check if user already exists
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows && existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email address already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    const insertResult = await db.query(
      'INSERT INTO users (id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role, created_at',
      [userId, email.toLowerCase(), passwordHash, full_name, role]
    );

    const newUser = insertResult.rows[0];
    const token = signToken(newUser);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred during registration.'
    });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and issue JWT
 */
router.post('/login', async (req, res) => {
  try {
    const parseResult = LoginUserSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parseResult.error.format()
      });
    }

    const { email, password } = parseResult.data;

    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = userResult.rows?.[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email credentials or account does not exist.'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        error: 'Invalid password credentials.'
      });
    }

    const token = signToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred during login.'
    });
  }
});

/**
 * POST /api/auth/demo-login
 * Instant one-click authentication for Diner, Merchant, or Admin roles
 */
router.post('/demo-login', async (req, res) => {
  const { role } = req.body;
  const targetEmail =
    role === 'admin'
      ? 'admin@halalfinder.com'
      : role === 'merchant'
      ? 'merchant@halalfinder.com'
      : 'diner@halalfinder.com';

  const userResult = await db.query('SELECT * FROM users WHERE email = $1', [targetEmail]);
  const user = userResult.rows?.[0];

  if (!user) {
    return res.status(404).json({ success: false, error: 'Demo account not found.' });
  }

  const token = signToken(user);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    success: true,
    message: `Logged in as demo ${user.role}.`,
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    }
  });
});

/**
 * GET /api/auth/me
 * Fetch authenticated user profile
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, email, full_name, role, created_at FROM users WHERE id = $1', [
      req.user.id
    ]);
    const user = userResult.rows?.[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve user session.'
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

export default router;
