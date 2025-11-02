/**
 * User-related types
 */

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tenantId?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * Create user request
 */
export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  role?: string;
  tenantId?: string;
}

/**
 * Update user request
 */
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * User list filters
 */
export interface UserFilters {
  email?: string;
  name?: string;
  role?: string;
  tenantId?: string;
  isActive?: boolean;
}
