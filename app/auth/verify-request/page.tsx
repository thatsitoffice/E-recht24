import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">E-Mail gesendet</CardTitle>
          <CardDescription>
            Bitte prüfen Sie Ihr E-Mail-Postfach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Wir haben Ihnen einen Anmelde-Link per E-Mail gesendet.
            Klicken Sie auf den Link in der E-Mail, um sich anzumelden.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Tipp:</strong> Prüfen Sie auch Ihren Spam-Ordner, falls die E-Mail
              nicht im Posteingang angekommen ist.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Zur Startseite
              </Button>
            </Link>
            <Link href="/auth/signin" className="flex-1">
              <Button variant="outline" className="w-full">
                Erneut senden
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
