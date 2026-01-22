# Schnellstart-Anleitung

## Schritt-für-Schritt Setup

### 1. Voraussetzungen prüfen

Stellen Sie sicher, dass Sie haben:
- Node.js 18+ installiert (`node --version`)
- PostgreSQL installiert und laufend
- OpenAI API Key (von https://platform.openai.com/)

### 2. Projekt klonen/setup

```bash
# Falls noch nicht geschehen
cd "E-recht 24"

# Dependencies installieren
npm install
```

### 3. Datenbank einrichten

#### Option A: Lokale PostgreSQL

```bash
# Datenbank erstellen
createdb erecht_generator

# Oder mit psql:
psql -U postgres
CREATE DATABASE erecht_generator;
\q
```

#### Option B: Cloud-Datenbank (Supabase, Neon, etc.)

Erstellen Sie eine PostgreSQL-Datenbank und kopieren Sie die Verbindungs-URL.

### 4. Umgebungsvariablen

Erstellen Sie eine `.env` Datei im Projektroot:

```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/erecht_generator?schema=public"
OPENAI_API_KEY="sk-your-key-here"
NODE_ENV="development"
```

**Wichtig:** Ersetzen Sie:
- `user` und `password` mit Ihren PostgreSQL-Credentials
- `localhost:5432` mit Ihrer Datenbank-URL (falls Cloud)
- `sk-your-key-here` mit Ihrem OpenAI API Key

### 5. Datenbank-Schema erstellen

```bash
# Prisma Client generieren
npx prisma generate

# Schema zur Datenbank pushen
npx prisma db push
```

### 6. (Optional) Demo-Daten laden

```bash
npm run db:seed
```

Dies erstellt einen Demo-Benutzer und ein Beispiel-Site-Profile.

### 7. Entwicklungsserver starten

```bash
npm run dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) im Browser.

### 8. Erste Dokumente generieren

1. Gehen Sie zu `/dashboard`
2. Wählen Sie einen Dokumenttyp (z.B. "Impressum")
3. Füllen Sie den Wizard aus
4. Generieren Sie das Dokument

## Troubleshooting

### "Prisma Client not found"

```bash
npx prisma generate
```

### "Database connection failed"

- Prüfen Sie die `DATABASE_URL` in `.env`
- Stellen Sie sicher, dass PostgreSQL läuft
- Prüfen Sie Firewall-Einstellungen

### "OpenAI API error"

- Prüfen Sie, ob der API Key korrekt ist
- Prüfen Sie Ihr OpenAI-Konto-Guthaben
- Prüfen Sie Rate Limits

### "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

## Nächste Schritte

- Lesen Sie die [README.md](./README.md) für Details
- Prüfen Sie [SECURITY.md](./SECURITY.md) für Sicherheitshinweise
- Implementieren Sie Authentifizierung für Produktion
- Fügen Sie Rate Limiting hinzu

## Produktions-Deployment

Siehe README.md Abschnitt "Deployment auf Vercel".
