import { expect } from '@playwright/test';
import { BookingFactory } from '../factories/booking.factory';
import { BookingResponse, Booking } from '../types/booking.types';
import { BookingService } from '../services/booking.service';

const CLEANUP_SUCCESS_STATUSES = [200, 201] as const;

/**
 * Deletes all tracked booking IDs using the provided delete function.
 * Accepts 200 and 201 as successful cleanup statuses.
 *
 * @param createdBookingIds - Array of booking IDs to clean up.
 * @param deleteBooking - Function that performs the deletion and returns a response.
 * @throws Error if a deletion returns an unexpected status code.
 */
export async function cleanupTrackedBookings(
  createdBookingIds: number[],
  deleteBooking: (id: number) => Promise<{ status(): number }>,
): Promise<void> {
  for (const bookingId of createdBookingIds) {
    const response = await deleteBooking(bookingId);
    if (
      !CLEANUP_SUCCESS_STATUSES.includes(
        response.status() as (typeof CLEANUP_SUCCESS_STATUSES)[number],
      )
    ) {
      throw new Error(
        `Cleanup failed for booking ${bookingId}. Received status: ${response.status()}`,
      );
    }
  }
}

/**
 * Deletes a booking by ID and asserts that the operation succeeds.
 * Throws an error if the deletion request returns an unexpected status.
 *
 * @param authenticatedBookingService - The booking service with authentication token.
 * @param bookingId - The ID of the booking to delete.
 * @throws Error if the deletion fails (status is neither 200 nor 201).
 */
export async function deleteBookingById(
  authenticatedBookingService: BookingService,
  bookingId: number,
) {
  const response = await authenticatedBookingService.deleteBooking(bookingId);

  if (response.status() !== 201 && response.status() !== 200) {
    throw new Error(`Failed to delete booking with id ${bookingId}`);
  }
}

/**
 * Creates a new booking using the BookingFactory and returns both the input
 * booking data and the API response.
 * Asserts that the creation was successful (status 200).
 *
 * @param bookingService - The booking service to create the booking with.
 * @returns An object containing the original booking data and the API response.
 */
export async function createBooking(
  bookingService: BookingService,
): Promise<{ booking: Booking; created: BookingResponse }> {
  const booking = BookingFactory.createDefault();

  const response = await bookingService.createBooking(booking);
  expect(response.status()).toBe(200);

  const created = (await response.json()) as BookingResponse;

  return { booking, created };
}
