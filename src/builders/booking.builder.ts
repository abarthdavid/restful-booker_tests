import { Booking, BookingDates } from '../types/booking.types';

const createDefaultBooking = (): Booking => ({
  firstname: 'John',
  lastname: 'Doe',
  totalprice: 100,
  depositpaid: true,
  bookingdates: {
    checkin: '2025-01-01',
    checkout: '2025-01-07',
  },
});

/**
 * BookingBuilder implements the Builder pattern to construct Booking objects
 * with a fluent API. This provides fine-grained control over test data
 * and makes test intent explicit.
 */
export class BookingBuilder {
  /**
   * Creates a new BookingBuilder instance.
   *
   * @param booking - The initial booking object. Defaults to a standard test booking.
   */
  constructor(private readonly booking: Booking = createDefaultBooking()) {}

  /**
   * Internal helper that creates a new builder with updated fields.
   * Ensures immutability by cloning the booking object and nested structures.
   *
   * @param update - Partial booking data to merge with the current booking.
   * @returns A new BookingBuilder instance with the updated data.
   */
  private cloneWith(update: Partial<Booking>): BookingBuilder {
    return new BookingBuilder({
      ...this.booking,
      ...update,
      bookingdates: {
        ...this.booking.bookingdates,
        ...(update.bookingdates ?? {}),
      },
    });
  }

  /**
   * Sets the first name for the booking.
   *
   * @param firstname - The first name to set.
   * @returns This builder instance for method chaining.
   */
  withFirstName(firstname: string): this {
    return this.cloneWith({ firstname }) as this;
  }

  /**
   * Sets the last name for the booking.
   *
   * @param lastname - The last name to set.
   * @returns This builder instance for method chaining.
   */
  withLastName(lastname: string): this {
    return this.cloneWith({ lastname }) as this;
  }

  /**
   * Sets the total price for the booking.
   *
   * @param totalprice - The booking price in numeric form.
   * @returns This builder instance for method chaining.
   */
  withTotalPrice(totalprice: number): this {
    return this.cloneWith({ totalprice }) as this;
  }

  /**
   * Sets whether the deposit has been paid.
   *
   * @param depositpaid - True if deposit is paid, false otherwise.
   * @returns This builder instance for method chaining.
   */
  withDepositPaid(depositpaid: boolean): this {
    return this.cloneWith({ depositpaid }) as this;
  }

  /**
   * Sets the complete check-in and check-out dates.
   *
   * @param dates - The booking dates object containing checkin and checkout.
   * @returns This builder instance for method chaining.
   */
  withBookingDates(dates: BookingDates): this {
    return this.cloneWith({ bookingdates: dates }) as this;
  }

  /**
   * Sets only the check-in date while preserving the check-out date.
   *
   * @param checkin - The check-in date in YYYY-MM-DD format.
   * @returns This builder instance for method chaining.
   */
  withCheckinDate(checkin: string): this {
    return this.cloneWith({
      bookingdates: { checkin, checkout: this.booking.bookingdates.checkout },
    }) as this;
  }

  /**
   * Sets only the check-out date while preserving the check-in date.
   *
   * @param checkout - The check-out date in YYYY-MM-DD format.
   * @returns This builder instance for method chaining.
   */
  withCheckoutDate(checkout: string): this {
    return this.cloneWith({
      bookingdates: { checkin: this.booking.bookingdates.checkin, checkout },
    }) as this;
  }

  /**
   * Sets additional special requests or requirements for the booking.
   *
   * @param additionalneeds - Special requests such as "Breakfast" or "Late Checkout".
   * @returns This builder instance for method chaining.
   */
  withAdditionalNeeds(additionalneeds: string): this {
    return this.cloneWith({ additionalneeds }) as this;
  }

  /**
   * Builds and returns the final booking object.
   * Creates a defensive copy to prevent external mutation.
   *
   * @returns A complete Booking object with all configured properties.
   */
  build(): Booking {
    return { ...this.booking, bookingdates: { ...this.booking.bookingdates } };
  }
}
