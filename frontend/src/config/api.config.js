// API Configuration
// Change these values when connecting to real backend

export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api',
  TIMEOUT: 30000
}

// API Endpoints
export const ENDPOINTS = {
  // Category Master
  CATEGORIES: '/master-registration/categories',
  CATEGORY_BY_ID: (id) => `/master-registration/categories/${id}`,

  // Type Master
  TYPES: '/master-registration/types',
  TYPE_BY_ID: (id) => `/master-registration/types/${id}`,

  // Registry Database
  REGISTRIES: '/master-registration/registries',
  REGISTRY_BY_ID: (id) => `/master-registration/registries/${id}`,

  // Excel
  DOWNLOAD_TEMPLATE: '/master-registration/template/download',
  UPLOAD_EXCEL: '/master-registration/upload'
}
