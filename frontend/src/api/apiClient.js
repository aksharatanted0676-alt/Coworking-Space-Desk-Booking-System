const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP error! Status: ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authAPI = {
  login: (email, password) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getMe: () => apiFetch('/auth/me', { method: 'GET' })
};

export const deskAPI = {
  getAllDesks: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.zone) params.append('zone', filters.zone);
    if (filters.status) params.append('status', filters.status);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return apiFetch(`/desks${queryString}`, { method: 'GET' });
  },
  getAvailableDesks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.startTime) query.append('startTime', params.startTime);
    if (params.endTime) query.append('endTime', params.endTime);
    if (params.date) query.append('date', params.date);
    if (params.zone) query.append('zone', params.zone);
    return apiFetch(`/desks/available?${query.toString()}`, { method: 'GET' });
  },
  getDeskById: (id) => apiFetch(`/desks/${id}`, { method: 'GET' }),
  createDesk: (deskData) => apiFetch('/desks', {
    method: 'POST',
    body: JSON.stringify(deskData)
  }),
  updateDesk: (id, deskData) => apiFetch(`/desks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deskData)
  }),
  deleteDesk: (id) => apiFetch(`/desks/${id}`, { method: 'DELETE' })
};

export const bookingAPI = {
  createBooking: (bookingData) => apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  getBookings: (filters = {}) => {
    const query = new URLSearchParams();
    if (filters.status) query.append('status', filters.status);
    if (filters.deskId) query.append('deskId', filters.deskId);
    if (filters.date) query.append('date', filters.date);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiFetch(`/bookings${queryString}`, { method: 'GET' });
  },
  getBookingById: (id) => apiFetch(`/bookings/${id}`, { method: 'GET' }),
  cancelBooking: (id) => apiFetch(`/bookings/${id}/cancel`, { method: 'PUT' })
};

export const occupancyAPI = {
  getDailyOccupancy: (dateStr) => {
    const query = dateStr ? `?date=${dateStr}` : '';
    return apiFetch(`/occupancy${query}`, { method: 'GET' });
  }
};
