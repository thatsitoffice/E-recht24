import type { APIRoute } from 'astro';
import { prisma } from '../../lib/prisma';
import { RulesEngine } from '../../lib/rules-engine';
import { PromptBuilder } from '../../lib/prompt-builder';
import { generateDocument, estimateTokens } from '../../lib/openai-client';
import { DocumentRenderer } from '../../lib/document-renderer';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/auth';

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
    const { siteProfileId, documentType } = body;

    if (!siteProfileId || !documentType) {
      return new Response(
        JSON.stringify({ error: 'Missing siteProfileId or documentType' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get site profile (ensure it belongs to user)
    const siteProfile = await prisma.siteProfile.findFirst({
      where: { 
        id: siteProfileId,
        userId: user.id,
      },
    });

    if (!siteProfile) {
      return new Response(
        JSON.stringify({ error: 'Site profile not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate document plan using rules engine
    const plan = RulesEngine.generatePlan(
      documentType as 'impressum' | 'datenschutz' | 'cookie_policy' | 'cookie_consent',
      siteProfile
    );

    // Build prompt
    const prompt = PromptBuilder.buildPrompt(plan, siteProfile);

    // Generate document using OpenAI
    const generatedDoc = await generateDocument(prompt);

    // Render to text and HTML
    const textContent = DocumentRenderer.renderText(generatedDoc);
    const htmlContent = DocumentRenderer.renderHTML(generatedDoc);

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
    });

    // Log generation
    const tokensUsed = estimateTokens(prompt + JSON.stringify(generatedDoc));
    await prisma.generationLog.create({
      data: {
        userId: siteProfile.userId,
        documentType,
        model: 'gpt-4-turbo-preview',
        tokensUsed,
        status: 'success',
      },
    });

    return new Response(
      JSON.stringify({
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
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Generation error:', error);

    return new Response(
      JSON.stringify({ error: error.message || 'Generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
