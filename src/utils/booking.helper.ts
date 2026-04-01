import { expect } from '@playwright/test';
import { BookingFactory } from '../factories/booking.factory';
import { BookingResponse, Booking } from '../types/booking.types';
import { BookingService } from '../services/booking.service';

export async function deleteBookingById(
  authenticatedBookingService: BookingService,
  bookingId: number,
) {
  const response = await authenticatedBookingService.deleteBooking(bookingId);

  if (response.status() !== 201 && response.status() !== 200) {
    throw new Error(`Failed to delete booking with id ${bookingId}`);
  }
}

export async function createBooking(
  bookingService: BookingService,
): Promise<{ booking: Booking; created: BookingResponse }> {
  const booking = BookingFactory.createDefault();

  const response = await bookingService.createBooking(booking);
  expect(response.status()).toBe(200);

  const created = (await response.json()) as BookingResponse;

  return { booking, created };
}
