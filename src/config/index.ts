// Environment variables with fallbacks
export const apiUrl = import.meta.env.VITE_API_URL || 'https://quizzo-realtime.onrender.com';
export const realtimeServerUrl = import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.onrender.com';

// Functions to get URLs
export const getApiUrl = () => apiUrl;
export const getRealtimeServerUrl = () => realtimeServerUrl; 