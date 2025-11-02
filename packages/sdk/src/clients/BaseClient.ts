import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { SaaSQuatchConfig, ErrorResponse } from '../types/common.types';

/**
 * Base HTTP client with common functionality for all service clients
 */
export class BaseClient {
  protected axios: AxiosInstance;
  protected config: SaaSQuatchConfig;
  protected accessToken?: string;
  protected refreshToken?: string;

  constructor(baseURL: string, config: SaaSQuatchConfig) {
    this.config = config;
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;

    this.axios = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials !== false,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Request interceptor to add auth token
    this.axios.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors
    this.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        // Handle 401 errors and attempt token refresh
        if (error.response?.status === 401 && this.refreshToken) {
          try {
            await this.refreshAccessToken();
            // Retry the original request
            if (error.config) {
              return this.axios.request(error.config);
            }
          } catch (refreshError) {
            if (this.config.onAuthError) {
              this.config.onAuthError(refreshError as Error);
            }
            throw refreshError;
          }
        }

        // Format error response
        const formattedError = this.formatError(error);
        throw formattedError;
      }
    );
  }

  /**
   * Set the access token for authenticated requests
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Set the refresh token
   */
  setRefreshToken(token: string): void {
    this.refreshToken = token;
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }

  /**
   * Clear all tokens
   */
  clearTokens(): void {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }

  /**
   * Refresh the access token using the refresh token
   * Override this in subclasses to implement service-specific refresh logic
   */
  protected async refreshAccessToken(): Promise<void> {
    throw new Error('Token refresh not implemented');
  }

  /**
   * Format axios error into a consistent error object
   */
  protected formatError(error: AxiosError<ErrorResponse>): Error {
    if (error.response?.data) {
      const errorData = error.response.data;
      const message = errorData.message || error.message;
      const formattedError = new Error(message) as Error & {
        statusCode: number;
        error: string;
        validation?: ErrorResponse['validation'];
      };
      formattedError.statusCode = errorData.statusCode;
      formattedError.error = errorData.error;
      formattedError.validation = errorData.validation;
      return formattedError;
    }
    return error;
  }

  /**
   * Perform GET request
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.get(url, config);
    return response.data;
  }

  /**
   * Perform POST request
   */
  protected async post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.post(url, data, config);
    return response.data;
  }

  /**
   * Perform PUT request
   */
  protected async put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.put(url, data, config);
    return response.data;
  }

  /**
   * Perform PATCH request
   */
  protected async patch<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.patch(url, data, config);
    return response.data;
  }

  /**
   * Perform DELETE request
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axios.delete(url, config);
    return response.data;
  }
}
