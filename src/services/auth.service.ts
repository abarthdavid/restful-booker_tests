import { APIResponse } from '@playwright/test';
import { IHttpClient } from './http-client';
import { AuthCredentials, AuthTokenResponse } from '../types/booking.types';
import { ENDPOINTS } from '../config/api.config';

/**
 * AuthService handles token-based authentication for the Restful-Booker API.
 */
export class AuthService {
  constructor(private readonly client: IHttpClient) {}

  /**
   * Creates an authentication token using the provided credentials.
   * Returns the raw response so callers can assert on status codes
   * in negative test scenarios.
   */
  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return this.client.post(ENDPOINTS.auth, {
      data: credentials,
    });
  }

  /**
   * Convenience method for the happy path: returns the token string directly.
   */
  async getToken(credentials: AuthCredentials): Promise<string> {
    const response = await this.createToken(credentials);
    const body = (await response.json()) as AuthTokenResponse;
    if (!body.token) {
      throw new Error(`Authentication failed: ${JSON.stringify(body)}`);
    }
    return body.token;
  }
}
