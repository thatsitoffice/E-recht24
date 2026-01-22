import type { APIRoute } from 'astro';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

export const POST: APIRoute = async ({ request }) => {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
        },
      });
    }

    const siteProfile = await prisma.siteProfile.create({
      data: {
        name: body.name || 'Neues Profil',
        userId: user.id,
        ...body,
      },
    });

    return new Response(
      JSON.stringify({ success: true, siteProfile }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error creating site profile:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create site profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ request }) => {
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
        JSON.stringify({ success: true, siteProfiles: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const siteProfiles = await prisma.siteProfile.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return new Response(
      JSON.stringify({ success: true, siteProfiles }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching site profiles:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch site profiles' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
