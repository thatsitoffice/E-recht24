import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { RulesEngine } from '@/lib/rules-engine'
import { PromptBuilder } from '@/lib/prompt-builder'
import { generateDocument, estimateTokens } from '@/lib/openai-client'
import { DocumentRenderer } from '@/lib/document-renderer'

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
    const { siteProfileId, documentType } = body

    if (!siteProfileId || !documentType) {
      return NextResponse.json(
        { error: 'Missing siteProfileId or documentType' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get site profile (ensure it belongs to user)
    const siteProfile = await prisma.siteProfile.findFirst({
      where: { 
        id: siteProfileId,
        userId: user.id,
      },
    })

    if (!siteProfile) {
      return NextResponse.json(
        { error: 'Site profile not found' },
        { status: 404 }
      )
    }

    // Generate document plan using rules engine
    const plan = RulesEngine.generatePlan(
      documentType as 'impressum' | 'datenschutz' | 'cookie_policy' | 'cookie_consent',
      siteProfile
    )

    // Build prompt
    const prompt = PromptBuilder.buildPrompt(plan, siteProfile)

    // Generate document using OpenAI
    const generatedDoc = await generateDocument(prompt)

    // Render to text and HTML
    const textContent = DocumentRenderer.renderText(generatedDoc)
    const htmlContent = DocumentRenderer.renderHTML(generatedDoc)

    // Save document
    const document = await prisma.document.create({
      data: {
        type: documentType,
        title: generatedDoc.title,
        content: generatedDoc as any,
        htmlContent,
        textContent,
        siteProfileId: siteProfile.id,
        userId: siteProfile.userId,
        version: 1,
      },
    })

    // Log generation
    const tokensUsed = estimateTokens(prompt + JSON.stringify(generatedDoc))
    await prisma.generationLog.create({
      data: {
        userId: siteProfile.userId,
        documentType,
        model: 'gpt-4-turbo-preview',
        tokensUsed,
        status: 'success',
      },
    })

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        type: document.type,
        title: document.title,
        content: document.content,
        htmlContent: document.htmlContent,
        textContent: document.textContent,
        version: document.version,
        createdAt: document.createdAt,
      },
    })
  } catch (error: any) {
    console.error('Generation error:', error)

    // Try to log the error
    try {
      const body = await request.json()
      if (body.userId) {
        await prisma.generationLog.create({
          data: {
            userId: body.userId,
            documentType: body.documentType || 'unknown',
            status: 'error',
            error: error.message,
          },
        })
      }
    } catch (logError) {
      console.error('Failed to log error:', logError)
    }

    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    )
  }
}
