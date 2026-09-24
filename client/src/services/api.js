// client/src/services/api.js

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

  // If not FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Authentication
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
      return request('/auth/logout', { method: 'POST' });
    }
  },

  // Venues
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

  // Certificates & AI Vision
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

  // Certifiers
  certifiers: {
    list: () => request('/certifiers'),
    create: (data) =>
      request('/certifiers', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },

  // Menu items
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

  // AI Concierge
  ai: {
    chat: (payload) =>
      request('/ai/advisor-chat', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  }
};

export default api;
