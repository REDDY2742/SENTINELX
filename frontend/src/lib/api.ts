/**
 * Central API configuration.
 * All base URLs are derived from the VITE_API_URL environment variable.
 * In development: set VITE_API_URL in .env
 * In production:  set VITE_API_URL in Amplify environment variables
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sentinelxbank.vercel.app';

export const WS_BASE_URL = API_BASE_URL
  .replace(/^http:\/\//, 'ws://')
  .replace(/^https:\/\//, 'wss://');
