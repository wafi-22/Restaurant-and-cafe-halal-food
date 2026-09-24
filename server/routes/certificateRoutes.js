// server/routes/certificateRoutes.js
import express from 'express';
import db from '../config/db.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { uploadCertificate } from '../middleware/upload.js';
import { analyzeHalalCertificate } from '../services/visionService.js';

const router = express.Router();

/**
 * POST /api/certificates/upload
 * [Merchant Protected]
 * Process certificate upload, run Gemini Vision AI OCR verification, update database
 */
router.post('/upload', requireAuth, requireRole(['merchant', 'admin']), uploadCertificate.single('certificate'), async (req, res) => {
  try {
    const { venue_id, certifying_body_id } = req.body;

    if (!venue_id) {
      return res.status(400).json({ success: false, error: 'venue_id is required.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No document file uploaded.' });
    }

    // Check venue existence and authorization
    const venueResult = await db.query('SELECT * FROM venues WHERE v.id = $1', [venue_id]);
    const venue = venueResult.rows?.[0];

    if (!venue) {
      return res.status(404).json({ success: false, error: 'Venue not found.' });
    }

    if (req.user.role !== 'admin' && venue.owner_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'You are not authorized to upload certificates for this venue.' });
    }

    // 1. Run Gemini 2.5 Flash Vision OCR analysis
    const aiAnalysis = await analyzeHalalCertificate(
      req.file.buffer,
      req.file.mimetype,
      venue.name,
      req.file.originalname
    );

    // 2. Determine verification status based on zero-trust checkpoints
    let verificationStatus = 'PENDING_HUMAN_REVIEW';
    let isActive = false;

    if (aiAnalysis.is_expired) {
      verificationStatus = 'EXPIRED';
      isActive = false;
    } else if (aiAnalysis.is_valid_halal_certificate && aiAnalysis.confidence_score >= 80 && aiAnalysis.venue_name_matches) {
      verificationStatus = 'AI_VERIFIED';
      isActive = true;
    } else if (aiAnalysis.confidence_score < 40) {
      verificationStatus = 'REJECTED';
      isActive = false;
    } else {
      verificationStatus = 'PENDING_HUMAN_REVIEW';
      isActive = false;
    }

    // In a cloud deployment, upload to S3/GCS. For now, generate a secure document data URL or preview URL
    const base64Data = req.file.buffer.toString('base64');
    const documentUrl = `data:${req.file.mimetype};base64,${base64Data}`;

    // 3. Match or infer Certifying Body
    let resolvedCertifierId = certifying_body_id || null;
    if (!resolvedCertifierId && aiAnalysis.certifying_body_name) {
      const cbList = await db.query('SELECT * FROM certifying_bodies');
      const found = (cbList.rows || []).find(cb =>
        aiAnalysis.certifying_body_name.toLowerCase().includes(cb.short_code.toLowerCase()) ||
        cb.name.toLowerCase().includes(aiAnalysis.certifying_body_name.toLowerCase())
      );
      if (found) resolvedCertifierId = found.id;
    }

    const certificateId = crypto.randomUUID();

    // 4. Save certificate record
    const insertCertResult = await db.query(
      `INSERT INTO halal_certificates (
        id, venue_id, certifying_body_id, certificate_number,
        issued_date, expiration_date, document_url, ai_raw_extraction,
        ai_confidence_score, is_active, verified_by_admin_id, verified_at, rejection_reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        certificateId,
        venue.id,
        resolvedCertifierId,
        aiAnalysis.certificate_id || `CERT-${Date.now()}`,
        aiAnalysis.issue_date || new Date().toISOString().split('T')[0],
        aiAnalysis.expiration_date,
        documentUrl,
        JSON.stringify(aiAnalysis),
        aiAnalysis.confidence_score,
        isActive,
        null,
        null,
        aiAnalysis.detected_flags.length > 0 ? aiAnalysis.detected_flags.join(', ') : null
      ]
    );

    // 5. Update venue verification status
    const store = db.getMemoryStore();
    const vIndex = store.venues.findIndex(v => v.id === venue.id);
    if (vIndex !== -1) {
      store.venues[vIndex].verification_status = verificationStatus;
    }

    return res.status(201).json({
      success: true,
      message: `Certificate processed. Verification Status: ${verificationStatus} (${aiAnalysis.confidence_score}% Confidence)`,
      verification_status: verificationStatus,
      ai_analysis: aiAnalysis,
      certificate: insertCertResult.rows[0]
    });
  } catch (error) {
    console.error('Error during certificate upload and AI verification:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process certificate document.'
    });
  }
});

/**
 * GET /api/certificates/venue/:venueId
 * Fetch all certificates for a venue
 */
router.get('/venue/:venueId', async (req, res) => {
  try {
    const certsResult = await db.query('SELECT * FROM halal_certificates WHERE venue_id = $1', [req.params.venueId]);
    return res.json({
      success: true,
      certificates: certsResult.rows || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve certificates.'
    });
  }
});

/**
 * GET /api/certificates/audit-queue
 * [Admin Protected]
 * Fetch flagged or pending certificates for human review
 */
router.get('/audit-queue', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM halal_certificates WHERE is_active = false OR ai_confidence_score < 80');
    return res.json({
      success: true,
      audit_queue: result.rows || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve audit queue.'
    });
  }
});

/**
 * POST /api/certificates/:id/admin-verify
 * [Admin Protected]
 * Human Auditor status override
 */
router.post('/:id/admin-verify', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const certId = req.params.id;
    const { is_active, rejection_reason, confidence_override } = req.body;

    const certResult = await db.query('SELECT * FROM halal_certificates WHERE id = $1', [certId]);
    const cert = certResult.rows?.[0];

    if (!cert) {
      return res.status(404).json({ success: false, error: 'Certificate record not found.' });
    }

    const updated = await db.query(
      `UPDATE halal_certificates
       SET is_active = $1, verified_by_admin_id = $2, rejection_reason = $3
       WHERE id = $4 RETURNING *`,
      [is_active === true, req.user.id, rejection_reason || null, certId]
    );

    return res.json({
      success: true,
      message: is_active ? 'Certificate approved by auditor.' : 'Certificate marked as rejected.',
      certificate: updated.rows[0]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to update certificate verification status.'
    });
  }
});

export default router;
