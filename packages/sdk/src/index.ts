/**
 * @saasquatch/sdk
 * TypeScript SDK for SaaSQuatch-generated microservices
 */

// Main client
export { SaaSQuatchClient } from './SaaSQuatchClient';

// Service clients
export { AuthClient } from './clients/AuthClient';
export { UserClient } from './clients/UserClient';
export { BaseClient } from './clients/BaseClient';

// Common types
export type {
  SaaSQuatchConfig,
  ErrorResponse,
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  HealthStatus,
  ReadinessStatus,
} from './types/common.types';

// Auth types
export type {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  UserProfile,
  AuthResponse,
  RefreshTokenResponse,
  LogoutResponse,
  JWTPayload,
} from './types/auth.types';

// User types
export type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from './types/user.types';
