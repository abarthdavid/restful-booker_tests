import { Booking, BookingDates } from '../types/booking.types';

/**
 * BookingBuilder implements the Builder pattern to construct Booking objects
 * with a fluent API. This provides fine-grained control over test data
 * and makes test intent explicit.
 */
export class BookingBuilder {
  private booking: Booking = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 100,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-01-01',
      checkout: '2025-01-07',
    },
  };

  withFirstName(firstname: string): this {
    this.booking.firstname = firstname;
    return this;
  }

  withLastName(lastname: string): this {
    this.booking.lastname = lastname;
    return this;
  }

  withTotalPrice(totalprice: number): this {
    this.booking.totalprice = totalprice;
    return this;
  }

  withDepositPaid(depositpaid: boolean): this {
    this.booking.depositpaid = depositpaid;
    return this;
  }

  withBookingDates(dates: BookingDates): this {
    this.booking.bookingdates = dates;
    return this;
  }

  withCheckinDate(checkin: string): this {
    this.booking.bookingdates.checkin = checkin;
    return this;
  }

  withCheckoutDate(checkout: string): this {
    this.booking.bookingdates.checkout = checkout;
    return this;
  }

  withAdditionalNeeds(additionalneeds: string): this {
    this.booking.additionalneeds = additionalneeds;
    return this;
  }

  build(): Booking {
    return { ...this.booking, bookingdates: { ...this.booking.bookingdates } };
  }
}
