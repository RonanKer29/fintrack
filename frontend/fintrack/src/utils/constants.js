export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PORTFOLIOS: '/portfolios',
  PORTFOLIO_DETAIL: '/portfolios/:id',
  NEW_TRANSACTION: '/transactions/new',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};

export const CHART_COLORS = {
  PRIMARY: '#facc15',
  SECONDARY: '#131314',
  SUCCESS: '#10b981',
  DANGER: '#ef4444',
  WARNING: '#f59e0b',
};