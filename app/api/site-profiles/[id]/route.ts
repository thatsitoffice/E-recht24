import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const siteProfile = await prisma.siteProfile.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    })

    if (!siteProfile) {
      return NextResponse.json(
        { error: 'Site profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, siteProfile })
  } catch (error: any) {
    console.error('Error fetching site profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch site profile' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    const existing = await prisma.siteProfile.findFirst({
      where: { 
        id: params.id,
        userId: user.id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Site profile not found' },
        { status: 404 }
      )
    }

    const body = await request.json()

    const siteProfile = await prisma.siteProfile.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ success: true, siteProfile })
  } catch (error: any) {
    console.error('Error updating site profile:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update site profile' },
      { status: 500 }
    )
  }
}
