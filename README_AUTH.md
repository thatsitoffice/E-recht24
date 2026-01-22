# Authentifizierung - Schnellstart

## ✅ Was wurde implementiert

- ✅ NextAuth.js mit Email Magic Link
- ✅ Prisma Adapter für Session Management
- ✅ Geschützte API Routes
- ✅ Geschützte Seiten (Dashboard, Generator)
- ✅ Login/Logout UI
- ✅ Session Management

## 🚀 Schnellstart

### 1. Dependencies installieren

```bash
npm install @next-auth/prisma-adapter
```

### 2. Datenbank-Schema aktualisieren

Das Prisma Schema wurde bereits aktualisiert mit:
- `Account` Model
- `Session` Model  
- `VerificationToken` Model

```bash
npx prisma generate
npx prisma db push
```

### 3. .env Datei konfigurieren

Die `.env` Datei wurde bereits erstellt. Fügen Sie hinzu:

```env
# SMTP (für E-Mail-Versand)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="ihre-email@gmail.com"
SMTP_PASSWORD="ihr-app-passwort"
SMTP_FROM="ihre-email@gmail.com"
```

**Für Entwicklung ohne SMTP:** Lassen Sie die SMTP-Variablen leer. E-Mails werden in der Console geloggt.

### 4. Testen

```bash
npm run dev
```

1. Gehen Sie zu `/auth/signin`
2. Geben Sie Ihre E-Mail ein
3. Prüfen Sie die Console für den Login-Link (wenn SMTP nicht konfiguriert)
4. Oder prüfen Sie Ihr E-Mail-Postfach (wenn SMTP konfiguriert)

## 📁 Neue Dateien

- `lib/auth.ts` - NextAuth Konfiguration
- `app/api/auth/[...nextauth]/route.ts` - Auth API Route
- `components/providers.tsx` - Session Provider
- `components/auth-button.tsx` - Login/Logout Button
- `app/auth/signin/page.tsx` - Login-Seite
- `app/auth/signup/page.tsx` - Registrierungs-Seite
- `app/auth/verify-request/page.tsx` - E-Mail-Verifizierung
- `app/auth/error/page.tsx` - Fehler-Seite

## 🔒 Geschützte Routen

### Seiten
- `/dashboard` - Erfordert Anmeldung
- `/generator` - Erfordert Anmeldung

### API Routes
- `/api/generate` - Erfordert Anmeldung
- `/api/site-profiles` - Erfordert Anmeldung
- `/api/documents` - Erfordert Anmeldung

## 📝 Weitere Informationen

Siehe `AUTH_SETUP.md` für:
- Detaillierte SMTP-Konfiguration
- Verschiedene E-Mail-Provider
- Fehlerbehebung
- Produktions-Setup
