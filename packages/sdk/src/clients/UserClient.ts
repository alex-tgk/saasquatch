import { BaseClient } from './BaseClient';
import { SaaSQuatchConfig, PaginationParams, PaginatedResponse } from '../types/common.types';
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
} from '../types/user.types';

/**
 * Client for user service operations
 */
export class UserClient extends BaseClient {
  constructor(config: SaaSQuatchConfig) {
    const baseURL = config.userServiceUrl || config.apiGatewayUrl + '/users';
    super(baseURL, config);
  }

  /**
   * Get a list of users with optional filtering and pagination
   *
   * @param filters - Filter criteria
   * @param pagination - Pagination parameters
   * @returns Paginated list of users
   *
   * @example
   * ```typescript
   * const users = await client.users.list({
   *   role: 'admin',
   *   isActive: true
   * }, {
   *   page: 1,
   *   limit: 10
   * });
   * ```
   */
  async list(
    filters?: UserFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const params = { ...filters, ...pagination };
    return this.get<PaginatedResponse<User>>('/users', { params });
  }

  /**
   * Get a user by ID
   *
   * @param userId - User ID
   * @returns User details
   *
   * @example
   * ```typescript
   * const user = await client.users.getById('user-id');
   * console.log(user.email);
   * ```
   */
  async getById(userId: string): Promise<User> {
    return this.get<User>(`/users/${userId}`);
  }

  /**
   * Create a new user
   *
   * @param data - User creation data
   * @returns Created user
   *
   * @example
   * ```typescript
   * const user = await client.users.create({
   *   email: 'newuser@example.com',
   *   name: 'New User',
   *   password: 'SecureP@ssw0rd'
   * });
   * ```
   */
  async create(data: CreateUserRequest): Promise<User> {
    return this.post<User, CreateUserRequest>('/users', data);
  }

  /**
   * Update a user
   *
   * @param userId - User ID
   * @param data - Updated user data
   * @returns Updated user
   *
   * @example
   * ```typescript
   * const user = await client.users.update('user-id', {
   *   name: 'Updated Name'
   * });
   * ```
   */
  async update(userId: string, data: UpdateUserRequest): Promise<User> {
    return this.patch<User, UpdateUserRequest>(`/users/${userId}`, data);
  }

  /**
   * Delete a user
   *
   * @param userId - User ID
   *
   * @example
   * ```typescript
   * await client.users.deleteUser('user-id');
   * ```
   */
  async deleteUser(userId: string): Promise<void> {
    await super.delete<void>(`/users/${userId}`);
  }

  /**
   * Search users by email or name
   *
   * @param query - Search query string
   * @param pagination - Pagination parameters
   * @returns Paginated search results
   *
   * @example
   * ```typescript
   * const results = await client.users.search('john', { limit: 5 });
   * ```
   */
  async search(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<User>> {
    const params = { q: query, ...pagination };
    return this.get<PaginatedResponse<User>>('/users/search', { params });
  }
}
