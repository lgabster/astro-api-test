import type { APIRoute } from 'astro';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export const get: APIRoute = async () => {
  const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const post: APIRoute = async (request) => {
  const body = await request;
  const result = userSchema.safeParse(body);

  if (!result.success) {
    return new Response(JSON.stringify(result.error.issues), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const newUser = { id: 2, ...result.data };
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Set-Cookie': 'userId=2; HttpOnly; Path=/; Max-Age=3600',
  });
  return new Response(JSON.stringify(newUser), {
    status: 201,
    headers,
  });
};
