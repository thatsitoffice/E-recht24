import { SiteProfile } from '@prisma/client'
import { DocumentPlan, DocumentSection } from './rules-engine'

export interface GeneratedDocument {
  title: string
  language: string
  region: string
  sections: Array<{
    heading: string
    body: string
    bullets?: string[]
  }>
  missing_inputs: string[]
  warnings: string[]
}

/**
 * Builds a prompt for the LLM to generate document content
 */
export class PromptBuilder {
  static buildPrompt(plan: DocumentPlan, profile: SiteProfile): string {
    const activeSections = plan.sections.filter(section => {
      if (section.condition) {
        return section.condition(profile)
      }
      return true
    })

    const profileData = this.extractProfileData(profile)

    return `Du bist ein Experte für deutsche und europäische Datenschutz- und Impressumspflichten.

AUFGABE:
Erstelle einen ${plan.title} für eine Website basierend auf den folgenden Informationen.

WICHTIGE HINWEISE:
- Verwende NUR die bereitgestellten Informationen. Erfinde KEINE Details.
- Verwende formelle, rechtlich korrekte Sprache (${profile.tone || 'formal'}).
- Region: ${profile.region || 'DE'}
- Sprache: Deutsch
- Strukturiere den Text nach den vorgegebenen Abschnitten.
- Jeder Abschnitt sollte klar und verständlich sein.
- Füge rechtliche Grundlagen nur an, wenn sie im Plan angegeben sind.

WEBSITE-INFORMATIONEN:
${JSON.stringify(profileData, null, 2)}

ABSCHNITTE ZU ERSTELLEN:
${activeSections.map((section, idx) => {
  return `${idx + 1}. ${section.heading}
   - Erforderlich: ${section.required ? 'Ja' : 'Nein'}
   - Platzhalter: ${section.placeholders.join(', ') || 'Keine'}
   ${section.legalBasis ? `- Rechtsgrundlage: ${section.legalBasis.join(', ')}` : ''}`
}).join('\n\n')}

FEHLENDE EINGABEN:
${plan.missingInputs.length > 0 ? plan.missingInputs.join(', ') : 'Keine'}

WARNUNGEN:
${plan.warnings.length > 0 ? plan.warnings.join('\n') : 'Keine'}

FORMAT:
Gib eine JSON-Antwort im folgenden Format zurück. Die Antwort muss gültiges JSON sein:

{
  "title": "${plan.title}",
  "language": "de",
  "region": "${profile.region || 'DE'}",
  "sections": [
    {
      "heading": "Abschnittsüberschrift",
      "body": "Haupttext des Abschnitts...",
      "bullets": ["Punkt 1", "Punkt 2"]
    }
  ],
  "missing_inputs": [],
  "warnings": []
}

WICHTIG: 
- Verwende die exakten Überschriften aus dem Plan.
- Fülle Platzhalter mit den tatsächlichen Werten aus den Website-Informationen.
- Wenn Informationen fehlen, erwähne dies in den warnings.
- Schreibe vollständige, grammatikalisch korrekte Sätze.
- Verwende keine Markdown-Formatierung im body, nur im bullets-Array.
- Die Antwort muss gültiges JSON sein (keine Markdown-Code-Blöcke).`
  }

  private static extractProfileData(profile: SiteProfile): Record<string, any> {
    return {
      domain: profile.domain,
      companyType: profile.companyType,
      companyName: profile.companyName,
      address: {
        street: profile.addressStreet,
        city: profile.addressCity,
        zip: profile.addressZip,
        country: profile.addressCountry,
      },
      contact: {
        email: profile.contactEmail,
        phone: profile.contactPhone,
      },
      representatives: profile.representatives ? JSON.parse(profile.representatives) : null,
      registerInfo: profile.registerInfo,
      vatId: profile.vatId,
      responsiblePerson: profile.responsiblePerson,
      hostingProvider: profile.hostingProvider,
      cms: profile.cms,
      cdn: profile.cdn,
      analytics: profile.analytics,
      tagManager: profile.tagManager,
      marketingPixels: profile.marketingPixels,
      embeddedContent: profile.embeddedContent,
      newsletterTool: profile.newsletterTool,
      contactForm: profile.contactForm,
      bookingSystem: profile.bookingSystem,
      userAccounts: profile.userAccounts,
      comments: profile.comments,
      recaptcha: profile.recaptcha,
      setsCookies: profile.setsCookies,
      cookieCategories: profile.cookieCategories,
      consentMode: profile.consentMode,
      cmpProvider: profile.cmpProvider,
    }
  }

  static getJsonSchema(): object {
    return {
      type: 'object',
      properties: {
        title: { type: 'string' },
        language: { type: 'string' },
        region: { type: 'string' },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              heading: { type: 'string' },
              body: { type: 'string' },
              bullets: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            required: ['heading', 'body'],
          },
        },
        missing_inputs: {
          type: 'array',
          items: { type: 'string' },
        },
        warnings: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['title', 'language', 'region', 'sections'],
    }
  }
}
