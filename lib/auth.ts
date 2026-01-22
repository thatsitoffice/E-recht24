import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.SMTP_HOST
        ? {
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            },
          }
        : undefined,
      from: process.env.SMTP_FROM || 'noreply@example.com',
      // For development: log emails to console if no SMTP configured
      ...(process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST
        ? {
            sendVerificationRequest: async ({ identifier, url }) => {
              console.log('\n🔐 ==========================================')
              console.log('📧 Login Link für:', identifier)
              console.log('🔗 URL:', url)
              console.log('⚠️  SMTP nicht konfiguriert - E-Mail nicht gesendet')
              console.log('==========================================\n')
            },
          }
        : {}),
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
