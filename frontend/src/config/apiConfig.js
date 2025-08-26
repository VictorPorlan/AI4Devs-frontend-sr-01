// API Configuration
export const API_CONFIG = {
  // Backend server URL
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3010',
  
  // API endpoints
  ENDPOINTS: {
    POSITIONS: {
      CANDIDATES: (id) => `/position/${id}/candidates`,
      INTERVIEW_FLOW: (id) => `/position/${id}/interviewflow`,
    },
    CANDIDATES: {
      UPDATE_STAGE: (id) => `/candidates/${id}`,
    }
  },
  
  // Feature flags
  FEATURES: {
    USE_REAL_API: true, // Set to false to use mock data
    ENABLE_DRAG_AND_DROP: true,
    ENABLE_REAL_TIME_UPDATES: false,
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
