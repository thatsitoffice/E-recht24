# Rechtstexte Generator

Ein SaaS-Tool zur Generierung von rechtlichen Website-Texten für DACH (Deutschland, Österreich, Schweiz). Generiert Impressum, Datenschutzerklärung und Cookie-Richtlinien basierend auf strukturierten Eingaben.

## ⚠️ Wichtiger Hinweis

**Dieses Tool stellt keine Rechtsberatung dar.** Die generierten Texte sind Entwürfe und müssen von einem qualifizierten Rechtsanwalt geprüft werden, bevor sie auf Ihrer Website verwendet werden.

## Features

- ✅ **Impressum-Generator** - Vollständiges Impressum gemäß TMG und RStV
- ✅ **Datenschutzerklärung** - DSGVO-konforme Datenschutzerklärung mit allen relevanten Abschnitten
- ✅ **Cookie-Richtlinie** - Cookie-Policy und Einwilligungstexte
- ✅ **Multi-Step Wizard** - Strukturierter Eingabeprozess
- ✅ **Intelligente Regeln** - Automatische Anpassung der Dokumente basierend auf Eingaben
- ✅ **LLM-basierte Generierung** - OpenAI GPT-4 für natürliche Texte
- ✅ **Export-Funktionen** - HTML, Text, Markdown
- ✅ **Versionierung** - Dokumente werden mit Versionshistorie gespeichert

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **AI:** OpenAI API (GPT-4)
- **Deployment:** Vercel-ready

## Voraussetzungen

- Node.js 18+ und npm/yarn
- PostgreSQL Datenbank
- OpenAI API Key

## Installation

### 1. Repository klonen und Abhängigkeiten installieren

```bash
npm install
```

### 2. Umgebungsvariablen konfigurieren

Kopieren Sie `.env.example` zu `.env` und füllen Sie die Werte aus:

```bash
cp .env.example .env
```

Bearbeiten Sie `.env`:
- `DATABASE_URL`: PostgreSQL Verbindungsstring
- `OPENAI_API_KEY`: Ihr OpenAI API Key

### 3. Datenbank einrichten

```bash
# Prisma Client generieren
npx prisma generate

# Datenbank-Schema erstellen
npx prisma db push

# (Optional) Demo-Daten laden
npm run db:seed
```

### 4. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist nun unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Projektstruktur

```
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── generate/      # Dokumentgenerierung
│   │   └── site-profiles/ # Site Profile Management
│   ├── dashboard/         # Dashboard-Seite
│   ├── generator/         # Generator-Wizard
│   └── page.tsx           # Landing Page
├── components/
│   ├── ui/                # shadcn/ui Komponenten
│   ├── wizard/            # Wizard-Step-Komponenten
│   └── document-preview.tsx
├── lib/
│   ├── rules-engine.ts    # Regeln-Engine für Dokumentstruktur
│   ├── prompt-builder.ts  # LLM Prompt Builder
│   ├── document-renderer.ts # HTML/Text Renderer
│   ├── openai-client.ts   # OpenAI API Client
│   └── prisma.ts          # Prisma Client
└── prisma/
    ├── schema.prisma      # Datenbankschema
    └── seed.ts            # Seed-Daten
```

## Verwendung

### 1. Dashboard öffnen

Navigieren Sie zu `/dashboard` und wählen Sie den Dokumenttyp aus.

### 2. Wizard durchlaufen

Der Generator führt Sie durch 4 Schritte:

- **Schritt A: Website-Grundlagen** - Firmendaten, Adresse, Kontakt
- **Schritt B: Datenschutz** - Analytics, Marketing-Tools, eingebettete Inhalte
- **Schritt C: Cookies & Einwilligung** - Cookie-Kategorien, Consent-Modus
- **Schritt D: Ausgabe-Optionen** - Sprachstil, Region, Sprache

### 3. Dokument generieren

Nach Abschluss des Wizards wird das Dokument mit OpenAI generiert und angezeigt.

### 4. Exportieren

- HTML kopieren oder herunterladen
- Text kopieren oder herunterladen
- Rohdaten (JSON) anzeigen

## API Endpunkte

### `POST /api/generate`

Generiert ein Dokument basierend auf einem Site Profile.

**Request:**
```json
{
  "siteProfileId": "profile-id",
  "documentType": "impressum" | "datenschutz" | "cookie_policy" | "cookie_consent"
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc-id",
    "type": "impressum",
    "title": "Impressum",
    "htmlContent": "...",
    "textContent": "...",
    "version": 1
  }
}
```

### `POST /api/site-profiles`

Erstellt ein neues Site Profile.

### `GET /api/site-profiles`

Listet alle Site Profiles des aktuellen Benutzers.

### `GET /api/site-profiles/[id]`

Ruft ein Site Profile ab.

### `PUT /api/site-profiles/[id]`

Aktualisiert ein Site Profile.

## Datenmodell

### SiteProfile

Enthält alle Informationen über eine Website:
- Firmendaten (Name, Adresse, Rechtsform)
- Datenschutz-Einstellungen (Analytics, Marketing-Tools)
- Cookie-Einstellungen
- Ausgabe-Präferenzen

### Document

Gespeicherte generierte Dokumente mit:
- Typ (impressum, datenschutz, cookie_policy)
- Inhalt (JSON, HTML, Text)
- Version
- Zeitstempel

### GenerationLog

Protokoll aller Generierungen für Audit-Zwecke.

## Sicherheit & Compliance

### Implementierte Maßnahmen

- ✅ Input-Validierung auf Client- und Server-Seite
- ✅ Rate Limiting auf Generierungs-Endpunkten (empfohlen)
- ✅ Audit-Logging aller Generierungen
- ✅ Sichere Speicherung von Benutzerdaten
- ✅ Keine Speicherung von API-Keys im Code

### Empfohlene Ergänzungen für Produktion

1. **Authentifizierung:** Implementieren Sie NextAuth oder Clerk für Benutzer-Auth
2. **Rate Limiting:** Fügen Sie Rate Limiting hinzu (z.B. mit Upstash Redis)
3. **Input Sanitization:** Erweitern Sie die Validierung
4. **Error Handling:** Verbessern Sie Fehlerbehandlung und Logging
5. **Monitoring:** Setzen Sie Monitoring (z.B. Sentry) auf
6. **Backups:** Regelmäßige Datenbank-Backups

### Rechtliche Hinweise

- Die generierten Texte sind **Entwürfe** und müssen von einem Rechtsanwalt geprüft werden
- Das Tool stellt **keine Rechtsberatung** dar
- Regionale Unterschiede (DE/AT/CH) werden berücksichtigt, aber nicht vollständig abgedeckt
- Gesetze ändern sich - regelmäßige Updates erforderlich

## Entwicklung

### Datenbank-Schema aktualisieren

```bash
# Schema bearbeiten
# prisma/schema.prisma

# Änderungen anwenden
npx prisma db push

# Client neu generieren
npx prisma generate
```

### Prisma Studio öffnen

```bash
npm run db:studio
```

### Build für Produktion

```bash
npm run build
npm start
```

## Deployment auf Vercel

1. Repository zu GitHub/GitLab pushen
2. In Vercel importieren
3. Umgebungsvariablen setzen:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `NEXTAUTH_SECRET` (wenn Auth aktiviert)
4. Deploy

### Datenbank auf Vercel

Verwenden Sie Vercel Postgres oder einen externen Provider (z.B. Supabase, Neon).

## Erweiterungen

### Mögliche Features

- [ ] Benutzer-Authentifizierung (NextAuth/Clerk)
- [ ] Dokument-Versionierung mit Diff-View
- [ ] Team-Kollaboration
- [ ] Mehrsprachigkeit (EN, FR)
- [ ] Weitere Dokumenttypen (AGB, Widerrufsbelehrung)
- [ ] Template-Bibliothek
- [ ] API für externe Integration
- [ ] Stripe-Integration für Abonnements

## Lizenz

Dieses Projekt ist für interne/kommerzielle Nutzung bestimmt. Bitte beachten Sie die Lizenzbestimmungen der verwendeten Dependencies.

## Support

Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository.

## Changelog

### v0.1.0 (Initial Release)
- Impressum-Generator
- Datenschutzerklärung-Generator
- Cookie-Richtlinie-Generator
- Multi-Step Wizard
- Export-Funktionen (HTML, Text)
- Dokument-Versionierung
