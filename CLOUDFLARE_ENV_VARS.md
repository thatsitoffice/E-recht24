# Cloudflare Environment Variables Setup

## Erforderliche Environment Variables

Fügen Sie diese Variablen in Cloudflare Pages → Settings → Variables and Secrets hinzu:

### 1. DATABASE_URL
**Type:** Plaintext (oder Secret, wenn möglich)
**Name:** `DATABASE_URL`
**Value:** `postgresql://postgres:[IHR-PASSWORT]@db.apzqhzzphubyoqnrwghw.supabase.co:5432/postgres`

⚠️ **WICHTIG:** Ersetzen Sie `[IHR-PASSWORT]` mit Ihrem echten Supabase-Passwort!

### 2. NEXTAUTH_URL
**Type:** Plaintext
**Name:** `NEXTAUTH_URL`
**Value:** `https://e-recht24.pages.dev`

⚠️ **WICHTIG:** Falls Sie eine Custom Domain haben, verwenden Sie diese URL stattdessen.

### 3. NEXTAUTH_SECRET
**Type:** Secret (empfohlen) oder Plaintext
**Name:** `NEXTAUTH_SECRET`
**Value:** `HYkOCKWeIhOYaFITf/QJJ4/iIxyFyO9KWxvUcn7zPLo=`

⚠️ **Hinweis:** Für Production sollten Sie einen neuen Secret generieren:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. OPENAI_API_KEY
**Type:** Secret (empfohlen)
**Name:** `OPENAI_API_KEY`
**Value:** `sk-your-openai-api-key-here`

### 5. NODE_ENV
**Type:** Plaintext
**Name:** `NODE_ENV`
**Value:** `production`

## Optionale Variablen (für E-Mail-Authentifizierung)

Falls Sie SMTP konfigurieren möchten:

### 6. SMTP_HOST
**Type:** Plaintext
**Name:** `SMTP_HOST`
**Value:** `smtp.example.com`

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

## So fügen Sie Variablen hinzu:

1. Gehen Sie zu: Cloudflare Pages → Ihr Projekt → Settings
2. Scrollen Sie zu: **Variables and Secrets**
3. Klicken Sie auf: **+ Add**
4. Wählen Sie den **Type** (Plaintext oder Secret)
5. Geben Sie **Name** und **Value** ein
6. Klicken Sie auf **Save**

## Wichtige Hinweise:

- ✅ **Secret** Type verwenden für sensible Daten (Passwörter, API Keys)
- ✅ Nach dem Hinzufügen von Variablen: **Redeploy** das Projekt
- ✅ `NEXTAUTH_URL` muss genau auf Ihre Cloudflare Pages URL zeigen
- ✅ `DATABASE_URL` muss das echte Supabase-Passwort enthalten

## Nach dem Setzen der Variablen:

1. Gehen Sie zu: **Deployments**
2. Klicken Sie auf das neueste Deployment
3. Klicken Sie auf **Retry deployment** oder **Redeploy**
4. Der Build sollte jetzt erfolgreich sein!
