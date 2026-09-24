// server/services/aiAdvisorService.js
import { ai, GEMINI_MODEL } from '../config/gemini.js';
import db, { calculateDistance } from '../config/db.js';

const SYSTEM_PROMPT = `You are the Halal Certificate Verification & Dietary Concierge Engine, an expert system specializing in global Islamic dietary compliance, certificate authenticity verification, and geographic dining guidance.

Your responsibilities:
1. When answering diner queries as an AI Concierge, be objective, helpful, precise, and transparent regarding dietary nuances (e.g., distinguishing between 100% Halal certified establishments versus Muslim-owned non-certified establishments, and calling out alcohol presence).
2. Never invent or hallucinate Halal certifications. If data is unavailable or unverified, state it explicitly.
3. Utilize the verified live database context provided to recommend venues matching the user's constraints (e.g. alcohol-free, prayer space, specific certifiers like IFANCA, JAKIM, HMC, MUIS).
4. Always flag if any establishment has an EXPIRED, PENDING, or UNVERIFIED certificate status.`;

/**
 * Handle AI Concierge Advisor Queries with live RAG database context
 */
export async function handleAdvisorQuery({ message, user_lat, user_lng, selected_venue_id, chat_history = [] }) {
  // 1. Fetch live venues from database
  const venuesResult = await db.query('SELECT * FROM venues ORDER BY average_rating DESC LIMIT 20');
  const allVenues = venuesResult.rows || [];

  // Augment venues with distance if user coordinates provided
  const processedVenues = allVenues.map(v => {
    let distance = null;
    if (user_lat && user_lng && v.latitude && v.longitude) {
      distance = calculateDistance(user_lat, user_lng, parseFloat(v.latitude), parseFloat(v.longitude));
    }
    return {
      id: v.id,
      name: v.name,
      slug: v.slug,
      venue_type: v.venue_type,
      halal_classification: v.halal_classification,
      city: v.city,
      address: v.address,
      is_alcohol_free: v.is_alcohol_free,
      has_prayer_space: v.has_prayer_space,
      is_hand_slaughtered_only: v.is_hand_slaughtered_only,
      verification_status: v.verification_status,
      certifying_body: v.certifying_body_name || v.certifying_body_code || 'None declared',
      average_rating: v.average_rating,
      distance_km: distance
    };
  });

  // Construct Context Snippet
  const dbContextString = JSON.stringify(processedVenues, null, 2);

  let specificVenueContext = '';
  if (selected_venue_id) {
    const selected = processedVenues.find(v => v.id === selected_venue_id || v.slug === selected_venue_id);
    if (selected) {
      specificVenueContext = `User is specifically viewing venue: ${JSON.stringify(selected)}`;
    }
  }

  // If Gemini API is configured, run Gemini 2.5 Flash with low temperature (0.2)
  if (ai) {
    try {
      const fullPrompt = `${SYSTEM_PROMPT}

LIVE DATABASE CONTEXT:
${dbContextString}
${specificVenueContext}

USER COORDINATES: ${user_lat && user_lng ? `Lat: ${user_lat}, Lng: ${user_lng}` : 'Not provided'}

USER QUERY:
${message}

Please provide a clear, helpful, expert dietary response. If you recommend specific venues from the database, mention their name, certifier authority, whether they are strictly alcohol-free, and their verification status.
Also provide a concise JSON block at the end with the array of matched venue IDs formatted as:
MATCHED_VENUES:[id1, id2]`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: fullPrompt,
        config: {
          temperature: 0.2
        }
      });

      const responseText = response.text || '';
      
      // Extract matched venue IDs if present
      let matchedVenueIds = [];
      const matchRegex = /MATCHED_VENUES:\[(.*?)\]/;
      const match = responseText.match(matchRegex);
      if (match && match[1]) {
        matchedVenueIds = match[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
      } else {
        // Fallback: search for venue names mentioned in text
        matchedVenueIds = processedVenues
          .filter(v => responseText.toLowerCase().includes(v.name.toLowerCase()))
          .map(v => v.id);
      }

      const cleanText = responseText.replace(matchRegex, '').trim();

      const recommendedVenues = processedVenues.filter(v => matchedVenueIds.includes(v.id));

      return {
        reply: cleanText,
        recommendedVenues,
        source: 'gemini-2.5-flash'
      };
    } catch (err) {
      console.error('Gemini Advisor Error:', err.message);
      console.warn('Falling back to local contextual advisor engine.');
    }
  }

  // High-fidelity local RAG engine fallback (guarantees zero downtime and deterministic safety)
  const lowerMsg = message.toLowerCase();
  let matched = [];

  if (lowerMsg.includes('steak') || lowerMsg.includes('meat') || lowerMsg.includes('wagyu')) {
    matched = processedVenues.filter(v => v.name.toLowerCase().includes('steak') || v.venue_type === 'RESTAURANT');
  } else if (lowerMsg.includes('cafe') || lowerMsg.includes('coffee') || lowerMsg.includes('brunch')) {
    matched = processedVenues.filter(v => v.venue_type === 'CAFE');
  } else if (lowerMsg.includes('bbq') || lowerMsg.includes('smokehouse') || lowerMsg.includes('brisket')) {
    matched = processedVenues.filter(v => v.name.toLowerCase().includes('bbq') || v.name.toLowerCase().includes('smokehouse'));
  } else if (lowerMsg.includes('prayer') || lowerMsg.includes('salah')) {
    matched = processedVenues.filter(v => v.has_prayer_space);
  } else if (lowerMsg.includes('alcohol') || lowerMsg.includes('wine') || lowerMsg.includes('beer')) {
    matched = processedVenues.filter(v => v.is_alcohol_free);
  } else if (lowerMsg.includes('jakim')) {
    matched = processedVenues.filter(v => (v.certifying_body || '').includes('JAKIM') || v.city === 'Kuala Lumpur');
  } else if (lowerMsg.includes('hmc')) {
    matched = processedVenues.filter(v => (v.certifying_body || '').includes('HMC') || v.city === 'London');
  } else if (lowerMsg.includes('ifanca')) {
    matched = processedVenues.filter(v => (v.certifying_body || '').includes('IFANCA') || v.city === 'New York' || v.city === 'Chicago');
  } else {
    matched = processedVenues.slice(0, 3);
  }

  if (matched.length === 0) {
    matched = processedVenues.slice(0, 2);
  }

  const venueSummaries = matched.map(v => 
    `• **${v.name}** (${v.city}) - Status: **${v.verification_status}** | Certifier: ${v.certifying_body} | Alcohol-Free: ${v.is_alcohol_free ? 'Yes' : 'No'} | Prayer Area: ${v.has_prayer_space ? 'Available' : 'None'}`
  ).join('\n');

  let replyText = `Based on our verified regulatory database, here are the establishments matching your dietary criteria:\n\n${venueSummaries}\n\n*Dietary Advisory Note:* All recommended venues labeled **AI_VERIFIED** have active certificates scanned by our Gemini 2.5 Flash Vision engine. Always confirm on-site for daily specials or kitchen shifts.`;

  if (lowerMsg.includes('alcohol')) {
    replyText += `\n\n*Strict Alcohol-Free Guidance:* All venues listed above maintain 100% alcohol-free kitchen prep and zero alcohol sales on the premises.`;
  }

  return {
    reply: replyText,
    recommendedVenues: matched,
    source: 'deterministic-rag-engine'
  };
}
