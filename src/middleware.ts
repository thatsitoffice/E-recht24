import { defineMiddleware } from 'astro:middleware';
import { getToken } from 'next-auth/jwt';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;
  const pathname = new URL(url).pathname;

  // Protect API routes (except auth routes)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const token = await getToken({ 
      req: request as any, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // Protect dashboard and generator pages
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/generator')) {
    const token = await getToken({ 
      req: request as any, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (!token) {
      const signInUrl = new URL('/auth/signin', url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return Response.redirect(signInUrl);
    }
  }

  // Add security headers
  const response = await next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
});
