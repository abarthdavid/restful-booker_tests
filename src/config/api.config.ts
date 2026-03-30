import 'dotenv/config';

export const BASE_URL = 'https://restful-booker.herokuapp.com';

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

export const AUTH_CREDENTIALS = {
  username: getRequiredEnv('AUTH_USERNAME'),
  password: getRequiredEnv('AUTH_PASSWORD'),
} as const;

export const BASIC_AUTH_HEADER = `Basic ${bufferApi
  .from(`${AUTH_CREDENTIALS.username}:${AUTH_CREDENTIALS.password}`)
  .toString('base64')}`;
