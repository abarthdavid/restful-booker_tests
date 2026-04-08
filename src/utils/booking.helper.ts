import { expect } from '@playwright/test';
import { BookingFactory } from '../factories/booking.factory';
import { BookingResponse, Booking } from '../types/booking.types';
import { BookingService } from '../services/booking.service';

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
