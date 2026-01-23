import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || null,
        },
      })
    }

    const siteProfile = await prisma.siteProfile.create({
      data: {
        name: body.name || 'Neues Profil',
        userId: user.id,
        ...body,
      },
    })

    return NextResponse.json({ success: true, siteProfile })
  } catch (error: any) {
    console.error('Error creating site profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create site profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ success: true, siteProfiles: [] })
    }

    const siteProfiles = await prisma.siteProfile.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, siteProfiles })
  } catch (error: any) {
    console.error('Error fetching site profiles:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch site profiles' },
      { status: 500 }
    )
  }
}
