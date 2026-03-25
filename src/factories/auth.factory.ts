import { AuthCredentials } from '../types/booking.types';
import { AUTH_CREDENTIALS } from '../config/api.config';

/**
 * AuthFactory centralizes credential variants for auth-related tests.
 */
export class AuthFactory {
  static createValidCredentials(): AuthCredentials {
    return {
      username: AUTH_CREDENTIALS.username,
      password: AUTH_CREDENTIALS.password,
    };
  }

  static createWrongPasswordCredentials(): AuthCredentials {
    return {
      username: AUTH_CREDENTIALS.username,
      password: 'wrongpassword',
    };
  }

  static createWrongUsernameCredentials(): AuthCredentials {
    return {
      username: 'unknownuser',
      password: AUTH_CREDENTIALS.password,
    };
  }

  static createEmptyCredentials(): AuthCredentials {
    return {
      username: '',
      password: '',
    };
  }

  static toBasicAuthHeader(credentials: AuthCredentials): string {
    return `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`;
  }
}
