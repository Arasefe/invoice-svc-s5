# Releasing invoice-svc

> The team's hand-built release path (pre-pipeline). Session 4 replaced the *deploy*
> with a pipeline; the artifacts it produced still packed the whole working tree —
> **including `.env`** — which is how secrets rode out in the "box" (INC-0485).

1. On your laptop:  `npm ci && npm run build`
2. Pack:  `tar czf invoice-$V.tar.gz dist node_modules package.json .env`
3. Copy:  `scp invoice-$V.tar.gz deploy@web-01:/srv/releases/`
4. On web-01:  unpack into `/srv/invoice`, then `sudo systemctl restart invoice`

> Step 2 is the mistake Session 5 fixes: a release should never contain `.env`, and
> the pipeline should scan the artifact (`gitleaks dir ./dist`) before it ships.
