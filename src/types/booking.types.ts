/**
 * Core domain types for the Restful-Booker API.
 */

/**
 * Represents check-in and check-out dates for a booking.
 *
 * @property checkin - The check-in date in YYYY-MM-DD format.
 * @property checkout - The check-out date in YYYY-MM-DD format.
 */
export interface BookingDates {
  checkin: string; // Format: YYYY-MM-DD
  checkout: string; // Format: YYYY-MM-DD
}

/**
 * Represents a complete booking entity.
 *
 * @property bookingid - Unique identifier for the booking.
 * @property firstname - First name of the guest.
 * @property lastname - Last name of the guest.
 * @property totalprice - Total price for the booking in numeric form.
 * @property depositpaid - Whether a deposit has been paid.
 * @property bookingdates - Check-in and check-out dates.
 * @property additionalneeds - Optional special requests or requirements.
 */
export interface Booking {
  bookingid: number;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

/**
 * API response when creating or retrieving a booking.
 *
 * @property bookingid - The ID of the booking.
 * @property booking - The complete booking details.
 */
export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

/**
 * Lightweight booking identifier used in list queries.
 *
 * @property bookingid - The unique booking ID.
 */
export interface BookingId {
  bookingid: number;
}

/**
 * Credentials required for API authentication.
 *
 * @property username - The user's username.
 * @property password - The user's password.
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

/**
 * Authentication response containing the session token.
 *
 * @property token - The authentication token for subsequent requests.
 */
export interface AuthTokenResponse {
  token: string;
}

/**
 * Optional filter parameters for booking list queries.
 * All properties are optional; only provided values are applied as filters.
 *
 * @property firstname - Filter by guest's first name.
 * @property lastname - Filter by guest's last name.
 * @property checkin - Filter by check-in date (YYYY-MM-DD).
 * @property checkout - Filter by check-out date (YYYY-MM-DD).
 */
export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

/**
 * Standard API error response structure.
 *
 * @property status - The HTTP status code.
 * @property message - A descriptive error message.
 */
export interface ApiError {
  status: number;
  message: string;
}

/**
 * Partial booking data for PATCH operations where only some fields are updated.
 */
export type PartialBooking = Partial<Booking>;
