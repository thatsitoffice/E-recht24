import OpenAI from 'openai'
import { PromptBuilder, GeneratedDocument } from './prompt-builder'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateDocument(
  prompt: string,
  model: string = 'gpt-4-turbo-preview'
): Promise<GeneratedDocument> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'Du bist ein Experte für deutsche und europäische Datenschutz- und Impressumspflichten. Du gibst immer gültiges JSON zurück.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content in OpenAI response')
    }

    const parsed = JSON.parse(content) as GeneratedDocument

    // Validate structure
    if (!parsed.title || !parsed.sections || !Array.isArray(parsed.sections)) {
      throw new Error('Invalid document structure from OpenAI')
    }

    return parsed
  } catch (error) {
    console.error('OpenAI generation error:', error)
    throw error
  }
}

export function estimateTokens(text: string): number {
  // Rough estimation: ~4 characters per token
  return Math.ceil(text.length / 4)
}
