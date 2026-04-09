import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * IHttpClient defines the contract for making HTTP requests.
 * Following the Dependency Inversion Principle: high-level modules (services)
 * depend on this abstraction, not on concrete implementations.
 */
export interface IHttpClient {
  /**
   * Sends an HTTP GET request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  get(url: string, options?: RequestOptions): Promise<APIResponse>;
  /**
   * Sends an HTTP POST request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  post(url: string, options?: RequestOptions): Promise<APIResponse>;
  /**
   * Sends an HTTP PUT request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  put(url: string, options?: RequestOptions): Promise<APIResponse>;
  /**
   * Sends an HTTP PATCH request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  patch(url: string, options?: RequestOptions): Promise<APIResponse>;
  /**
   * Sends an HTTP DELETE request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  delete(url: string, options?: RequestOptions): Promise<APIResponse>;
}

export interface RequestOptions {
  /** Optional HTTP headers sent with the request. */
  headers?: Record<string, string>;
  /** Optional query string parameters. */
  params?: Record<string, string | number | boolean>;
  /** Optional request payload. */
  data?: unknown;
}

/**
 * PlaywrightHttpClient is the concrete implementation of IHttpClient
 * that uses Playwright's APIRequestContext.
 */
export class PlaywrightHttpClient implements IHttpClient {
  /**
   * Creates a new HTTP client backed by Playwright's request context.
   *
   * @param request - The Playwright API request context.
   */
  constructor(private readonly request: APIRequestContext) {}

  /**
   * Sends an HTTP GET request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  async get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(url, {
      headers: options?.headers,
      params: options?.params as Record<string, string | number | boolean>,
    });
  }

  /**
   * Sends an HTTP POST request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  async post(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  /**
   * Sends an HTTP PUT request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  async put(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  /**
   * Sends an HTTP PATCH request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  async patch(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  /**
   * Sends an HTTP DELETE request.
   *
   * @param url - The target endpoint URL.
   * @param options - Optional request configuration.
   * @returns A promise that resolves to the API response.
   */
  async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: options?.headers,
    });
  }
}
