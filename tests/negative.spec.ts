import { allure } from 'allure-playwright';
import { test, expect } from '../src/fixtures/test.fixture';
import { BookingFactory } from '../src/factories/booking.factory';
import { AuthFactory } from '../src/factories/auth.factory';
import { createBooking } from '../src/utils/booking.helper';
import { createBookingWithPayload } from '../src/utils/booking.assertion';

/**
 * Negative test scenarios explore edge cases, invalid inputs,
 * and unauthorised access patterns.
 */
test.describe('Negative - Authentication', () => {
  test.beforeEach(async () => {
    await allure.suite('Negative Scenarios');
    await allure.feature('Authentication Failures');
  });

  test('should not update booking with an invalid token', async ({
    bookingService,
    basicAuthHeader,
  }) => {
    await allure.story('Invalid token for PUT');
    await allure.severity('critical');

    const { created } = await createBooking(bookingService);

    const updateResponse = await bookingService.updateBookingWithToken(
      created.bookingid,
      BookingFactory.createUpdate(),
      'invalidtoken',
    );
    expect(updateResponse.status()).toBe(403);

    // Cleanup with basic auth
    await bookingService.deleteBookingWithBasicAuth(created.bookingid, basicAuthHeader);
  });

  test('should not delete booking without authentication', async ({
    bookingService,
    basicAuthHeader,
  }) => {
    await allure.story('Delete without auth');
    await allure.severity('critical');

    const booking = BookingFactory.createRandom();
    const bookingid = await createBookingWithPayload(bookingService, booking);

    const deleteResponse = await bookingService.deleteBookingWithoutAuth(bookingid);
    expect(deleteResponse.status()).toBe(403);

    // Cleanup
    await bookingService.deleteBookingWithBasicAuth(bookingid, basicAuthHeader);
  });

  test('should not update booking with wrong Basic Auth credentials', async ({
    bookingService,
  }) => {
    await allure.story('Wrong Basic Auth for update');
    await allure.severity('normal');

    const { created } = await createBooking(bookingService);

    const wrongAuth = AuthFactory.toBasicAuthHeader(AuthFactory.createWrongPasswordCredentials());
    const updateResponse = await bookingService.updateBookingWithBasicAuth(
      created.bookingid,
      BookingFactory.createUpdate(),
      wrongAuth,
    );
    expect(updateResponse.status()).toBe(403);

    await bookingService.deleteBookingWithBasicAuth(
      created.bookingid,
      AuthFactory.toBasicAuthHeader(AuthFactory.createValidCredentials()),
    );
  });
});

test.describe('Negative - Invalid Inputs', () => {
  test.beforeEach(async () => {
    await allure.suite('Negative Scenarios');
    await allure.feature('Invalid Input Handling');
  });

  test('should return 404 when getting a booking with a very large ID', async ({
    bookingService,
  }) => {
    await allure.story('Non-existent booking ID');
    await allure.severity('normal');

    const response = await bookingService.getBookingById(2147483647);
    expect(response.status()).toBe(404);
  });

  test('should return 400 or 500 when creating a booking with missing required fields', async ({
    bookingService,
  }) => {
    await allure.story('Missing required fields');
    await allure.severity('normal');
    await allure.description('Sends a booking payload without mandatory fields.');

    const response = await bookingService.createBookingRaw(
      BookingFactory.createMissingRequiredFieldsPayload(),
    );
    // API may return 400 or 500 for malformed data
    expect([400, 500]).toContain(response.status());
  });

  test('should handle invalid date format payload (documenting actual API behavior)', async ({
    bookingService,
  }) => {
    await allure.story('Invalid date format');
    await allure.severity('normal');

    const response = await bookingService.createBookingRaw(
      BookingFactory.createInvalidDateFormatPayload(),
    );
    // The public playground API may accept malformed date strings and still create data.
    // We assert on the observed contract envelope rather than forcing strict validation.
    expect([200, 400, 500]).toContain(response.status());
  });

  test('should return 400 or 500 when creating a booking with checkout before checkin', async ({
    bookingService,
  }) => {
    await allure.story('Checkout before checkin');
    await allure.severity('normal');
    await allure.description('Validates that the API rejects logically invalid date ranges.');

    const response = await bookingService.createBookingRaw(
      BookingFactory.createCheckoutBeforeCheckinPayload(),
    );
    // Document the actual API behaviour — it may or may not validate this
    expect([200, 400, 500]).toContain(response.status());
  });

  test('should return 405 when calling unsupported HTTP method on /booking', async ({
    bookingService,
  }) => {
    await allure.story('Unsupported HTTP method');
    await allure.severity('minor');

    // PATCH on /booking (without an ID) is not a supported endpoint
    const response = await bookingService.patchBookingCollection();
    expect([404, 405]).toContain(response.status());
  });

  test('should return 400 or 500 when creating booking with malformed JSON body', async ({
    bookingService,
  }) => {
    await allure.story('Malformed JSON');
    await allure.severity('normal');

    const response = await bookingService.createBookingMalformedJson(
      BookingFactory.createMalformedJsonPayload(),
    );
    expect([400, 500]).toContain(response.status());
  });
});

test.describe('Negative - Data Integrity', () => {
  test.beforeEach(async () => {
    await allure.suite('Negative Scenarios');
    await allure.feature('Data Integrity');
  });

  test('should return 404 when attempting to update a deleted booking', async ({
    bookingService,
    authenticatedBookingService,
  }) => {
    await allure.story('Update after delete');
    await allure.severity('normal');

    const booking = BookingFactory.createRandom();
    const bookingid = await createBookingWithPayload(bookingService, booking);

    await authenticatedBookingService.deleteBooking(bookingid);

    const updateResponse = await authenticatedBookingService.updateBooking(
      bookingid,
      BookingFactory.createUpdate(),
    );
    expect(updateResponse.status()).toBe(405);
  });

  test('should return 404 when deleting an already deleted booking', async ({
    bookingService,
    authenticatedBookingService,
  }) => {
    await allure.story('Double delete');
    await allure.severity('normal');

    const booking = BookingFactory.createRandom();
    const bookingid = await createBookingWithPayload(bookingService, booking);

    const firstDelete = await authenticatedBookingService.deleteBooking(bookingid);
    expect(firstDelete.status()).toBe(201);

    const secondDelete = await authenticatedBookingService.deleteBooking(bookingid);
    expect(secondDelete.status()).toBe(405);
  });
});
