# Render backend deployment

Use repository root so imports from shared/journey.js remain available.

- Service: hisrun-api, Node, Singapore, Free
- Build: npm ci --prefix backend --omit=dev
- Start: npm run seed --prefix backend && npm start --prefix backend
- Health check: /api/health
- NODE_ENV: production
- NODE_VERSION: 24.13.0
- FRONTEND_ORIGIN: https://hisrun.vercel.app
- MONGODB_URI: supply privately in Render environment, including /hisrun database

Seed uses idempotent upserts by contentKey and preserves users/results. Atlas user should have readWrite for hisrun only. Allow the Render service outbound IP ranges in Atlas; do not open all IPs by default. Never commit credentials.

After healthy deployment, set VITE_API_URL on Vercel to the Render HTTPS base URL plus /api and redeploy frontend. Render Free can sleep when idle; first request may need a retry while it wakes.
