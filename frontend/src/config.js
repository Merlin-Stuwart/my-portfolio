// Centralized API configuration
// Environment detection using Vite's built-in flags:
// - Local development (import.meta.env.DEV): http://localhost:5000
// - Production deployment (import.meta.env.PROD): https://my-portfolio-backend-zegg.onrender.com

const isProduction = import.meta.env.PROD || !import.meta.env.DEV;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isProduction
    ? "https://my-portfolio-backend-zegg.onrender.com"
    : "http://localhost:5000");

export default API_BASE_URL;

