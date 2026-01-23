import { SiteProfile } from '@prisma/client'

export type DocumentType = 'impressum' | 'datenschutz' | 'cookie_policy' | 'cookie_consent'

export interface DocumentSection {
  heading: string
  required: boolean
  condition?: (profile: SiteProfile) => boolean
  placeholders: string[]
  legalBasis?: string[]
}

export interface DocumentPlan {
  type: DocumentType
  title: string
  sections: DocumentSection[]
  missingInputs: string[]
  warnings: string[]
}

/**
 * Rules engine that determines which sections should be included
 * in a document based on the site profile.
 */
export class RulesEngine {
  static generatePlan(type: DocumentType, profile: SiteProfile): DocumentPlan {
    switch (type) {
      case 'impressum':
        return this.generateImpressumPlan(profile)
      case 'datenschutz':
        return this.generateDatenschutzPlan(profile)
      case 'cookie_policy':
        return this.generateCookiePolicyPlan(profile)
      case 'cookie_consent':
        return this.generateCookieConsentPlan(profile)
      default:
        throw new Error(`Unknown document type: ${type}`)
    }
  }

  private static generateImpressumPlan(profile: SiteProfile): DocumentPlan {
    const missing: string[] = []
    const warnings: string[] = []

    if (!profile.companyName) missing.push('companyName')
    if (!profile.addressStreet) missing.push('addressStreet')
    if (!profile.addressCity) missing.push('addressCity')
    if (!profile.addressZip) missing.push('addressZip')
    if (!profile.contactEmail) missing.push('contactEmail')

    const sections: DocumentSection[] = [
      {
        heading: 'Angaben gemäß § 5 TMG',
        required: true,
        placeholders: ['companyName', 'addressStreet', 'addressCity', 'addressZip'],
      },
      {
        heading: 'Kontakt',
        required: true,
        placeholders: ['contactEmail', 'contactPhone'],
      },
    ]

    if (profile.companyType === 'GmbH' || profile.companyType === 'UG') {
      sections.push({
        heading: 'Handelsregister',
        required: true,
        condition: (p) => p.companyType === 'GmbH' || p.companyType === 'UG',
        placeholders: ['registerInfo'],
        legalBasis: ['§ 35a GmbHG'],
      })
    }

    if (profile.vatId) {
      sections.push({
        heading: 'Umsatzsteuer-ID',
        required: false,
        condition: (p) => !!p.vatId,
        placeholders: ['vatId'],
        legalBasis: ['§ 27a UStG'],
      })
    }

    if (profile.responsiblePerson) {
      sections.push({
        heading: 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
        required: false,
        condition: (p) => !!p.responsiblePerson,
        placeholders: ['responsiblePerson'],
        legalBasis: ['§ 55 Abs. 2 RStV'],
      })
    }

    return {
      type: 'impressum',
      title: 'Impressum',
      sections,
      missingInputs: missing,
      warnings: warnings,
    }
  }

  private static generateDatenschutzPlan(profile: SiteProfile): DocumentPlan {
    const missing: string[] = []
    const warnings: string[] = []

    if (!profile.companyName) missing.push('companyName')
    if (!profile.contactEmail) missing.push('contactEmail')
    if (!profile.addressStreet) missing.push('addressStreet')

    const sections: DocumentSection[] = [
      {
        heading: '1. Datenschutz auf einen Blick',
        required: true,
        placeholders: [],
      },
      {
        heading: '2. Verantwortliche Stelle',
        required: true,
        placeholders: ['companyName', 'addressStreet', 'addressCity', 'addressZip', 'contactEmail', 'contactPhone'],
        legalBasis: ['Art. 4 Nr. 7 DSGVO'],
      },
      {
        heading: '3. Datenerfassung auf dieser Website',
        required: true,
        placeholders: [],
      },
    ]

    // Hosting
    if (profile.hostingProvider) {
      sections.push({
        heading: '3.1 Hosting',
        required: false,
        condition: (p) => !!p.hostingProvider,
        placeholders: ['hostingProvider'],
        legalBasis: ['Art. 28 DSGVO'],
      })
    }

    // Analytics
    const analytics = profile.analytics as { provider?: string; enabled?: boolean } | null
    if (analytics?.enabled && analytics.provider) {
      sections.push({
        heading: `3.2 ${analytics.provider === 'GA4' ? 'Google Analytics' : 'Matomo'}`,
        required: false,
        condition: (p) => {
          const a = p.analytics as { provider?: string; enabled?: boolean } | null
          return a?.enabled === true && !!a.provider
        },
        placeholders: ['analytics.provider'],
        legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO', 'Art. 49 Abs. 1 lit. a DSGVO'],
      })
    }

    // Tag Manager
    if (profile.tagManager) {
      sections.push({
        heading: '3.3 Tag-Management-System',
        required: false,
        condition: (p) => !!p.tagManager,
        placeholders: ['tagManager'],
        legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO'],
      })
    }

    // Marketing Pixels
    const marketingPixels = profile.marketingPixels as Record<string, boolean> | null
    if (marketingPixels) {
      const enabledPixels = Object.entries(marketingPixels).filter(([_, enabled]) => enabled)
      if (enabledPixels.length > 0) {
        sections.push({
          heading: '3.4 Marketing-Tools',
          required: false,
          condition: (p) => {
            const mp = p.marketingPixels as Record<string, boolean> | null
            return mp && Object.values(mp).some(v => v === true)
          },
          placeholders: enabledPixels.map(([name]) => `marketingPixels.${name}`),
          legalBasis: ['Art. 6 Abs. 1 lit. a DSGVO'],
        })
      }
    }

    // Embedded Content
    const embeddedContent = profile.embeddedContent as Record<string, boolean> | null
    if (embeddedContent) {
      const enabledEmbeds = Object.entries(embeddedContent).filter(([_, enabled]) => enabled)
      if (enabledEmbeds.length > 0) {
        sections.push({
          heading: '3.5 Eingebettete Inhalte',
          required: false,
          condition: (p) => {
            const ec = p.embeddedContent as Record<string, boolean> | null
            return ec && Object.values(ec).some(v => v === true)
          },
          placeholders: enabledEmbeds.map(([name]) => `embeddedContent.${name}`),
          legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO'],
        })
      }
    }

    // Newsletter
    if (profile.newsletterTool) {
      sections.push({
        heading: '3.6 Newsletter',
        required: false,
        condition: (p) => !!p.newsletterTool,
        placeholders: ['newsletterTool'],
        legalBasis: ['Art. 6 Abs. 1 lit. a DSGVO'],
      })
    }

    // Contact Form
    if (profile.contactForm) {
      sections.push({
        heading: '3.7 Kontaktformular',
        required: false,
        condition: (p) => p.contactForm === true,
        placeholders: [],
        legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO'],
      })
    }

    // User Accounts
    if (profile.userAccounts) {
      sections.push({
        heading: '3.8 Nutzerkonten',
        required: false,
        condition: (p) => p.userAccounts === true,
        placeholders: [],
        legalBasis: ['Art. 6 Abs. 1 lit. b DSGVO'],
      })
    }

    // Comments
    if (profile.comments) {
      sections.push({
        heading: '3.9 Kommentare',
        required: false,
        condition: (p) => p.comments === true,
        placeholders: [],
        legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO'],
      })
    }

    // reCAPTCHA
    if (profile.recaptcha) {
      sections.push({
        heading: '3.10 reCAPTCHA',
        required: false,
        condition: (p) => p.recaptcha === true,
        placeholders: [],
        legalBasis: ['Art. 6 Abs. 1 lit. f DSGVO'],
      })
    }

    sections.push({
      heading: '4. Ihre Rechte',
      required: true,
      placeholders: [],
      legalBasis: ['Art. 15-22 DSGVO'],
    })

    sections.push({
      heading: '5. Widerspruchsrecht',
      required: true,
      placeholders: [],
      legalBasis: ['Art. 21 DSGVO'],
    })

    return {
      type: 'datenschutz',
      title: 'Datenschutzerklärung',
      sections,
      missingInputs: missing,
      warnings: warnings,
    }
  }

  private static generateCookiePolicyPlan(profile: SiteProfile): DocumentPlan {
    const missing: string[] = []
    const warnings: string[] = []

    if (!profile.setsCookies) {
      warnings.push('Keine Cookies aktiviert - Cookie-Richtlinie möglicherweise nicht erforderlich')
    }

    const sections: DocumentSection[] = [
      {
        heading: 'Was sind Cookies?',
        required: true,
        placeholders: [],
      },
      {
        heading: 'Welche Cookies setzen wir?',
        required: true,
        placeholders: [],
      },
    ]

    const cookieCategories = profile.cookieCategories as Record<string, boolean> | null
    if (cookieCategories) {
      if (cookieCategories.essential) {
        sections.push({
          heading: 'Notwendige Cookies',
          required: false,
          condition: (p) => {
            const cc = p.cookieCategories as Record<string, boolean> | null
            return cc?.essential === true
          },
          placeholders: [],
        })
      }

      if (cookieCategories.statistics) {
        sections.push({
          heading: 'Statistik-Cookies',
          required: false,
          condition: (p) => {
            const cc = p.cookieCategories as Record<string, boolean> | null
            return cc?.statistics === true
          },
          placeholders: ['analytics.provider'],
          legalBasis: ['Art. 6 Abs. 1 lit. a DSGVO'],
        })
      }

      if (cookieCategories.marketing) {
        sections.push({
          heading: 'Marketing-Cookies',
          required: false,
          condition: (p) => {
            const cc = p.cookieCategories as Record<string, boolean> | null
            return cc?.marketing === true
          },
          placeholders: ['marketingPixels'],
          legalBasis: ['Art. 6 Abs. 1 lit. a DSGVO'],
        })
      }
    }

    sections.push({
      heading: 'Wie können Sie Cookies verwalten?',
      required: true,
      placeholders: [],
    })

    return {
      type: 'cookie_policy',
      title: 'Cookie-Richtlinie',
      sections,
      missingInputs: missing,
      warnings: warnings,
    }
  }

  private static generateCookieConsentPlan(profile: SiteProfile): DocumentPlan {
    const missing: string[] = []
    const warnings: string[] = []

    if (!profile.setsCookies) {
      warnings.push('Keine Cookies aktiviert - Einwilligungstext möglicherweise nicht erforderlich')
    }

    const sections: DocumentSection[] = [
      {
        heading: 'Einwilligungstext',
        required: true,
        placeholders: ['companyName'],
      },
    ]

    const cookieCategories = profile.cookieCategories as Record<string, boolean> | null
    if (cookieCategories) {
      if (cookieCategories.statistics || cookieCategories.marketing) {
        sections.push({
          heading: 'Optionale Cookies',
          required: false,
          condition: (p) => {
            const cc = p.cookieCategories as Record<string, boolean> | null
            return cc?.statistics === true || cc?.marketing === true
          },
          placeholders: [],
        })
      }
    }

    return {
      type: 'cookie_consent',
      title: 'Cookie-Einwilligungstext',
      sections,
      missingInputs: missing,
      warnings: warnings,
    }
  }
}
