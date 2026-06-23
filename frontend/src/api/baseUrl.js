const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ROOT = rawApiBaseUrl
  .replace(/\/+$/, '')
  .replace(/\/books$/, '')
  .replace(/\/auth$/, '');

export const BOOKS_URL = `${API_ROOT}/books`;
export const AUTH_URL = `${API_ROOT}/auth`;
