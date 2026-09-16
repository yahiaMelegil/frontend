import { apiClient } from '../../api/client';

const BASE = '/api/admin/auth';

export const adminAuthService = Object.freeze({
  login: (data) => apiClient.post(`${BASE}/login`, data),
  me: () => apiClient.get(`${BASE}/me`, { authType: 'admin' }),
  logout: () => apiClient.post(`${BASE}/logout`, undefined, { authType: 'admin' }),
  logoutAll: () => apiClient.post(`${BASE}/logout-all`, undefined, { authType: 'admin' }),
});
