import { z } from 'zod'

/**
 * Validation schemas for site profile data
 * Can be used on both client and server side
 */

export const siteProfileSchema = z.object({
  name: z.string().min(1, 'Name ist erforderlich'),
  domain: z.string().url('Ungültige URL').optional().or(z.literal('')),
  companyType: z.string().optional(),
  companyName: z.string().min(1, 'Firmenname ist erforderlich').optional(),
  addressStreet: z.string().optional(),
  addressCity: z.string().optional(),
  addressZip: z.string().optional(),
  addressCountry: z.enum(['DE', 'AT', 'CH']).optional(),
  contactEmail: z.string().email('Ungültige E-Mail').optional(),
  contactPhone: z.string().optional(),
  registerInfo: z.string().optional(),
  vatId: z.string().optional(),
  responsiblePerson: z.string().optional(),
  hostingProvider: z.string().optional(),
  cms: z.string().optional(),
  cdn: z.string().optional(),
  analytics: z.record(z.any()).optional(),
  tagManager: z.string().optional(),
  marketingPixels: z.record(z.boolean()).optional(),
  embeddedContent: z.record(z.boolean()).optional(),
  newsletterTool: z.string().optional(),
  contactForm: z.boolean().optional(),
  bookingSystem: z.string().optional(),
  userAccounts: z.boolean().optional(),
  comments: z.boolean().optional(),
  recaptcha: z.boolean().optional(),
  setsCookies: z.boolean().optional(),
  cookieCategories: z.record(z.boolean()).optional(),
  consentMode: z.enum(['opt-in', 'opt-out']).optional(),
  cmpProvider: z.string().optional(),
  tone: z.enum(['formal', 'neutral']).optional(),
  region: z.enum(['DE', 'AT', 'CH']).optional(),
  language: z.enum(['de', 'en']).optional(),
})

export type SiteProfileInput = z.infer<typeof siteProfileSchema>
