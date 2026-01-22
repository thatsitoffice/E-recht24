'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/Card';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        setMessage('Fehler beim Registrieren. Bitte versuchen Sie es erneut.');
      } else {
        setMessage('Bitte prüfen Sie Ihr E-Mail-Postfach für den Anmelde-Link.');
      }
    } catch (error) {
      setMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Registrieren</CardTitle>
          <CardDescription>
            Erstellen Sie ein Konto, um loszulegen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>

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
              {isLoading ? 'Wird gesendet...' : 'Registrieren'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Bereits ein Account?{' '}
              <a href="/auth/signin" className="text-primary hover:underline">
                Anmelden
              </a>
            </p>
            <p className="mt-2">
              <a href="/" className="text-primary hover:underline">
                Zur Startseite
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
