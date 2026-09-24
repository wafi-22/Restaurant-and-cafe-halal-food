// server/routes/aiRoutes.js
import express from 'express';
import { AIAdvisorChatSchema } from '../../shared/schemas.js';
import { handleAdvisorQuery } from '../services/aiAdvisorService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/ai/advisor-chat
 * Submit query prompt + user coordinates -> live DB context synthesis -> Gemini 2.5 Flash response
 */
router.post('/advisor-chat', optionalAuth, async (req, res) => {
  try {
    const parseResult = AIAdvisorChatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid chat payload format',
        details: parseResult.error.format()
      });
    }

    const { message, user_lat, user_lng, selected_venue_id, chat_history } = parseResult.data;

    const response = await handleAdvisorQuery({
      message,
      user_lat,
      user_lng,
      selected_venue_id,
      chat_history
    });

    return res.json({
      success: true,
      reply: response.reply,
      recommendedVenues: response.recommendedVenues || [],
      source: response.source
    });
  } catch (error) {
    console.error('AI Advisor endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process AI dietary concierge query.'
    });
  }
});

export default router;
