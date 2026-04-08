import 'dotenv/config';

/** The base URL for the Restful-Booker API. */
export const BASE_URL = 'https://restful-booker.herokuapp.com';

/**
 * API endpoint paths for all booking operations.
 *
 * @property auth - Authentication endpoint for token creation.
 * @property booking - Booking list and creation endpoint.
 * @property bookingById - Function that generates the endpoint for a specific booking ID.
 * @property ping - Health check endpoint.
 */
export const ENDPOINTS = {
  auth: '/auth',
  booking: '/booking',
  bookingById: (id: number) => `/booking/${id}`,
  ping: '/ping',
} as const;

type EnvMap = Record<string, string | undefined>;

const env: EnvMap =
  typeof globalThis === 'object' &&
  'process' in globalThis &&
  typeof (globalThis as { process?: { env?: EnvMap } }).process?.env === 'object'
    ? ((globalThis as { process?: { env?: EnvMap } }).process!.env as EnvMap)
    : {};

/**
 * Retrieves a required environment variable or throws an error if not found.
 * Ensures all necessary configuration is available before tests run.
 *
 * @param name - The name of the environment variable to retrieve.
 * @returns The value of the environment variable.
 * @throws Error if the environment variable is not defined or empty.
 */
const getRequiredEnv = (name: string): string => {
  const value = env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Configure it before running tests.`,
    );
  }
  return value;
};

type BufferApi = {
  from: (input: string) => {
    toString: (encoding: 'base64') => string;
  };
};

const bufferApi = (globalThis as { Buffer?: BufferApi }).Buffer;

if (!bufferApi) {
  throw new Error('Buffer API is unavailable in this runtime.');
}

/**
 * Authentication credentials loaded from environment variables.
 *
 * @property username - The test user's username from AUTH_USERNAME env var.
 * @property password - The test user's password from AUTH_PASSWORD env var.
 */
export const AUTH_CREDENTIALS = {
  username: getRequiredEnv('AUTH_USERNAME'),
  password: getRequiredEnv('AUTH_PASSWORD'),
} as const;

/**
 * Pre-computed Basic Authentication header value.
 * Contains Base64-encoded credentials in the format: Basic <base64(username:password)>
 */
export const BASIC_AUTH_HEADER = `Basic ${bufferApi
  .from(`${AUTH_CREDENTIALS.username}:${AUTH_CREDENTIALS.password}`)
  .toString('base64')}`;
