# Cloudflare Deployment Guide

## Übersicht

Diese Anleitung zeigt, wie Sie die Rechtstexte Generator App auf Cloudflare deployen.

## Cloudflare Hosting Optionen

### Option 1: Cloudflare Pages (Empfohlen für Next.js)

Cloudflare Pages unterstützt Next.js mit Full Stack Features.

### Option 2: Cloudflare Workers (für API Routes)

Kann für spezifische API-Endpunkte verwendet werden.

## Vorbereitung

### 1. Environment Variables für Cloudflare

Die folgenden Variablen müssen in Cloudflare gesetzt werden:

#### Erforderliche Variablen:
```env
DATABASE_URL="postgresql://postgres:password@db.apzqhzzphubyoqnrwghw.supabase.co:5432/postgres"
NEXTAUTH_URL="https://ihre-domain.pages.dev"
NEXTAUTH_SECRET="HYkOCKWeIhOYaFITf/QJJ4/iIxyFyO9KWxvUcn7zPLo="
NODE_ENV="production"
```

#### Optionale Variablen:
```env
OPENAI_API_KEY="sk-your-key"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user"
SMTP_PASSWORD="password"
SMTP_FROM="noreply@ihre-domain.com"
```

### 2. Next.js Konfiguration für Cloudflare

Erstellen Sie `next.config.js` (bereits vorhanden, aber prüfen):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Wichtig für Cloudflare Pages
  output: 'standalone', // Optional, für bessere Performance
}

module.exports = nextConfig
```

### 3. Prisma für Cloudflare

Prisma benötigt spezielle Konfiguration für Cloudflare:

**wrangler.toml** (für Cloudflare Workers/Pages):
```toml
name = "erecht-generator"
compatibility_date = "2024-01-01"

[env.production]
vars = { NODE_ENV = "production" }
```

## Deployment-Schritte

### Schritt 1: GitHub Repository

1. Erstellen Sie ein GitHub Repository
2. Pushen Sie Ihren Code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/ihr-username/erecht-generator.git
   git push -u origin main
   ```

### Schritt 2: Cloudflare Pages Setup

1. Gehen Sie zu: https://dash.cloudflare.com
2. Wählen Sie "Pages" aus dem Menü
3. Klicken Sie auf "Create a project"
4. Wählen Sie "Connect to Git"
5. Wählen Sie Ihr GitHub Repository
6. Konfigurieren Sie:
   - **Framework preset:** Next.js
   - **Build command:** `npm run build`
   - **Build output directory:** `.next`

### Schritt 3: Environment Variables setzen

1. In Cloudflare Pages Dashboard
2. Gehen Sie zu: Settings → Environment Variables
3. Fügen Sie alle Variablen aus `.env` hinzu:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (Ihre Cloudflare Pages URL)
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
   - `SMTP_*` Variablen (falls benötigt)

### Schritt 4: Build Settings

**Build Command:**
```bash
npm run build
```

**Node Version:**
- Wählen Sie Node.js 18 oder höher

**Root Directory:**
- Lassen Sie leer (wenn Projekt im Root ist)

## Wichtige Konfigurationen

### NEXTAUTH_URL

Für Cloudflare Pages:
```env
NEXTAUTH_URL="https://ihre-app.pages.dev"
```

Für Custom Domain:
```env
NEXTAUTH_URL="https://ihre-domain.com"
```

### Datenbank-Verbindung

Supabase funktioniert gut mit Cloudflare. Stellen Sie sicher:
- ✅ SSL-Verbindung aktiviert
- ✅ Connection Pooling aktiviert (empfohlen)
- ✅ Firewall-Regeln für Cloudflare IPs

### Prisma auf Cloudflare

Cloudflare Pages unterstützt Prisma, aber:

1. **Prisma Client muss gebaut werden:**
   ```bash
   npx prisma generate
   ```

2. **Build Command anpassen:**
   ```bash
   npx prisma generate && npm run build
   ```

3. **Oder in package.json:**
   ```json
   {
     "scripts": {
       "build": "prisma generate && next build"
     }
   }
   ```

## Custom Domain Setup

1. In Cloudflare Pages → Custom domains
2. Fügen Sie Ihre Domain hinzu
3. Folgen Sie den DNS-Anweisungen
4. Aktualisieren Sie `NEXTAUTH_URL` auf Ihre Custom Domain

## Performance-Optimierungen

### 1. Edge Functions (Optional)

Für bessere Performance können Sie API Routes als Edge Functions deployen:

```javascript
// app/api/example/route.ts
export const runtime = 'edge'
```

### 2. Caching

Cloudflare bietet automatisches Caching. Für API Routes:

```javascript
export async function GET(request: NextRequest) {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
```

## Troubleshooting

### Problem: Prisma Client nicht gefunden

**Lösung:**
- Stellen Sie sicher, dass `prisma generate` im Build Command enthalten ist
- Prüfen Sie, ob `@prisma/client` in `package.json` dependencies ist

### Problem: Environment Variables nicht verfügbar

**Lösung:**
- Prüfen Sie, ob Variablen in Cloudflare Dashboard gesetzt sind
- Stellen Sie sicher, dass sie für "Production" Environment gesetzt sind
- Re-deploy nach dem Setzen von Variablen

### Problem: Datenbank-Verbindung fehlgeschlagen

**Lösung:**
- Prüfen Sie Supabase Firewall-Einstellungen
- Aktivieren Sie "Allow connections from anywhere" temporär zum Testen
- Prüfen Sie SSL-Verbindung in DATABASE_URL

### Problem: NextAuth funktioniert nicht

**Lösung:**
- Stellen Sie sicher, dass `NEXTAUTH_URL` korrekt ist (mit https://)
- Prüfen Sie, ob `NEXTAUTH_SECRET` gesetzt ist
- Prüfen Sie Browser Console für Fehler

## Kosten

### Cloudflare Pages
- ✅ Kostenlos für:
  - 500 Builds/Monat
  - Unbegrenzte Requests
  - 100 GB Bandbreite

### Supabase
- ✅ Kostenlos für:
  - 500 MB Datenbank
  - 2 GB Bandbreite

## Monitoring

### Cloudflare Analytics
- Gehen Sie zu: Pages → Ihr Projekt → Analytics
- Sehen Sie Requests, Builds, Errors

### Error Tracking
- Implementieren Sie Sentry oder ähnliches
- Cloudflare bietet auch Error Logs

## Sicherheit

### 1. Environment Variables
- ✅ Niemals in Git committen
- ✅ Nur in Cloudflare Dashboard setzen
- ✅ Regelmäßig rotieren (besonders Secrets)

### 2. Rate Limiting
- Cloudflare bietet automatisches Rate Limiting
- Für API Routes können Sie zusätzliche Limits setzen

### 3. DDoS Protection
- Automatisch durch Cloudflare aktiviert

## Nächste Schritte nach Deployment

1. ✅ Custom Domain einrichten
2. ✅ SSL-Zertifikat prüfen (automatisch durch Cloudflare)
3. ✅ Monitoring einrichten
4. ✅ Error Tracking konfigurieren
5. ✅ Backup-Strategie für Datenbank

## Support

- Cloudflare Docs: https://developers.cloudflare.com/pages
- Next.js on Cloudflare: https://developers.cloudflare.com/pages/framework-guides/nextjs
