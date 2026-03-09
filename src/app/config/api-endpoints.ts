/**
 * Centralized API endpoint definitions
 * All API endpoints should be defined here for easy maintenance
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: 'Security/LoginIC',
    LOGOUT: 'Security/Logout',
    REFRESH_TOKEN: 'Security/RefreshToken',
    VERIFY_OTP: 'Security/VerifyOTP',
    SEND_OTP: 'Security/SendOTP',
    CHANGE_PASSWORD: 'Security/ChangePassword',
    FORGOT_PASSWORD: 'Security/ForgotPassword',
    RESET_PASSWORD: 'Security/ResetPassword'
  },

  // User Management
  USER: {
    PROFILE: 'User/Profile',
    UPDATE_PROFILE: 'User/UpdateProfile',
    GET_BY_ID: (id: string) => `User/${id}`,
    LIST: 'User/List',
    CREATE: 'User/Create',
    UPDATE: 'User/Update',
    DELETE: (id: string) => `User/Delete/${id}`
  },

  // Example: Add more endpoint groups as needed
  // PRODUCTS: {
  //   LIST: 'Products/List',
  //   GET_BY_ID: (id: string) => `Products/${id}`,
  //   CREATE: 'Products/Create',
  //   UPDATE: 'Products/Update',
  //   DELETE: (id: string) => `Products/Delete/${id}`
  // }
} as const;

/**
 * Helper function to get full API URL
 */
export function getApiUrl(baseUrl: string, endpoint: string): string {
  // Remove trailing slash from baseUrl if present
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
}
