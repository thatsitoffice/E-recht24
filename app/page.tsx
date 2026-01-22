import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthButton } from '@/components/auth-button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rechtstexte Generator</h1>
          <AuthButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Rechtliche Website-Texte einfach generieren
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Erstellen Sie Impressum, Datenschutzerklärung und Cookie-Richtlinien
            für Ihre Website – schnell, strukturiert und DSGVO-konform.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8">
              Generator starten
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Impressum</CardTitle>
              <CardDescription>
                Generieren Sie ein vollständiges Impressum gemäß TMG und RStV
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Angaben gemäß § 5 TMG</li>
                <li>• Handelsregister-Informationen</li>
                <li>• Umsatzsteuer-ID</li>
                <li>• Verantwortliche Person</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datenschutzerklärung</CardTitle>
              <CardDescription>
                DSGVO-konforme Datenschutzerklärung mit allen relevanten Abschnitten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Verantwortliche Stelle</li>
                <li>• Analytics & Tracking</li>
                <li>• Marketing-Tools</li>
                <li>• Nutzerrechte (DSGVO)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookie-Richtlinie</CardTitle>
              <CardDescription>
                Cookie-Policy und Einwilligungstexte für Ihre Website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Cookie-Kategorien</li>
                <li>• Einwilligungstexte</li>
                <li>• Verwaltungsoptionen</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900">Wichtiger Hinweis</CardTitle>
          </CardHeader>
          <CardContent className="text-yellow-800">
            <p className="mb-4">
              <strong>Keine Rechtsberatung:</strong> Dieser Generator erstellt Textentwürfe
              basierend auf Ihren Angaben. Die generierten Texte stellen keine Rechtsberatung dar
              und ersetzen nicht die Prüfung durch einen qualifizierten Rechtsanwalt.
            </p>
            <p>
              Bitte lassen Sie alle rechtlichen Texte vor der Verwendung auf Ihrer Website
              von einem Fachanwalt für IT-Recht oder Datenschutzrecht überprüfen.
            </p>
          </CardContent>
        </Card>

        <div className="mt-16 text-center text-muted-foreground">
          <p>Für Unternehmen in Deutschland, Österreich und der Schweiz</p>
        </div>
      </main>

      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rechtstexte Generator. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  )
}
