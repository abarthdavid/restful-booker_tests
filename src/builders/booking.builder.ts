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
  constructor(private readonly booking: Booking = createDefaultBooking()) {}

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

  withFirstName(firstname: string): this {
    return this.cloneWith({ firstname }) as this;
  }

  withLastName(lastname: string): this {
    return this.cloneWith({ lastname }) as this;
  }

  withTotalPrice(totalprice: number): this {
    return this.cloneWith({ totalprice }) as this;
  }

  withDepositPaid(depositpaid: boolean): this {
    return this.cloneWith({ depositpaid }) as this;
  }

  withBookingDates(dates: BookingDates): this {
    return this.cloneWith({ bookingdates: dates }) as this;
  }

  withCheckinDate(checkin: string): this {
    return this.cloneWith({
      bookingdates: { checkin, checkout: this.booking.bookingdates.checkout },
    }) as this;
  }

  withCheckoutDate(checkout: string): this {
    return this.cloneWith({
      bookingdates: { checkin: this.booking.bookingdates.checkin, checkout },
    }) as this;
  }

  withAdditionalNeeds(additionalneeds: string): this {
    return this.cloneWith({ additionalneeds }) as this;
  }

  build(): Booking {
    return { ...this.booking, bookingdates: { ...this.booking.bookingdates } };
  }
}
