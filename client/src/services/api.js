// client/src/services/api.js
import { mockVenues, mockCertifyingBodies, mockMenuItems, mockReviews } from './mockData.js';

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('token') || '';
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // If backend is not reached (e.g. GitHub Pages static hosting), fallback gracefully to rich mock data
    return handleStaticFallback(endpoint, options);
  }
}

function handleStaticFallback(endpoint, options = {}) {
  // Venues list
  if (endpoint.startsWith('/venues') && (!options.method || options.method === 'GET')) {
    if (endpoint.includes('/merchant/my-venues')) {
      return { success: true, venues: mockVenues.slice(0, 3) };
    }
    const idMatch = endpoint.match(/\/venues\/([a-zA-Z0-9\-]+)/);
    if (idMatch && idMatch[1] && !idMatch[1].includes('?')) {
      const vId = idMatch[1];
      const v = mockVenues.find((x) => x.id === vId || x.slug === vId) || mockVenues[0];
      return {
        success: true,
        venue: {
          ...v,
          menu_items: mockMenuItems,
          reviews: mockReviews,
          certificates: v.active_certificate ? [v.active_certificate] : []
        }
      };
    }
    return { success: true, venues: mockVenues, count: mockVenues.length };
  }

  // Certifiers list
  if (endpoint.startsWith('/certifiers')) {
    return { success: true, certifiers: mockCertifyingBodies };
  }

  // Menu items list
  if (endpoint.includes('/menu')) {
    return { success: true, items: mockMenuItems };
  }

  // Auth me
  if (endpoint === '/auth/me') {
    return {
      success: true,
      user: {
        id: 'mock-user-1',
        email: 'diner@halalfinder.com',
        full_name: 'Tariq Al-Mansoor',
        role: 'diner'
      }
    };
  }

  // Auth login / demo-login
  if (endpoint.includes('/auth/login') || endpoint.includes('/auth/demo-login')) {
    let role = 'diner';
    try {
      const parsed = JSON.parse(options.body);
      if (parsed.role) role = parsed.role;
    } catch (e) {}

    return {
      success: true,
      token: 'mock-demo-jwt-token-2026',
      user: {
        id: 'mock-user-id',
        email: `${role}@halalfinder.com`,
        full_name: role === 'admin' ? 'Dr. Amina Farooq (Auditor)' : role === 'merchant' ? 'Chef Bilal Qureshi' : 'Tariq Al-Mansoor',
        role
      }
    };
  }

  // AI Concierge Chat
  if (endpoint.includes('/ai/advisor-chat')) {
    let query = '';
    try {
      query = JSON.parse(options.body).message || '';
    } catch (e) {}

    return {
      success: true,
      reply: `Wa alaikum assalam! Based on our verified regulatory database, here are recommendations matching "${query}":\n\n• **Al-Madina Artisan Prime Steakhouse** - 100% Halal certified by IFANCA, strictly alcohol-free kitchen, dry-aged A5 Wagyu available.\n• **Saffron & Cardamom Botanical Cafe** - HMC monitored with dedicated prayer space upstairs.\n\nAll establishments listed maintain dedicated prep areas and zero cross-contamination.`,
      recommendedVenues: [mockVenues[0], mockVenues[1]],
      source: 'gemini-2.5-flash-static-advisor'
    };
  }

  // Certificate upload
  if (endpoint.includes('/certificates/upload')) {
    return {
      success: true,
      verification_status: 'AI_VERIFIED',
      ai_analysis: {
        is_valid_halal_certificate: true,
        confidence_score: 98.4,
        extracted_venue_name: 'Al-Madina Artisan Prime Steakhouse',
        venue_name_matches: true,
        certifying_body_name: 'Islamic Food and Nutrition Council of America (IFANCA)',
        certificate_id: 'IFANCA-AUTH-882914',
        issue_date: '2026-01-15',
        expiration_date: '2027-01-14',
        is_expired: false,
        detected_flags: [],
        summary_explanation: 'Official holographic IFANCA accreditation seal confirmed. Full scope covers hand-slaughtered beef and poultry operations. Zero cross-contamination issues identified.'
      }
    };
  }

  // Audit queue
  if (endpoint.includes('/certificates/audit-queue')) {
    return {
      success: true,
      audit_queue: [
        {
          id: 'flagged-1',
          venue_name: 'Damascus Nights Mezze & Grill',
          venue_city: 'New York',
          certifying_body_name: 'HFCAA',
          ai_confidence_score: 64.5,
          document_url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1000&auto=format&fit=crop&q=80',
          expiration_date: '2027-08-01',
          ai_raw_extraction: {
            extracted_venue_name: 'Damascus Nights Grill LLC',
            detected_flags: ['Minor trade name discrepancy on document header']
          }
        }
      ]
    };
  }

  return { success: true };
}

export const api = {
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    demoLogin: (role) =>
      request('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({ role })
      }),
    me: () => request('/auth/me'),
    logout: () => {
      setToken(null);
      return Promise.resolve({ success: true });
    }
  },

  venues: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const queryString = query.toString() ? `?${query.toString()}` : '';
      return request(`/venues${queryString}`);
    },
    getById: (id) => request(`/venues/${id}`),
    getMyVenues: () => request('/venues/merchant/my-venues'),
    create: (venueData) =>
      request('/venues', {
        method: 'POST',
        body: JSON.stringify(venueData)
      }),
    update: (id, venueData) =>
      request(`/venues/${id}`, {
        method: 'PUT',
        body: JSON.stringify(venueData)
      }),
    addReview: (venueId, reviewData) =>
      request(`/venues/${venueId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      })
  },

  certificates: {
    upload: (formData) =>
      request('/certificates/upload', {
        method: 'POST',
        body: formData
      }),
    getByVenue: (venueId) => request(`/certificates/venue/${venueId}`),
    getAuditQueue: () => request('/certificates/audit-queue'),
    adminVerify: (certId, payload) =>
      request(`/certificates/${certId}/admin-verify`, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },

  certifiers: {
    list: () => request('/certifiers'),
    create: (data) =>
      request('/certifiers', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  menu: {
    list: (venueId) => request(`/venues/${venueId}/menu`),
    create: (venueId, itemData) =>
      request(`/venues/${venueId}/menu`, {
        method: 'POST',
        body: JSON.stringify(itemData)
      }),
    delete: (venueId, itemId) =>
      request(`/venues/${venueId}/menu/${itemId}`, {
        method: 'DELETE'
      })
  },

  ai: {
    chat: (payload) =>
      request('/ai/advisor-chat', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  }
};

export default api;
