'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, Cookie } from 'lucide-react'
import { AuthButton } from '@/components/auth-button'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Lädt...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost">Zur Startseite</Button>
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dokumente generieren</h2>
          <p className="text-muted-foreground">
            Wählen Sie ein Dokument aus, das Sie für Ihre Website erstellen möchten.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Impressum</CardTitle>
              </div>
              <CardDescription>
                Rechtliche Angaben gemäß TMG und RStV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/generator?type=impressum">
                <Button className="w-full">Erstellen</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Datenschutzerklärung</CardTitle>
              </div>
              <CardDescription>
                DSGVO-konforme Datenschutzerklärung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/generator?type=datenschutz">
                <Button className="w-full">Erstellen</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="h-6 w-6 text-primary" />
                <CardTitle>Cookie-Richtlinie</CardTitle>
              </div>
              <CardDescription>
                Cookie-Policy und Einwilligungstexte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/generator?type=cookie_policy">
                <Button className="w-full">Erstellen</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">Hinweis</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-800">
            <p>
              Die generierten Texte sind Entwürfe und stellen keine Rechtsberatung dar.
              Bitte lassen Sie alle Texte von einem qualifizierten Rechtsanwalt prüfen.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
