# Architektur-Dokumentation

## System-Übersicht

Das System besteht aus mehreren Hauptkomponenten:

1. **Frontend (Next.js App Router)**
   - Landing Page
   - Dashboard
   - Generator Wizard (Multi-Step Form)
   - Document Preview & Export

2. **Backend (Next.js API Routes)**
   - Site Profile Management
   - Document Generation API
   - Document Library API

3. **Core Engine**
   - Rules Engine (bestimmt Dokumentstruktur)
   - Prompt Builder (erstellt LLM-Prompts)
   - Document Renderer (HTML/Text Export)

4. **Datenbank (PostgreSQL + Prisma)**
   - User Management
   - Site Profiles
   - Generated Documents
   - Generation Logs

## Datenfluss

### Dokumentgenerierung

```
User Input (Wizard)
  ↓
Site Profile (gespeichert)
  ↓
Rules Engine (bestimmt Abschnitte)
  ↓
Prompt Builder (erstellt LLM-Prompt)
  ↓
OpenAI API (generiert Text)
  ↓
Document Renderer (HTML/Text)
  ↓
Database (gespeichert)
  ↓
User (Preview & Export)
```

## Komponenten-Details

### Rules Engine (`lib/rules-engine.ts`)

Die Rules Engine analysiert ein Site Profile und bestimmt, welche Abschnitte in einem Dokument enthalten sein müssen.

**Eingabe:**
- Document Type (impressum, datenschutz, cookie_policy)
- Site Profile (alle Website-Informationen)

**Ausgabe:**
- Document Plan (Liste von Abschnitten mit Bedingungen)

**Beispiel:**
- Wenn `analytics.enabled === true`, dann Abschnitt "Google Analytics" hinzufügen
- Wenn `companyType === 'GmbH'`, dann Abschnitt "Handelsregister" hinzufügen

### Prompt Builder (`lib/prompt-builder.ts`)

Erstellt strukturierte Prompts für die LLM-Generierung.

**Funktionen:**
- Extrahiert relevante Daten aus Site Profile
- Erstellt strukturierte Anweisungen
- Definiert JSON-Schema für Antwort

### Document Renderer (`lib/document-renderer.ts`)

Wandelt generierte JSON-Dokumente in verschiedene Formate um.

**Formate:**
- Plain Text
- HTML Snippet
- HTML Page (komplett)

### OpenAI Client (`lib/openai-client.ts`)

Wrapper für OpenAI API mit:
- Strukturierter JSON-Antwort
- Fehlerbehandlung
- Token-Schätzung

## Datenmodell

### SiteProfile

Zentrale Entität, die alle Website-Informationen enthält:

```typescript
{
  // Website Basics
  domain, companyType, companyName,
  addressStreet, addressCity, addressZip,
  contactEmail, contactPhone,
  registerInfo, vatId, responsiblePerson,
  
  // Privacy
  hostingProvider, cms, analytics, tagManager,
  marketingPixels, embeddedContent,
  newsletterTool, contactForm, userAccounts,
  
  // Cookies
  setsCookies, cookieCategories, consentMode,
  
  // Output
  tone, region, language
}
```

### Document

Gespeichertes generiertes Dokument:

```typescript
{
  type: 'impressum' | 'datenschutz' | 'cookie_policy',
  title: string,
  content: GeneratedDocument (JSON),
  htmlContent: string,
  textContent: string,
  version: number
}
```

## API-Endpunkte

### `POST /api/generate`

Generiert ein Dokument.

**Request:**
```json
{
  "siteProfileId": "profile-id",
  "documentType": "impressum"
}
```

**Response:**
```json
{
  "success": true,
  "document": {
    "id": "doc-id",
    "htmlContent": "...",
    "textContent": "..."
  }
}
```

### `POST /api/site-profiles`

Erstellt ein neues Site Profile.

### `GET /api/site-profiles`

Listet alle Site Profiles.

### `GET /api/site-profiles/[id]`

Ruft ein Site Profile ab.

### `PUT /api/site-profiles/[id]`

Aktualisiert ein Site Profile.

## Sicherheits-Architektur

### Aktuelle Implementierung

- Input-Validierung (Client & Server)
- SQL-Injection-Schutz (Prisma)
- XSS-Schutz (React Escaping)
- Security Headers (Middleware)

### Für Produktion erforderlich

- Authentifizierung (NextAuth/Clerk)
- Rate Limiting (Upstash Redis)
- Input Sanitization (Zod)
- Audit Logging (erweitert)
- Error Monitoring (Sentry)

## Erweiterungsmöglichkeiten

### Kurzfristig

1. **Authentifizierung**
   - NextAuth.js mit Email Magic Link
   - Session Management
   - User-spezifische Dokumente

2. **Rate Limiting**
   - Upstash Redis Integration
   - Pro-User-Limits
   - API-Key-System

3. **Dokument-Versionierung**
   - Diff-View zwischen Versionen
   - Rollback-Funktion
   - Kommentare zu Versionen

### Mittelfristig

1. **Team-Features**
   - Organisationen
   - Team-Mitglieder
   - Kollaboration

2. **Erweiterte Dokumenttypen**
   - AGB
   - Widerrufsbelehrung
   - Newsletter-Disclosures

3. **Template-System**
   - Vorgefertigte Templates
   - Custom Templates
   - Template-Marktplatz

### Langfristig

1. **API für externe Integration**
   - REST API
   - Webhooks
   - SDKs

2. **Multi-Language**
   - Englisch, Französisch
   - Automatische Übersetzung
   - Lokalisierung

3. **Analytics & Insights**
   - Nutzungsstatistiken
   - Dokument-Qualität
   - Compliance-Checks

## Performance-Optimierungen

### Aktuell

- Server Components wo möglich
- Prisma Connection Pooling
- Statische Assets (Next.js)

### Empfohlen

- Redis Caching für häufige Anfragen
- CDN für statische Assets
- Database Indexing (bereits in Schema)
- API Response Caching

## Deployment-Architektur

### Vercel (Empfohlen)

```
Vercel Edge Network
  ↓
Next.js App (Serverless Functions)
  ↓
PostgreSQL (Vercel Postgres / External)
  ↓
OpenAI API (External)
```

### Alternative: Self-Hosted

```
Docker Container
  ↓
Next.js App
  ↓
PostgreSQL (Container)
  ↓
OpenAI API (External)
```

## Monitoring & Logging

### Aktuell

- Console Logging
- Generation Logs in DB
- Error Logging

### Empfohlen

- Structured Logging (Winston/Pino)
- Error Tracking (Sentry)
- Performance Monitoring (Vercel Analytics)
- Uptime Monitoring (UptimeRobot)
