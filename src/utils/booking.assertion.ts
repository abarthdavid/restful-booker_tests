import { expect, APIResponse } from '@playwright/test';
import { BookingResponse, Booking, BookingId } from '../types/booking.types';
import { BookingService } from '../services/booking.service';

export async function createBookingWithPayload(
  bookingService: BookingService,
  booking: Booking,
): Promise<number> {
  const response = await bookingService.createBooking(booking);
  expect(response.status()).toBe(200);

  const created = (await response.json()) as BookingResponse;
  return created.bookingid;
}

export async function expectStatusAndParseJson<T>(
  response: APIResponse,
  expectedStatus: number,
): Promise<T> {
  expect(response.status()).toBe(expectedStatus);
  return (await response.json()) as T;
}

export function expectBookingIdsToContain(ids: BookingId[], expectedBookingId: number): void {
  expect(ids.some((item) => item.bookingid === expectedBookingId)).toBe(true);
}

export function expectBookingToMatch(actual: Booking, expected: Booking): void {
  expect(actual.firstname).toBe(expected.firstname);
  expect(actual.lastname).toBe(expected.lastname);
  expect(actual.totalprice).toBe(expected.totalprice);
  expect(actual.depositpaid).toBe(expected.depositpaid);
  expect(actual.bookingdates.checkin).toBe(expected.bookingdates.checkin);
  expect(actual.bookingdates.checkout).toBe(expected.bookingdates.checkout);
}
