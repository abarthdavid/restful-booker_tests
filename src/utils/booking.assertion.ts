import { expect, APIResponse } from '@playwright/test';
import { BookingResponse, Booking, BookingId } from '../types/booking.types';
import { BookingService } from '../services/booking.service';

/**
 * Creates a booking with the provided payload and parses the response.
 * Asserts that the creation was successful (status 200).
 *
 * @param bookingService - The booking service to create the booking with.
 * @param booking - The booking data to send in the request.
 * @returns The booking ID from the API response.
 */
export async function createBookingWithPayload(
  bookingService: BookingService,
  booking: Booking,
): Promise<number> {
  const response = await bookingService.createBooking(booking);
  expect(response.status()).toBe(200);

  const created = (await response.json()) as BookingResponse;
  return created.bookingid;
}

/**
 * Generic helper that asserts an HTTP response has the expected status
 * and parses the JSON body.
 *
 * @param response - The API response to validate.
 * @param expectedStatus - The expected HTTP status code.
 * @returns The parsed JSON response body of type T.
 */
export async function expectStatusAndParseJson<T>(
  response: APIResponse,
  expectedStatus: number,
): Promise<T> {
  expect(response.status()).toBe(expectedStatus);
  return (await response.json()) as T;
}

/**
 * Asserts that the provided booking ID array contains the expected booking ID.
 *
 * @param ids - Array of booking IDs to search.
 * @param expectedBookingId - The booking ID that should be present in the array.
 * @throws Assertion error if the expected booking ID is not found.
 */
export function expectBookingIdsToContain(ids: BookingId[], expectedBookingId: number): void {
  expect(ids.some((item) => item.bookingid === expectedBookingId)).toBe(true);
}

/**
 * Asserts that all expected booking fields match the actual booking.
 * Compares firstname, lastname, totalprice, depositpaid, and booking dates.
 *
 * @param actual - The actual booking to verify.
 * @param expected - The expected booking data.
 * @throws Assertion errors if any field does not match.
 */
export function expectBookingToMatch(actual: Booking, expected: Booking): void {
  expect(actual.firstname).toBe(expected.firstname);
  expect(actual.lastname).toBe(expected.lastname);
  expect(actual.totalprice).toBe(expected.totalprice);
  expect(actual.depositpaid).toBe(expected.depositpaid);
  expect(actual.bookingdates.checkin).toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout).toBe(expected.bookingdates.checkout);
}
