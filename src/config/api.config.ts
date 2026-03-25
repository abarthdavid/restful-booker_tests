export const BASE_URL = 'https://restful-booker.herokuapp.com';

export const ENDPOINTS = {
  auth: '/auth',
  booking: '/booking',
  bookingById: (id: number) => `/booking/${id}`,
  ping: '/ping',
} as const;

export const AUTH_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
} as const;

export const BASIC_AUTH_HEADER = `Basic ${Buffer.from(
  `${AUTH_CREDENTIALS.username}:${AUTH_CREDENTIALS.password}`,
).toString('base64')}`;
