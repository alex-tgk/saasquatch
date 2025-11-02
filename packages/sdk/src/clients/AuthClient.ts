import { BaseClient } from './BaseClient';
import { SaaSQuatchConfig } from '../types/common.types';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
  UserProfile,
} from '../types/auth.types';

/**
 * Client for authentication service operations
 */
export class AuthClient extends BaseClient {
  constructor(config: SaaSQuatchConfig) {
    super(config.authServiceUrl, config);
  }

  /**
   * Register a new user account
   *
   * @param data - User registration data
   * @returns Authentication response with tokens and user data
   *
   * @example
   * ```typescript
   * const response = await client.auth.register({
   *   email: 'user@example.com',
   *   password: 'SecureP@ssw0rd',
   *   name: 'John Doe'
   * });
   * console.log(response.accessToken);
   * ```
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse, RegisterRequest>('/auth/register', data);

    // Store tokens
    this.setAccessToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);

    // Notify callback
    if (this.config.onTokenRefresh) {
      this.config.onTokenRefresh({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  }

  /**
   * Login with email and password
   *
   * @param data - Login credentials
   * @returns Authentication response with tokens and user data
   *
   * @example
   * ```typescript
   * const response = await client.auth.login({
   *   email: 'user@example.com',
   *   password: 'SecureP@ssw0rd'
   * });
   * console.log(response.user);
   * ```
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.post<AuthResponse, LoginRequest>('/auth/login', data);

    // Store tokens
    this.setAccessToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);

    // Notify callback
    if (this.config.onTokenRefresh) {
      this.config.onTokenRefresh({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  }

  /**
   * Refresh the access token using a refresh token
   *
   * @param refreshToken - Optional refresh token (uses stored token if not provided)
   * @returns New access and refresh tokens
   *
   * @example
   * ```typescript
   * const response = await client.auth.refresh();
   * console.log(response.accessToken);
   * ```
   */
  async refresh(refreshToken?: string): Promise<RefreshTokenResponse> {
    const token = refreshToken || this.refreshToken;

    if (!token) {
      throw new Error('No refresh token available');
    }

    const response = await this.post<RefreshTokenResponse, RefreshTokenRequest>(
      '/auth/refresh',
      { refreshToken: token }
    );

    // Store new tokens
    this.setAccessToken(response.accessToken);
    this.setRefreshToken(response.refreshToken);

    // Notify callback
    if (this.config.onTokenRefresh) {
      this.config.onTokenRefresh({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return response;
  }

  /**
   * Override base class refresh method to use auth service
   */
  protected async refreshAccessToken(): Promise<void> {
    await this.refresh();
  }

  /**
   * Logout the current user
   * Invalidates the current access token
   *
   * @returns Logout confirmation
   *
   * @example
   * ```typescript
   * await client.auth.logout();
   * console.log('Logged out successfully');
   * ```
   */
  async logout(): Promise<LogoutResponse> {
    const response = await this.post<LogoutResponse>('/auth/logout');

    // Clear stored tokens
    this.clearTokens();

    return response;
  }

  /**
   * Get the current authenticated user's profile
   * Requires a valid access token
   *
   * @returns Current user profile
   *
   * @example
   * ```typescript
   * const user = await client.auth.getMe();
   * console.log(user.email);
   * ```
   */
  async getMe(): Promise<UserProfile> {
    return this.get<UserProfile>('/auth/me');
  }

  /**
   * Check if user is authenticated (has valid access token)
   *
   * @returns True if authenticated
   *
   * @example
   * ```typescript
   * if (client.auth.isAuthenticated()) {
   *   console.log('User is logged in');
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}
