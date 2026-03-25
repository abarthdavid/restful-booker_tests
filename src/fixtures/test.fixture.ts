import { test as base, APIRequestContext } from '@playwright/test';
import { PlaywrightHttpClient } from '../services/http-client';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { AUTH_CREDENTIALS, BASIC_AUTH_HEADER } from '../config/api.config';

export interface BookingFixtures {
  authService: AuthService;
  bookingService: BookingService;
  authenticatedBookingService: BookingService;
  authToken: string;
  basicAuthHeader: string;
  apiRequest: APIRequestContext;
}

/**
 * Extended test fixture that pre-wires all services.
 * This is the composition root for the Dependency Inversion setup.
 */
export const test = base.extend<BookingFixtures>({
  apiRequest: async ({ request }, use) => {
    await use(request);
  },

  authService: async ({ request }, use) => {
    const client = new PlaywrightHttpClient(request);
    await use(new AuthService(client));
  },

  authToken: async ({ request }, use) => {
    const client = new PlaywrightHttpClient(request);
    const authService = new AuthService(client);
    const token = await authService.getToken(AUTH_CREDENTIALS);
    await use(token);
  },

  basicAuthHeader: async ({ request }, use) => {
    void request;
    await use(BASIC_AUTH_HEADER);
  },

  bookingService: async ({ request }, use) => {
    const client = new PlaywrightHttpClient(request);
    await use(new BookingService(client));
  },

  authenticatedBookingService: async ({ request, authToken }, use) => {
    const client = new PlaywrightHttpClient(request);
    await use(new BookingService(client, authToken));
  },
});

export { expect } from '@playwright/test';
