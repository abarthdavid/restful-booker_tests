import { allure } from 'allure-playwright';
import { test, expect } from '../src/fixtures/test.fixture';
import { AUTH_CREDENTIALS } from '../src/config/api.config';
import { AuthFactory } from '../src/factories/auth.factory';
import { AuthTokenResponse } from '../src/types/booking.types';

test.describe('Auth - CreateToken', () => {
  test.beforeEach(async () => {
    await allure.suite('Authentication');
    await allure.feature('Token Generation');
  });

  test('should return 200 and a valid token with correct credentials', async ({ authService }) => {
    await allure.story('Happy path authentication');
    await allure.description('Verifies that valid credentials produce a bearer token.');
    await allure.severity('critical');

    const response = await authService.createToken(AUTH_CREDENTIALS);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as AuthTokenResponse;
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('should return 200 but with a reason field on wrong password', async ({ authService }) => {
    await allure.story('Invalid password');
    await allure.description(
      'The API returns HTTP 200 but a "reason: Bad credentials" body for wrong passwords.',
    );
    await allure.severity('critical');

    const response = await authService.createToken({
      ...AuthFactory.createWrongPasswordCredentials(),
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Record<string, string>;
    // The API responds with { "reason": "Bad credentials" } instead of 401
    expect(body).not.toHaveProperty('token');
    expect(body).toHaveProperty('reason');
    expect(body['reason']).toBe('Bad credentials');
  });

  test('should return 200 but with a reason field on wrong username', async ({ authService }) => {
    await allure.story('Invalid username');
    await allure.severity('normal');

    const response = await authService.createToken({
      ...AuthFactory.createWrongUsernameCredentials(),
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Record<string, string>;
    expect(body).not.toHaveProperty('token');
    expect(body).toHaveProperty('reason');
  });

  test('should return 200 but fail gracefully with empty credentials', async ({ authService }) => {
    await allure.story('Empty credentials');
    await allure.severity('normal');

    const response = await authService.createToken({
      ...AuthFactory.createEmptyCredentials(),
    });

    expect(response.status()).toBe(200);
    const body = (await response.json()) as Record<string, string>;
    expect(body).not.toHaveProperty('token');
  });
});
