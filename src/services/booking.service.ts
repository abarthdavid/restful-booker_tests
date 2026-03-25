import { APIResponse } from '@playwright/test';
import { IHttpClient } from './http-client';
import { Booking, BookingFilter, PartialBooking } from '../types/booking.types';
import { ENDPOINTS } from '../config/api.config';

/**
 * BookingService abstracts all booking-related API calls.
 * Accepts an optional auth token to be used for mutating operations.
 */
export class BookingService {
  constructor(
    private readonly client: IHttpClient,
    private readonly token?: string,
  ) {}

  private get authHeaders(): Record<string, string> {
    return this.token ? { Cookie: `token=${this.token}` } : {};
  }

  /**
   * Ping the health check endpoint to confirm the API is running.
   */
  async ping(): Promise<APIResponse> {
    return this.client.get(ENDPOINTS.ping);
  }

  /**
   * Returns all booking IDs, optionally filtered by query parameters.
   */
  async getBookingIds(filter?: BookingFilter): Promise<APIResponse> {
    const params: Record<string, string> = {};
    if (filter?.firstname) params['firstname'] = filter.firstname;
    if (filter?.lastname) params['lastname'] = filter.lastname;
    if (filter?.checkin) params['checkin'] = filter.checkin;
    if (filter?.checkout) params['checkout'] = filter.checkout;

    return this.client.get(ENDPOINTS.booking, {
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  }

  /**
   * Retrieves a single booking by ID.
   */
  async getBookingById(id: number): Promise<APIResponse> {
    return this.client.get(ENDPOINTS.bookingById(id));
  }

  /**
   * Creates a new booking. Returns the raw response.
   */
  async createBooking(booking: Booking): Promise<APIResponse> {
    return this.client.post(ENDPOINTS.booking, {
      data: booking,
    });
  }

  /**
   * Creates a booking from a raw payload. Useful for negative contract testing.
   */
  async createBookingRaw(payload: unknown): Promise<APIResponse> {
    return this.client.post(ENDPOINTS.booking, {
      data: payload,
    });
  }

  /**
   * Sends deliberately malformed JSON to validate API error handling.
   */
  async createBookingMalformedJson(rawMalformedJson: string): Promise<APIResponse> {
    return this.client.post(ENDPOINTS.booking, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: rawMalformedJson,
    });
  }

  /**
   * Fully updates a booking (PUT). Requires authentication.
   */
  async updateBooking(id: number, booking: Booking): Promise<APIResponse> {
    return this.client.put(ENDPOINTS.bookingById(id), {
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: booking,
    });
  }

  /**
   * Fully updates a booking using an explicit token, useful for negative auth tests.
   */
  async updateBookingWithToken(id: number, booking: Booking, token: string): Promise<APIResponse> {
    return this.client.put(ENDPOINTS.bookingById(id), {
      headers: {
        Cookie: `token=${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: booking,
    });
  }

  /**
   * Fully updates a booking using Basic Auth.
   */
  async updateBookingWithBasicAuth(
    id: number,
    booking: Booking,
    basicAuthHeader: string,
  ): Promise<APIResponse> {
    return this.client.put(ENDPOINTS.bookingById(id), {
      headers: {
        Authorization: basicAuthHeader,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: booking,
    });
  }

  /**
   * Partially updates a booking (PATCH). Requires authentication.
   */
  async partialUpdateBooking(id: number, partial: PartialBooking): Promise<APIResponse> {
    return this.client.patch(ENDPOINTS.bookingById(id), {
      headers: {
        ...this.authHeaders,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      data: partial,
    });
  }

  /**
   * Deletes a booking by ID. Requires authentication.
   */
  async deleteBooking(id: number): Promise<APIResponse> {
    return this.client.delete(ENDPOINTS.bookingById(id), {
      headers: this.authHeaders,
    });
  }

  /**
   * Attempts to delete a booking without auth headers.
   */
  async deleteBookingWithoutAuth(id: number): Promise<APIResponse> {
    return this.client.delete(ENDPOINTS.bookingById(id));
  }

  /**
   * Deletes a booking using Basic Auth instead of a token.
   */
  async deleteBookingWithBasicAuth(id: number, basicAuthHeader: string): Promise<APIResponse> {
    return this.client.delete(ENDPOINTS.bookingById(id), {
      headers: { Authorization: basicAuthHeader },
    });
  }

  /**
   * Sends PATCH to /booking without ID to verify unsupported method handling.
   */
  async patchBookingCollection(): Promise<APIResponse> {
    return this.client.patch(ENDPOINTS.booking);
  }
}
