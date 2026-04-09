import { AuthCredentials } from '../types/booking.types';
import { AUTH_CREDENTIALS } from '../config/api.config';

/**
 * AuthFactory centralizes credential variants for auth-related tests.
 */
export class AuthFactory {
  /**
   * Generates valid authentication credentials.
   *
   * @returns AuthCredentials with correct username and password.
   */
  static createValidCredentials(): AuthCredentials {
    return {
      username: AUTH_CREDENTIALS.username,
      password: AUTH_CREDENTIALS.password,
    };
  }

  /**
   * Generates credentials with the correct username but an incorrect password.
   * Useful for testing authentication failure scenarios.
   *
   * @returns AuthCredentials with valid username but wrong password.
   */
  static createWrongPasswordCredentials(): AuthCredentials {
    return {
      username: AUTH_CREDENTIALS.username,
      password: 'wrongpassword',
    };
  }

  /**
   * Generates credentials with an unknown username but correct password.
   * Useful for testing non-existent user scenarios.
   *
   * @returns AuthCredentials with an invalid username and valid password.
   */
  static createWrongUsernameCredentials(): AuthCredentials {
    return {
      username: 'unknownuser',
      password: AUTH_CREDENTIALS.password,
    };
  }

  /**
   * Generates credentials with both username and password empty.
   * Useful for testing validation of empty inputs.
   *
   * @returns AuthCredentials with empty username and password.
   */
  static createEmptyCredentials(): AuthCredentials {
    return {
      username: '',
      password: '',
    };
  }

  /**
   * Encodes the given credentials as a Basic Authentication HTTP header value.
   * Converts credentials to Base64 format as required by the Basic Auth standard.
   *
   * @param credentials - The AuthCredentials to encode.
   * @returns A Basic Auth header value in the format "Basic <base64_encoded_credentials>".
   */
  static toBasicAuthHeader(credentials: AuthCredentials): string {
    return `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`;
  }
}
