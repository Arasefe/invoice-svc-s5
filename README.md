# invoice-svc

Acme's invoice service — the application used throughout the DevSecOps course labs
(Session 5: *Nothing Ships Unscanned*).

```bash
npm ci          # install dependencies
npm test        # run the unit tests
npm run build   # bundle src/ -> dist/app.js
npm start       # run dist/app.js
```

## Endpoints
- `GET /version`, `GET /health`
- `GET|POST /invoices/export` — PDF export stub (md-to-pdf **5.2.5**, the Session 4 fix)
- `GET /partner/invoices?file=…` — **partner API, key-gated** (Session 5)
- `GET /partner/export` — partner bulk export stub (key-gated)

## What the Session 5 labs touch
- **`src/partner.js`** ships a **path-traversal** flaw on purpose (INC-0492). Semgrep
  flags it; **Lab 2** fixes it (look up by id, verify the path stays under BASE) and
  adds a test. Answer key: `../web01/assets/partner.fixed.js`.
- The **git history** carries a `.env` that was committed months ago and later removed
  — the leaked **PARTNER_API_KEY** (INC-0485). `gitleaks git .` finds it; **Lab 1**
  gates new leaks. See `.gitleaks.toml` for the custom rule.
- `.github/workflows/ci.yml` is the Session-4 pipeline. Students **add** `security.yml`
  (secret scanning, then SAST) in Labs 1–2.

> Heads-up: this repo is a teaching target. Do not deploy it anywhere real.
