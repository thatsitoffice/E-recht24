import type { APIRoute } from 'astro';
import NextAuth from 'next-auth';
import { authOptions } from '../../../lib/auth';

const handler = NextAuth(authOptions);

export const GET: APIRoute = async ({ request }) => {
  return handler(request as any, {} as any) as any;
};

export const POST: APIRoute = async ({ request }) => {
  return handler(request as any, {} as any) as any;
};
