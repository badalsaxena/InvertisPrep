// Environment variables with fallbacks
export const apiUrl = import.meta.env.VITE_API_URL || 'https://quizzo-realtime.vercel.app';
export const realtimeServerUrl = import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.vercel.app';

// Functions to get URLs
export const getApiUrl = () => apiUrl;
export const getRealtimeServerUrl = () => realtimeServerUrl; 