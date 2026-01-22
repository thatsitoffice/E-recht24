import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
    },
  })

  // Create demo organization
  const org = await prisma.organization.create({
    data: {
      name: 'Demo GmbH',
      userId: user.id,
    },
  })

  // Create demo site profile
  const siteProfile = await prisma.siteProfile.create({
    data: {
      name: 'Main Website',
      userId: user.id,
      orgId: org.id,
      domain: 'example.com',
      companyType: 'GmbH',
      companyName: 'Demo GmbH',
      addressStreet: 'Musterstraße 123',
      addressCity: 'Berlin',
      addressZip: '10115',
      addressCountry: 'DE',
      contactEmail: 'info@example.com',
      contactPhone: '+49 30 12345678',
      registerInfo: 'HRB 12345 B, Amtsgericht Berlin-Charlottenburg',
      vatId: 'DE123456789',
      hostingProvider: 'Vercel',
      cms: 'Next.js',
      analytics: { provider: 'GA4', enabled: true },
      marketingPixels: { Meta: true, TikTok: false },
      embeddedContent: { YouTube: true, Maps: true },
      newsletterTool: 'Mailchimp',
      contactForm: true,
      setsCookies: true,
      cookieCategories: { essential: true, statistics: true, marketing: true },
      consentMode: 'opt-in',
      tone: 'formal',
      region: 'DE',
      language: 'de',
    },
  })

  console.log('Seed data created:', { user, org, siteProfile })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
