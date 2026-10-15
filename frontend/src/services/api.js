import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Intercepteur requête — injecte le JWT ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Intercepteur réponse — gère les 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirige seulement si ce n'est pas déjà la page de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
  getMe:    ()     => api.get('/auth/me'),
};

// ── Analyse ───────────────────────────────────────────────────────────────────
export const analysisAPI = {
  analyze: (text, language) =>
    api.post('/analysis/analyze', { text, language }),
};

// ── Historique ────────────────────────────────────────────────────────────────
export const historyAPI = {
  save:    (data) => api.post('/history',      data),
  getAll:  ()     => api.get('/history'),
  getById: (id)   => api.get(`/history/${id}`),
  delete:  (id)   => api.delete(`/history/${id}`),
};

export default api;
