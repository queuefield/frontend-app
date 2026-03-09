export type LoginMethod = 'username' | 'phone' | 'otp';

export interface AuthConfig {
  requireLogin: boolean;
  loginMethod: LoginMethod;
  showRememberMe: boolean;
  tokenExpiryHours: number;
  loginEndpoint: string;
}

export interface LoginRequest {
  username?: string;
  phone?: string;
  password?: string;
  otp?: string;
  rememberMe?: boolean;
}

export interface UserData {
  id: string;
  username?: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  [key: string]: any; // Allow additional properties
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: UserData;
  expiresIn?: number;
  message?: string;
  data?: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  token: string | null;
  tokenExpiry: number | null;
}

export interface TokenData {
  token: string;
  refreshToken?: string;
  expiry: number;
  rememberMe: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}
