/**
 * Core domain types for the Restful-Booker API.
 */

export interface BookingDates {
  checkin: string; // Format: YYYY-MM-DD
  checkout: string; // Format: YYYY-MM-DD
}

export interface Booking {
  bookingid: number;
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

export interface BookingId {
  bookingid: number;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthTokenResponse {
  token: string;
}

export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface ApiError {
  status: number;
  message: string;
}

export type PartialBooking = Partial<Booking>;
