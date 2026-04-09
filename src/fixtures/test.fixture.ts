import { test as base, APIRequestContext } from '@playwright/test';
import { PlaywrightHttpClient } from '../services/http-client';
import { AuthService } from '../services/auth.service';
import { BookingService } from '../services/booking.service';
import { AUTH_CREDENTIALS, BASIC_AUTH_HEADER } from '../config/api.config';
import { cleanupTrackedBookings } from '../utils/booking.helper';

/**
 * Provides booking ID tracking and automatic cleanup after each test.
 */
export interface BookingTracker {
  /** Registers a booking ID for automatic cleanup after the test. */
  track: (bookingId: number) => void;
  /** Removes a booking ID from the cleanup list (e.g. when already deleted in the test). */
  untrack: (bookingId: number) => void;
}

export interface BookingFixtures {
  authService: AuthService;
  bookingService: BookingService;
  authenticatedBookingService: BookingService;
  authToken: string;
  basicAuthHeader: string;
  apiRequest: APIRequestContext;
  bookingTracker: BookingTracker;
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

  bookingTracker: async ({ authenticatedBookingService }, use) => {
    const createdBookingIds: number[] = [];
    await use({
      track: (id) => createdBookingIds.push(id),
      untrack: (id) => {
        const index = createdBookingIds.indexOf(id);
        if (index !== -1) createdBookingIds.splice(index, 1);
      },
    });
    await cleanupTrackedBookings(createdBookingIds, (id) =>
      authenticatedBookingService.deleteBooking(id),
    );
  },
});

export { expect } from '@playwright/test';
