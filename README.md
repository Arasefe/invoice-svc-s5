# invoice-svc

Acme's invoice service — the application used throughout the DevSecOps course labs
(Session 5: *Nothing Ships Unscanned*).

```bash
npm ci          # install dependencies
npm test        # run the unit tests
npm run build   # bundle src/ -> dist/app.js
npm start       # build, then run dist/app.js on :3000
```

## Endpoints
- `GET /` — home page (HTML), `GET /version`, `GET /health`
- `GET|POST /invoices/export` — PDF export stub (md-to-pdf **5.2.5**, the Session 4 fix)
- `GET /partner/invoices?file=…` — **partner API, key-gated** (Session 5)
- `GET /partner/export` — partner bulk export stub (key-gated)

## What the Session 5 labs touch
- **`src/partner.js`** ships a **path-traversal** flaw on purpose (INC-0492). Semgrep
  flags it; **Lab 2** fixes it (look up by id, never by path) and adds a test that
  sends `../` and expects HTTP 400.
- The **git history** carries a `.env` that was committed months ago and later removed
  — the leaked **PARTNER_API_KEY** (INC-0485). `gitleaks git -v .` finds it; **Lab 1**
  gates new leaks. See `.gitleaks.toml` for the custom rule.
- **`src/app.js`** ships with no security headers on purpose. ZAP flags them; **Lab 3**
  adds `helmet`. `.zap/rules.tsv` is the triaged ZAP rule config the `dast` gate uses.
- `.github/workflows/ci.yml` is the Session-4 pipeline. Students **add** `security.yml`
  (secret scanning, SAST, SBOM) and `dast.yml` (ZAP baseline) in Labs 1–3.

> GitHub disables Actions on a new fork: open your fork's **Actions** tab and enable
> workflows once, or nothing runs.

> Heads-up: this repo is a teaching target. Do not deploy it anywhere real.
