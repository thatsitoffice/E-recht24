# Cloudflare Environment Variables - Komplette Liste

## ✅ Bereits vorhanden (prüfen Sie die Namen):
- Database (sollte DATABASE_URL heißen)
- Secret (sollte NEXTAUTH_SECRET heißen)
- SECRET KEY (für Turnstile?)
- SITE KEY (für Turnstile?)

## ❌ Noch fehlende Variablen:

### 1. NEXTAUTH_URL
**Type:** Plaintext  
**Name:** `NEXTAUTH_URL`  
**Value:** `https://e-recht24.pages.dev`

---

### 2. OPENAI_API_KEY
**Type:** Secret (empfohlen)  
**Name:** `OPENAI_API_KEY`  
**Value:** `sk-your-openai-api-key-here`  
*(Ersetzen Sie mit Ihrem echten OpenAI API Key)*

---

### 3. NODE_ENV
**Type:** Plaintext  
**Name:** `NODE_ENV`  
**Value:** `production`

---

### 4. DATABASE_URL (falls "Database" nicht korrekt benannt ist)
**Type:** Plaintext  
**Name:** `DATABASE_URL`  
**Value:** `postgresql://postgres:[IHR-PASSWORT]@db.apzqhzzphubyoqnrwghw.supabase.co:5432/postgres`  
*(Ersetzen Sie [IHR-PASSWORT] mit Ihrem Supabase-Passwort)*

---

### 5. NEXTAUTH_SECRET (falls "Secret" nicht korrekt benannt ist)
**Type:** Secret  
**Name:** `NEXTAUTH_SECRET`  
**Value:** `HYkOCKWeIhOYaFITf/QJJ4/iIxyFyO9KWxvUcn7zPLo=`

---

## Optionale Variablen (für E-Mail-Authentifizierung):

### 6. SMTP_HOST
**Type:** Plaintext  
**Name:** `SMTP_HOST`  
**Value:** `smtp.example.com`  
*(Nur wenn Sie E-Mails versenden möchten)*

### 7. SMTP_PORT
**Type:** Plaintext  
**Name:** `SMTP_PORT`  
**Value:** `587`

### 8. SMTP_USER
**Type:** Plaintext  
**Name:** `SMTP_USER`  
**Value:** `noreply@ihre-domain.com`

### 9. SMTP_PASSWORD
**Type:** Secret  
**Name:** `SMTP_PASSWORD`  
**Value:** `ihr-smtp-passwort`

### 10. SMTP_FROM
**Type:** Plaintext  
**Name:** `SMTP_FROM`  
**Value:** `noreply@ihre-domain.com`

---

## ⚠️ WICHTIG: Prüfen Sie die vorhandenen Variablen

Bitte prüfen Sie, ob diese Variablen die **korrekten Namen** haben:

1. **"Database"** → Sollte **"DATABASE_URL"** heißen
2. **"Secret"** → Sollte **"NEXTAUTH_SECRET"** heißen

Falls die Namen nicht korrekt sind, können Sie sie bearbeiten (Stift-Icon) oder löschen und neu hinzufügen.

---

## Mindestanforderung für funktionierende App:

✅ DATABASE_URL  
✅ NEXTAUTH_URL  
✅ NEXTAUTH_SECRET  
✅ OPENAI_API_KEY  
✅ NODE_ENV
