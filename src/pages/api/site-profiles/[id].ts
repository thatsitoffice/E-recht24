import type { APIRoute } from 'astro';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export const GET: APIRoute = async ({ params, request }) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const siteProfile = await prisma.siteProfile.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!siteProfile) {
      return new Response(
        JSON.stringify({ error: 'Site profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, siteProfile }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching site profile:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch site profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify ownership
    const existing = await prisma.siteProfile.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    });

    if (!existing) {
      return new Response(
        JSON.stringify({ error: 'Site profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    const siteProfile = await prisma.siteProfile.update({
      where: { id: params.id },
      data: body,
    });

    return new Response(
      JSON.stringify({ success: true, siteProfile }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error updating site profile:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to update site profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
