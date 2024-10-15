import { describe, it, expect } from 'vitest';
import { get, post } from './users';
import type { APIContext } from 'astro';

describe('Users API', () => {
  it('should return a list of users', async () => {
    const response = await get({} as APIContext);
    const users = await response.json();

    expect(response.status).toBe(200);
    expect(users).toEqual([{ id: 1, name: 'John Doe', email: 'john@example.com' }]);
  });

  it('should create a new user', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    const response = await post(newUser as unknown as APIContext);
    const createdUser = await response.json();

    expect(response.status).toBe(201);
    expect(createdUser).toEqual({ id: 2, ...newUser });
    expect(response.status).toBe(201);

    // Test the cookie are exist
    const setCookieHeader = response.headers.get('Set-Cookie');
    expect(setCookieHeader).toContain('userId=2')

  });

  it('should return an error for invalid user data', async () => {
    const invalidUser = { name: '', email: 'invalid-email' };
    const response = await post(invalidUser as unknown as APIContext);
    const error = await response.json();

    expect(response.status).toBe(400);
    expect(error).toHaveLength(2);
  });
});
