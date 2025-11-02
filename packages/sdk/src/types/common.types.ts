/**
 * Common types used across the SaaSQuatch SDK
 */

/**
 * SDK Configuration options
 */
export interface SaaSQuatchConfig {
  /**
   * Base URL for the auth service
   * @example "http://localhost:3001"
   */
  authServiceUrl: string;

  /**
   * Base URL for the user service
   * @example "http://localhost:3002"
   */
  userServiceUrl?: string;

  /**
   * Base URL for the API gateway (if using gateway pattern)
   * @example "http://localhost:3000"
   */
  apiGatewayUrl?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Whether to include credentials in requests
   * @default true
   */
  withCredentials?: boolean;

  /**
   * Custom headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Access token for authenticated requests
   */
  accessToken?: string;

  /**
   * Refresh token for renewing access tokens
   */
  refreshToken?: string;

  /**
   * Callback function called when tokens are refreshed
   */
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;

  /**
   * Callback function called on authentication errors
   */
  onAuthError?: (error: Error) => void;
}

/**
 * Standard error response from services
 */
export interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  validation?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Base API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Service health status
 */
export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
}

/**
 * Service readiness status
 */
export interface ReadinessStatus {
  status: 'ready' | 'not_ready';
  checks: Record<string, {
    status: 'up' | 'down';
    responseTime?: number;
  }>;
  timestamp: string;
}
