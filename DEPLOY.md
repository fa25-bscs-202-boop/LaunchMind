# Deploy and production environment setup

This file lists the environment variables and steps needed to deploy LaunchMind to production (example domain: https://launchmind.app). Do NOT commit real secrets to the repo — use your hosting provider's environment variable settings.

## Backend env vars (example keys)
- `DATABASE_URL` — production database connection string (PostgreSQL recommended)
- `JWT_SECRET_KEY` — strong random secret
- `JWT_ALGORITHM` — HS256
- `ACCESS_TOKEN_EXPIRE_MINUTES` — token lifetime in minutes
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` — `https://launchmind.app/auth/google/callback`
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`
- `GITHUB_REDIRECT_URI` — `https://launchmind.app/auth/github/callback`
- `FRONTEND_URL` — `https://launchmind.app`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM_EMAIL`

Save these values in your hosting provider (Vercel, Render, Heroku, DigitalOcean App Platform, etc.).

## Frontend env vars
- `NEXT_PUBLIC_API_URL` — e.g. `https://api.launchmind.app` or `https://launchmind.app`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — optional if using Supabase

## Google OAuth setup
1. In Google Cloud Console, open your project → APIs & Services → OAuth consent screen and publish the app (External) with required info.
2. Go to APIs & Services → Credentials → OAuth 2.0 Client IDs and edit the client.
3. Add the following to Authorized redirect URIs:
   - `https://launchmind.app/auth/google/callback`
   - (optionally) `https://www.launchmind.app/auth/google/callback` if you use www
4. Ensure Authorized JavaScript origins include `https://launchmind.app` if required.

## Deployment steps (high-level)
1. Push code to your repository (do not push secrets).
2. In your hosting provider dashboard, set the environment variables listed above.
3. Build and deploy backend and frontend.
4. Visit `https://launchmind.app` and test the Google/GitHub login flows.

## Notes
- Local dev uses `backend/.env` and `frontend/.env.local` — keep those out of Git.
- If using `127.0.0.1` locally, keep that redirect URI in Google Console for development.
