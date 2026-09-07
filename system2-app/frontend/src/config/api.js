// Base URL for HeatScape Backend API
// Set to http://localhost:8000 for local development
// Update to your Render backend URL once deployed (e.g. "https://heatscape-api.onrender.com")
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ENDPOINTS = {
  HOTSPOTS: `${API_BASE_URL}/api/hotspots`,
  GRID_CELL: (id) => `${API_BASE_URL}/api/grid/${id}`,
  TIER2_AI: (id) => `${API_BASE_URL}/api/tier2/${id}`,
  OPTIMIZE_BUDGET: `${API_BASE_URL}/api/optimize-budget`,
  HEALTH: `${API_BASE_URL}/api/health`,
};
