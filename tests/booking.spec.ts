import { allure } from 'allure-playwright';
import { test, expect } from '../src/fixtures/test.fixture';
import { BookingFactory } from '../src/factories/booking.factory';
import { BookingResponse, BookingId, Booking } from '../src/types/booking.types';
import { createBooking } from '../src/utils/booking.helper';
import {
  createBookingWithPayload,
  expectStatusAndParseJson,
  expectBookingIdsToContain,
  expectBookingToMatch,
} from '../src/utils/booking.assertion';

test.describe('Booking - Health Check (Ping)', () => {
  test('should return 201 on health check ping', async ({ bookingService }) => {
    await allure.suite('Booking');
    await allure.feature('Health Check');

    const response = await bookingService.ping();
    expect(response.status()).toBe(201);
  });
});

test.describe('Booking - GetBookingIds', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Get Booking IDs');
  });

  test('should return 200 and an array of booking IDs', async ({ bookingService }) => {
    await allure.story('Get all booking IDs');
    await allure.severity('critical');

    const response = await bookingService.getBookingIds();

    expect(response.status()).toBe(200);
    const body = (await response.json()) as BookingId[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    body.forEach((item) => {
      expect(item).toHaveProperty('bookingid');
      expect(typeof item.bookingid).toBe('number');
    });
  });

  test('should filter booking IDs by firstname', async ({ bookingService, bookingTracker }) => {
    await allure.story('Filter by firstname');
    await allure.severity('normal');

    // Create a booking with a known first name
    const { booking, created } = await createBooking(bookingService);
    bookingTracker.track(created.bookingid);

    const filterResponse = await bookingService.getBookingIds({
      firstname: booking.firstname,
    });
    const ids = await expectStatusAndParseJson<BookingId[]>(filterResponse, 200);
    expectBookingIdsToContain(ids, created.bookingid);
  });

  test('should filter booking IDs by lastname', async ({ bookingService, bookingTracker }) => {
    await allure.story('Filter by lastname');
    await allure.severity('normal');

    const { booking, created } = await createBooking(bookingService);
    bookingTracker.track(created.bookingid);

    const filterResponse = await bookingService.getBookingIds({
      lastname: booking.lastname,
    });
    const ids = await expectStatusAndParseJson<BookingId[]>(filterResponse, 200);
    expectBookingIdsToContain(ids, created.bookingid);
  });
});

test.describe('Booking - GetBooking', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Get Single Booking');
  });

  test('should return 200 and correct booking data for a valid ID', async ({
    bookingService,
    bookingTracker,
  }) => {
    await allure.story('Get booking by ID');
    await allure.severity('critical');

    const { booking, created } = await createBooking(bookingService);
    bookingTracker.track(created.bookingid);

    const getResponse = await bookingService.getBookingById(created.bookingid);
    const fetched = await expectStatusAndParseJson<Booking>(getResponse, 200);
    expectBookingToMatch(fetched, booking);
  });

  test('should return 404 for a non-existent booking ID', async ({ bookingService }) => {
    await allure.story('Non-existent booking ID');
    await allure.severity('normal');

    const response = await bookingService.getBookingById(999999999);
    expect(response.status()).toBe(404);
  });
});

test.describe('Booking - CreateBooking', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Create Booking');
  });

  test('should return 200 and create a booking with random data', async ({
    bookingService,
    bookingTracker,
  }) => {
    await allure.story('Create booking with Faker data');
    await allure.severity('critical');

    const booking = BookingFactory.createRandom();
    await allure.parameter('firstname', booking.firstname);
    await allure.parameter('lastname', booking.lastname);
    await allure.parameter('totalprice', String(booking.totalprice));

    const response = await bookingService.createBooking(booking);
    const body = await expectStatusAndParseJson<BookingResponse>(response, 200);
    expect(body).toHaveProperty('bookingid');
    expect(typeof body.bookingid).toBe('number');
    expectBookingToMatch(body.booking, booking);
    bookingTracker.track(body.bookingid);
  });

  test('should create multiple bookings with unique IDs', async ({
    bookingService,
    bookingTracker,
  }) => {
    await allure.story('Create multiple bookings');
    await allure.severity('normal');

    const bookings = BookingFactory.createMany(3);
    const ids: number[] = [];

    for (const booking of bookings) {
      const bookingId = await createBookingWithPayload(bookingService, booking);
      bookingTracker.track(bookingId);
      ids.push(bookingId);
    }

    // All IDs should be unique
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

test.describe('Booking - UpdateBooking (PUT)', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Update Booking');
  });

  test('should return 200 and fully update a booking with token auth', async ({
    bookingService,
    authenticatedBookingService,
    bookingTracker,
  }) => {
    await allure.story('Full update with token auth');
    await allure.severity('critical');

    const original = BookingFactory.createDefault();
    const bookingid = await createBookingWithPayload(bookingService, original);
    bookingTracker.track(bookingid);

    const updated = BookingFactory.createUpdate();
    const updateResponse = await authenticatedBookingService.updateBooking(bookingid, updated);
    expect(updateResponse.status()).toBe(200);

    const body = (await updateResponse.json()) as Booking;
    expect(body.firstname).toBe(updated.firstname);
    expect(body.lastname).toBe(updated.lastname);
    expect(body.totalprice).toBe(updated.totalprice);
  });

  test('should return 200 and update booking with Basic Auth', async ({
    bookingService,
    basicAuthHeader,
    bookingTracker,
  }) => {
    await allure.story('Full update with Basic Auth');
    await allure.severity('normal');

    const original = BookingFactory.createDefault();
    const bookingid = await createBookingWithPayload(bookingService, original);
    bookingTracker.track(bookingid);

    const updated = BookingFactory.createUpdate();
    const putResponse = await bookingService.updateBookingWithBasicAuth(
      bookingid,
      updated,
      basicAuthHeader,
    );
    expect(putResponse.status()).toBe(200);
  });
});

test.describe('Booking - PartialUpdateBooking (PATCH)', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Partial Update Booking');
  });

  test('should return 200 and partially update firstname and lastname', async ({
    bookingService,
    authenticatedBookingService,
    bookingTracker,
  }) => {
    await allure.story('Partial update with PATCH');
    await allure.severity('critical');

    const original = BookingFactory.createDefault();
    const bookingid = await createBookingWithPayload(bookingService, original);
    bookingTracker.track(bookingid);

    const patch = { firstname: 'UpdatedFirst', lastname: 'UpdatedLast' };
    const patchResponse = await authenticatedBookingService.partialUpdateBooking(bookingid, patch);
    expect(patchResponse.status()).toBe(200);

    const body = (await patchResponse.json()) as Booking;
    expect(body.firstname).toBe('UpdatedFirst');
    expect(body.lastname).toBe('UpdatedLast');
    // Other fields should remain unchanged
    expect(body.totalprice).toBe(original.totalprice);
  });
});

test.describe('Booking - DeleteBooking', () => {
  test.beforeEach(async () => {
    await allure.suite('Booking');
    await allure.feature('Delete Booking');
  });

  test('should return 201 and delete a booking with token auth', async ({
    bookingService,
    authenticatedBookingService,
    bookingTracker,
  }) => {
    await allure.story('Delete with token auth');
    await allure.severity('critical');

    const booking = BookingFactory.createRandom();
    const bookingid = await createBookingWithPayload(bookingService, booking);
    bookingTracker.track(bookingid);

    const deleteResponse = await authenticatedBookingService.deleteBooking(bookingid);
    expect(deleteResponse.status()).toBe(201);
    bookingTracker.untrack(bookingid);

    // Verify it no longer exists
    const getResponse = await bookingService.getBookingById(bookingid);
    expect(getResponse.status()).toBe(404);
  });

  test('should return 201 and delete a booking with Basic Auth', async ({
    bookingService,
    authenticatedBookingService,
    basicAuthHeader,
    bookingTracker,
  }) => {
    await allure.story('Delete with Basic Auth');
    await allure.severity('normal');

    const booking = BookingFactory.createRandom();
    const bookingid = await createBookingWithPayload(bookingService, booking);
    bookingTracker.track(bookingid);

    const deleteResponse = await authenticatedBookingService.deleteBookingWithBasicAuth(
      bookingid,
      basicAuthHeader,
    );
    expect(deleteResponse.status()).toBe(201);
    bookingTracker.untrack(bookingid);

    const getResponse = await bookingService.getBookingById(bookingid);
    expect(getResponse.status()).toBe(404);
  });
});
