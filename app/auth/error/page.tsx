import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const errorMessages: Record<string, string> = {
    Configuration: 'Es gibt ein Problem mit der Server-Konfiguration.',
    AccessDenied: 'Sie haben keinen Zugriff auf diese Seite.',
    Verification: 'Der Verifizierungs-Link ist abgelaufen oder wurde bereits verwendet.',
    Default: 'Ein Fehler ist aufgetreten.',
  }

  const error = searchParams?.error || 'Default'
  const message = errorMessages[error] || errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Fehler</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Link href="/auth/signin" className="flex-1">
              <Button className="w-full">Erneut versuchen</Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Zur Startseite
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
