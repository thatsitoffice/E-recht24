# Sicherheitsrichtlinien

## Sicherheitshinweise

### API-Schlüssel

- **Niemals** API-Schlüssel in den Code committen
- Verwenden Sie Umgebungsvariablen für alle sensiblen Daten
- Rotieren Sie API-Schlüssel regelmäßig

### Datenbank

- Verwenden Sie starke Passwörter für Datenbank-Zugänge
- Aktivieren Sie SSL/TLS für Datenbankverbindungen
- Regelmäßige Backups durchführen
- Prisma verhindert SQL-Injection durch Parametrisierung

### Input-Validierung

- Alle Benutzereingaben werden validiert
- JSON-Felder werden mit Zod-Schema validiert (empfohlen für Produktion)
- XSS-Schutz durch React's automatisches Escaping
- HTML-Content wird beim Rendern escaped

### Rate Limiting

**Aktuell nicht implementiert - für Produktion erforderlich:**

Empfohlene Implementierung:
```typescript
// app/api/generate/route.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
})

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }
  // ... rest of handler
}
```

### Authentifizierung

**Aktuell: Demo-Modus ohne Auth**

Für Produktion implementieren:
- NextAuth.js mit Email Magic Link
- Oder Clerk für vollständige Auth-Lösung
- Session-Management
- CSRF-Schutz (automatisch mit NextAuth)

### Datenverschlüsselung

- Sensible Daten sollten verschlüsselt gespeichert werden
- HTTPS für alle Verbindungen (automatisch auf Vercel)
- Datenbankverbindungen über SSL

### Audit-Logging

- Alle Dokumentgenerierungen werden geloggt
- Fehler werden geloggt (nicht mit sensiblen Daten)
- Logs sollten in Produktion zentralisiert werden

### OpenAI API

- API-Keys niemals im Client-Code
- Server-seitige API-Calls nur
- Token-Usage wird geloggt
- Rate Limits beachten

### Content Security

- Keine Ausführung von User-generiertem Code
- HTML-Content wird escaped
- Keine eval() oder ähnliche unsichere Funktionen

## Bekannte Einschränkungen

1. **Keine Authentifizierung** - Aktuell Demo-Modus
2. **Kein Rate Limiting** - Muss für Produktion hinzugefügt werden
3. **Einfache Fehlerbehandlung** - Kann verbessert werden
4. **Keine Input-Sanitization** - Zod-Schema empfohlen

## Reporting von Sicherheitslücken

Wenn Sie eine Sicherheitslücke finden, kontaktieren Sie bitte das Entwicklungsteam direkt (nicht über öffentliche Issues).

## Best Practices für Entwickler

1. Regelmäßige Dependency-Updates (`npm audit`)
2. Code-Reviews für alle Änderungen
3. Automatische Security-Scans (GitHub Dependabot)
4. Secrets-Management (Vercel Environment Variables)
5. Least-Privilege-Prinzip für Datenbank-Zugriffe
