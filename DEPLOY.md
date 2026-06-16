# Deploying CommonGround to Render + Aiven

## 1. Aiven (MySQL Database)

### Create MySQL service
1. Sign up at [aiven.io](https://aiven.io)
2. Create a new **MySQL** service
3. Choose region close to Render (e.g. `aws-us-east-1`)
4. Note the connection details from the service overview

### Connection details
Aiven provides:
- **Host** — e.g. `your-service-name.aivencloud.com`
- **Port** — often `22013` (not 3306)
- **User** — usually `avnadmin`
- **Password** — set when creating the service
- **Database** — default is `defaultdb` or create one

### SSL
Aiven MySQL requires SSL. The app uses `DB_SSL_ENABLED=true` to enable it.

Optional: Download the CA certificate from Aiven’s service page and set `DB_CA_CERT` to its contents (for stricter validation).

### Network access (IP allowlist)

In the **Aiven console** → open your **MySQL service** → scroll to **Cloud and network**:

- **IP address allowlist** — set to **Open to all** (or add `0.0.0.0/0`). Required for Render; its outbound IPs change.
- If you see a warning icon next to “Open to all”, that is expected for demo/hackathon deploys.

Render cannot connect if this stays restricted to specific IPs only.

---

## 2. Render (Web Service)

### Create Web Service

**Blueprint (recommended)** — repo includes `render.yaml`:
1. Push latest code to GitHub (`FaizanMalek/commonGround`)
2. [Render](https://render.com) → **New → Blueprint**
3. Connect the repo; Render reads `render.yaml`
4. When prompted, enter:
   - `DB_PASSWORD` — Aiven password
   - `CORS_ORIGINS` — leave blank on first deploy, then set to your live URL and redeploy
   - `ADMIN_DEFAULT_PASSWORD` — coordinator password for production

**Manual Web Service**
1. **New → Web Service** → connect repo
2. Build: `npm install` · Start: `npm start` · Health check: `/api/health`
3. Copy env vars from `render.env.example`

### Environment variables
Use **Blueprint** (`render.yaml` in repo) or copy from `render.env.example`.

Pre-configured for this project’s Aiven service (non-secrets in `render.yaml`):

| Variable | Value |
|----------|-------|
| `DB_HOST` | `commonground-commonground.h.aivencloud.com` |
| `DB_PORT` | `16724` |
| `DB_USER` | `avnadmin` |
| `DB_NAME` | `defaultdb` |
| `DB_SSL_ENABLED` | `true` |
| `DB_CA_CERT_PATH` | `ca.pem` (committed in repo) |

Set in Render dashboard (secrets):

| Variable | Value |
|----------|-------|
| `DB_PASSWORD` | Your Aiven password |
| `JWT_SECRET` | Auto-generated if using Blueprint, or random 32+ chars |
| `COOKIE_SECRET` | Auto-generated if using Blueprint |
| `CORS_ORIGINS` | `https://YOUR-SERVICE.onrender.com` (after first deploy) |
| `ADMIN_DEFAULT_PASSWORD` | Coordinator login password |

`PORT` is assigned by Render automatically. Do not commit passwords to git.

### Optional
- `DB_CA_CERT` — Inline cert instead of `DB_CA_CERT_PATH` (not needed if `ca.pem` is in repo)

---

## 3. Run migration

Aiven starts with an empty database. Run the migration once:

**Option A — From your machine**
```bash
# Set env vars to match Aiven, then:
npm run migrate
```

**Option B — Render shell**
1. In Render dashboard → your service → **Shell**
2. Run: `npm run migrate`

**Option C — One-off job**
Create a one-off job in Render that runs `npm run migrate` with the same env vars.

---

## 4. Checklist

- [ ] Aiven MySQL service created
- [ ] Database created (or using `defaultdb`)
- [ ] Render Web Service created and connected to GitHub
- [ ] All env vars set in Render (especially `DB_*` and `DB_SSL_ENABLED=true`)
- [ ] `CORS_ORIGINS` includes your Render URL
- [ ] `COOKIE_SECURE=true` for HTTPS
- [ ] Migration run successfully
- [ ] App starts and connects to database

---

## 5. Troubleshooting

**"Database connection failed" (most common: Aiven IP allowlist)**
1. **Aiven IP allowlist** — In Aiven dashboard → your MySQL service → Settings → "Allowed IP addresses". Add `0.0.0.0/0` to allow connections from anywhere (Render uses dynamic IPs). Without this, Render cannot connect.
2. Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` are set in Render Environment
3. Use `DB_NAME=defaultdb` (Aiven's default) unless you created another database
4. Ensure `DB_SSL_ENABLED=true` and `DB_CA_CERT_PATH=ca.pem`

**"SSL connection error"**
- Set `DB_SSL_ENABLED=true`
- If needed, add Aiven’s CA cert to `DB_CA_CERT`

**CORS errors (`Not allowed by CORS` in logs)**
- Set **`CORS_ORIGINS`** to your exact Render URL, e.g. `https://commonground-xxxx.onrender.com` (no trailing slash).
- Render also sets **`RENDER_EXTERNAL_URL`** automatically; recent app versions allow that without manual CORS setup.
- Wrong URL (http vs https, typo, extra `/`) causes login/API to fail.

**Cookies not persisting**
- Set `COOKIE_SECURE=true` for HTTPS
- Ensure `CORS_ORIGINS` includes the exact frontend origin and `credentials: true` is used

**"Internal server error" on login**
1. In Render **Logs**, look for `Login error:` or `ValidationError` / `X-Forwarded-For` (fixed in latest code via `trust proxy`).
2. Run **`npm run migrate`** and **`npm run seed:demo`** in Render Shell if the DB is empty.
3. Use the password that matches production: **`ADMIN_DEFAULT_PASSWORD`** from Render env (migrate uses this), or demo **`password123`** after `seed:demo`.
4. Confirm **`JWT_SECRET`** is set (Blueprint auto-generates it).
5. Set **`CORS_ORIGINS`** to your exact Render URL, e.g. `https://commonground-xxxx.onrender.com` (no trailing slash).
