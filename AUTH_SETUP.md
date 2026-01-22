# Authentifizierung Setup

## Übersicht

Die Anwendung verwendet NextAuth.js mit Email Magic Link für die Authentifizierung. Benutzer erhalten einen Anmelde-Link per E-Mail.

## 1. Umgebungsvariablen

Die `.env` Datei sollte folgende Variablen enthalten:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# SMTP (für E-Mail-Versand)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@example.com"
```

### NEXTAUTH_SECRET generieren

Führen Sie folgenden Befehl aus, um einen Secret zu generieren:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Kopieren Sie den generierten Wert in `NEXTAUTH_SECRET`.

## 2. SMTP-Konfiguration

### Option A: Gmail (für Entwicklung)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="ihre-email@gmail.com"
SMTP_PASSWORD="ihr-app-passwort"  # App-Passwort, nicht normales Passwort!
SMTP_FROM="ihre-email@gmail.com"
```

**Wichtig:** Für Gmail müssen Sie ein App-Passwort erstellen:
1. Google Account → Sicherheit
2. 2-Faktor-Authentifizierung aktivieren
3. App-Passwörter → App auswählen → Passwort generieren

### Option B: SendGrid

```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="ihr-sendgrid-api-key"
SMTP_FROM="noreply@ihre-domain.com"
```

### Option C: Mailgun

```env
SMTP_HOST="smtp.mailgun.org"
SMTP_PORT="587"
SMTP_USER="postmaster@ihre-domain.mailgun.org"
SMTP_PASSWORD="ihr-mailgun-passwort"
SMTP_FROM="noreply@ihre-domain.com"
```

### Option D: Resend (empfohlen für Produktion)

Resend bietet eine einfache API für Transaktions-E-Mails:

1. Konto bei [resend.com](https://resend.com) erstellen
2. API Key generieren
3. Domain verifizieren

Dann können Sie den Email Provider in `lib/auth.ts` anpassen oder Resend direkt verwenden.

## 3. Datenbank-Schema aktualisieren

Nach dem Hinzufügen der NextAuth Models zum Prisma Schema:

```bash
# Prisma Client neu generieren
npx prisma generate

# Datenbank-Schema aktualisieren
npx prisma db push
```

Die neuen Models sind:
- `Account` - OAuth Provider Accounts
- `Session` - User Sessions
- `VerificationToken` - Email Verification Tokens

## 4. Abhängigkeiten installieren

```bash
npm install @next-auth/prisma-adapter
```

## 5. Testen der Authentifizierung

1. Starten Sie den Dev-Server: `npm run dev`
2. Navigieren Sie zu `/auth/signin`
3. Geben Sie Ihre E-Mail-Adresse ein
4. Prüfen Sie Ihr E-Mail-Postfach für den Anmelde-Link
5. Klicken Sie auf den Link, um sich anzumelden

## 6. Entwicklung ohne SMTP (Demo-Modus)

Falls Sie keinen SMTP-Server konfigurieren möchten, können Sie:

1. **Mailtrap** verwenden (kostenlos für Entwicklung):
   - Konto bei [mailtrap.io](https://mailtrap.io) erstellen
   - SMTP-Credentials kopieren
   - In `.env` eintragen

2. **E-Mail-Logs** aktivieren (nur für lokale Entwicklung):
   - In `lib/auth.ts` können Sie einen Custom Email Provider erstellen
   - E-Mails werden in der Console geloggt

## 7. Produktions-Deployment

### Vercel

1. Setzen Sie alle Umgebungsvariablen in Vercel Dashboard
2. `NEXTAUTH_URL` sollte Ihre Produktions-URL sein (z.B. `https://ihre-app.vercel.app`)
3. Verwenden Sie einen professionellen SMTP-Service (SendGrid, Resend, etc.)

### Sicherheit

- ✅ `NEXTAUTH_SECRET` sollte stark und geheim sein
- ✅ Verwenden Sie HTTPS in Produktion
- ✅ SMTP-Credentials niemals committen
- ✅ Rate Limiting für Login-Versuche implementieren (empfohlen)

## 8. Fehlerbehebung

### "Email provider not configured"

- Prüfen Sie, ob alle SMTP-Variablen in `.env` gesetzt sind
- Prüfen Sie die SMTP-Credentials

### "Invalid credentials"

- Für Gmail: Verwenden Sie ein App-Passwort, nicht das normale Passwort
- Prüfen Sie, ob 2FA aktiviert ist (für Gmail erforderlich)

### "Connection timeout"

- Prüfen Sie Firewall-Einstellungen
- Prüfen Sie, ob Port 587 nicht blockiert ist
- Versuchen Sie Port 465 mit SSL

### E-Mails kommen nicht an

- Prüfen Sie den Spam-Ordner
- Prüfen Sie die `SMTP_FROM` Adresse
- Prüfen Sie die E-Mail-Logs (falls verfügbar)

## 9. Alternative: OAuth Provider

Sie können auch OAuth Provider (Google, GitHub, etc.) hinzufügen:

```typescript
// lib/auth.ts
import GoogleProvider from 'next-auth/providers/google'

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  // ... Email Provider
]
```

## Nächste Schritte

- [ ] SMTP-Service konfigurieren
- [ ] `.env` Datei mit allen Variablen füllen
- [ ] Datenbank-Schema aktualisieren
- [ ] Authentifizierung testen
- [ ] Rate Limiting implementieren (empfohlen)
