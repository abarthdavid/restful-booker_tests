import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * IHttpClient defines the contract for making HTTP requests.
 * Following the Dependency Inversion Principle: high-level modules (services)
 * depend on this abstraction, not on concrete implementations.
 */
export interface IHttpClient {
  get(url: string, options?: RequestOptions): Promise<APIResponse>;
  post(url: string, options?: RequestOptions): Promise<APIResponse>;
  put(url: string, options?: RequestOptions): Promise<APIResponse>;
  patch(url: string, options?: RequestOptions): Promise<APIResponse>;
  delete(url: string, options?: RequestOptions): Promise<APIResponse>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  data?: unknown;
}

/**
 * PlaywrightHttpClient is the concrete implementation of IHttpClient
 * that uses Playwright's APIRequestContext.
 */
export class PlaywrightHttpClient implements IHttpClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.get(url, {
      headers: options?.headers,
      params: options?.params as Record<string, string | number | boolean>,
    });
  }

  async post(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.post(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  async put(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.put(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  async patch(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.patch(url, {
      headers: options?.headers,
      data: options?.data,
    });
  }

  async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(url, {
      headers: options?.headers,
    });
  }
}
