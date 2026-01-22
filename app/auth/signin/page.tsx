'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      })

      if (result?.error) {
        setMessage('Fehler beim Anmelden. Bitte versuchen Sie es erneut.')
      } else {
        setMessage('Bitte prüfen Sie Ihr E-Mail-Postfach für den Anmelde-Link.')
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>
            Geben Sie Ihre E-Mail-Adresse ein, um einen Anmelde-Link zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                placeholder="ihre@email.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  message.includes('Fehler')
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-blue-50 text-blue-800'
                }`}
              >
                {message}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Wird gesendet...' : 'Anmelde-Link senden'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Kein Account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Registrieren
              </Link>
            </p>
            <p className="mt-2">
              <Link href="/" className="text-primary hover:underline">
                Zur Startseite
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              <strong>Hinweis:</strong> Für die E-Mail-Anmeldung muss ein SMTP-Server
              konfiguriert sein. In der Entwicklung können Sie auch einen Demo-Modus verwenden.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
