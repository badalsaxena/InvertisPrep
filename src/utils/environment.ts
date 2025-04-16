/**
 * Environment variables utility for Quizzo application
 */

/**
 * Get the API URL from environment variables with fallback
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'https://quizzo-realtime.vercel.app';
};

/**
 * Get the WebSocket server URL from environment variables with fallback
 */
export const getRealtimeServerUrl = (): string => {
  return import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.vercel.app';
}; 