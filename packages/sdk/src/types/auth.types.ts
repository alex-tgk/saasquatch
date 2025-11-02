/**
 * Authentication-related types
 */

/**
 * User registration request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

/**
 * User login request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Refresh token request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * User profile
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tenantId?: string;
}

/**
 * Authentication response with tokens
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

/**
 * Token refresh response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * JWT token payload
 */
export interface JWTPayload {
  id: string;
  email: string;
  tenantId?: string;
  iat: number;
  exp: number;
}
