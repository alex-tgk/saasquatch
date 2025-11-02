import { SaaSQuatchConfig } from './types/common.types';
import { AuthClient } from './clients/AuthClient';
import { UserClient } from './clients/UserClient';

/**
 * Main SaaSQuatch SDK client
 * Provides access to all service clients
 *
 * @example
 * ```typescript
 * import { SaaSQuatchClient } from '@saasquatch/sdk';
 *
 * const client = new SaaSQuatchClient({
 *   authServiceUrl: 'http://localhost:3001',
 *   userServiceUrl: 'http://localhost:3002',
 * });
 *
 * // Login
 * const auth = await client.auth.login({
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 *
 * // Get current user
 * const user = await client.auth.getMe();
 *
 * // List users
 * const users = await client.users.list();
 * ```
 */
export class SaaSQuatchClient {
  /**
   * Authentication service client
   */
  public readonly auth: AuthClient;

  /**
   * User service client
   */
  public readonly users: UserClient;

  private config: SaaSQuatchConfig;

  /**
   * Create a new SaaSQuatch SDK client
   *
   * @param config - SDK configuration
   */
  constructor(config: SaaSQuatchConfig) {
    this.config = config;

    // Initialize service clients
    this.auth = new AuthClient(config);
    this.users = new UserClient(config);
  }

  /**
   * Set the access token for all service clients
   *
   * @param token - Access token
   *
   * @example
   * ```typescript
   * client.setAccessToken('your-access-token');
   * ```
   */
  setAccessToken(token: string): void {
    this.auth.setAccessToken(token);
    this.users.setAccessToken(token);
  }

  /**
   * Set the refresh token for all service clients
   *
   * @param token - Refresh token
   *
   * @example
   * ```typescript
   * client.setRefreshToken('your-refresh-token');
   * ```
   */
  setRefreshToken(token: string): void {
    this.auth.setRefreshToken(token);
    this.users.setRefreshToken(token);
  }

  /**
   * Clear all tokens from all service clients
   *
   * @example
   * ```typescript
   * client.clearTokens();
   * ```
   */
  clearTokens(): void {
    this.auth.clearTokens();
    this.users.clearTokens();
  }

  /**
   * Check if the client is authenticated
   *
   * @returns True if authenticated
   *
   * @example
   * ```typescript
   * if (client.isAuthenticated()) {
   *   console.log('User is logged in');
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  /**
   * Get the current configuration
   *
   * @returns Current SDK configuration
   */
  getConfig(): Readonly<SaaSQuatchConfig> {
    return Object.freeze({ ...this.config });
  }
}
