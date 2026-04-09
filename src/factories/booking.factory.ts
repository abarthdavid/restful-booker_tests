import { faker } from '@faker-js/faker';
import { Booking } from '../types/booking.types';
import { BookingBuilder } from '../builders/booking.builder';

/**
 * Formats a Date to the YYYY-MM-DD string required by the API.
 *
 * @param date - The date to format.
 * @returns A string in YYYY-MM-DD format.
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * BookingFactory uses the Factory pattern combined with Faker.js to generate
 * realistic, randomised test data. It delegates to the BookingBuilder to
 * ensure all objects are constructed consistently.
 */
export class BookingFactory {
  /**
   * Creates a booking with fully randomised data using Faker.js.
   * Useful for testing with varied, realistic test data.
   *
   * @returns A Booking object populated with random values.
   */
  static createRandom(): Booking {
    const checkin = faker.date.future({ years: 1 });
    const checkout = faker.date.future({ years: 1, refDate: checkin });

    return new BookingBuilder()
      .withFirstName(faker.person.firstName())
      .withLastName(faker.person.lastName())
      .withTotalPrice(faker.number.int({ min: 50, max: 1000 }))
      .withDepositPaid(faker.datatype.boolean())
      .withBookingDates({
        checkin: formatDate(checkin),
        checkout: formatDate(checkout),
      })
      .withAdditionalNeeds(faker.helpers.arrayElement(['Breakfast', 'Lunch', 'Dinner', 'WiFi', '']))
      .build();
  }

  /**
   * Creates a booking with known, deterministic data for assertions and testing.
   * Useful for predictable test scenarios where exact values are needed.
   *
   * @returns A Booking object with fixed test values (Jim Brown, $111, etc.).
   */
  static createDefault(): Booking {
    return new BookingBuilder()
      .withFirstName('Jim')
      .withLastName('Brown')
      .withTotalPrice(111)
      .withDepositPaid(true)
      .withBookingDates({ checkin: '2025-06-01', checkout: '2025-06-10' })
      .withAdditionalNeeds('Breakfast')
      .build();
  }

  /**
   * Creates multiple random bookings.
   */
  static createMany(count: number): Booking[] {
    return Array.from({ length: count }, () => BookingFactory.createRandom());
  }

  /**
   * Creates a booking specifically designed to update an existing one.
   */
  static createUpdate(): Booking {
    return new BookingBuilder()
      .withFirstName(faker.person.firstName())
      .withLastName(faker.person.lastName())
      .withTotalPrice(faker.number.int({ min: 200, max: 2000 }))
      .withDepositPaid(true)
      .withBookingDates({ checkin: '2026-01-01', checkout: '2026-01-14' })
      .withAdditionalNeeds('Airport transfer')
      .build();
  }

  /**
   * Payload without required booking fields for negative tests.
   */
  static createMissingRequiredFieldsPayload(): Record<string, unknown> {
    return {
      additionalneeds: faker.helpers.arrayElement(['Breakfast only', 'WiFi']),
    };
  }

  /**
   * Payload with invalid date strings.
   */
  static createInvalidDateFormatPayload(): Booking {
    return new BookingBuilder()
      .withFirstName(faker.person.firstName())
      .withLastName(faker.person.lastName())
      .withTotalPrice(faker.number.int({ min: 50, max: 500 }))
      .withDepositPaid(true)
      .withBookingDates({
        checkin: 'not-a-date',
        checkout: 'also-not-a-date',
      })
      .build();
  }

  /**
   * Payload where checkout is before checkin.
   */
  static createCheckoutBeforeCheckinPayload(): Booking {
    return new BookingBuilder()
      .withFirstName(faker.person.firstName())
      .withLastName(faker.person.lastName())
      .withTotalPrice(faker.number.int({ min: 50, max: 500 }))
      .withDepositPaid(true)
      .withBookingDates({
        checkin: '2026-12-31',
        checkout: '2026-01-01',
      })
      .build();
  }

  /**
   * Deliberately malformed JSON body for parser validation scenarios.
   */
  static createMalformedJsonPayload(): string {
    return '{"firstname":"A",';
  }
}
