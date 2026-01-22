import type { APIRoute } from 'astro';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

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
        JSON.stringify({ success: true, documents: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const documents = await prisma.document.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        type: true,
        title: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return new Response(
      JSON.stringify({ success: true, documents }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch documents' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
