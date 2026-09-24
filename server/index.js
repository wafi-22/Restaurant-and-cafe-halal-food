// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import certifierRoutes from './routes/certifierRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Traffic Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));

// Rate limiting for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests created from this IP, please try again after 15 minutes.'
  }
});
app.use('/api', apiLimiter);

// Specific stricter limiter for AI endpoints to prevent quota exhaustion
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 AI requests per minute
  message: {
    success: false,
    error: 'AI request rate limit reached. Please wait a moment before sending another query.'
  }
});
app.use('/api/ai', aiLimiter);

// Mount API Controllers
app.use('/api/auth', authRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/certifiers', certifierRoutes);
app.use('/api/venues/:venueId/menu', menuRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Halal Dining & AI Certificate Verification Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0-production'
  });
});

// Centralized Async Error Boundary
app.use((err, req, res, next) => {
  console.error('Unhandled Application Exception:', err.stack || err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

// Boot Server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`================================================================`);
      console.log(` HALAL DINING & CERTIFICATE VERIFICATION ENGINE IS ACTIVE`);
      console.log(` Server Port:     http://localhost:${PORT}`);
      console.log(` Health Check:    http://localhost:${PORT}/api/health`);
      console.log(` Ready for AI Optical Scans & Geospatial Dining Inquiries`);
      console.log(`================================================================`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
}

startServer();
