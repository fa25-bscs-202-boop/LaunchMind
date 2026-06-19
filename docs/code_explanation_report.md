# Launch Mind Code Explanation Report

Generated on: June 19, 2026

## 1. Project Overview

Launch Mind is a full-stack startup planning application. The backend is a FastAPI API that stores users, projects, AI-generated startup analyses, SWOT analyses, competitor analyses, MVP plans, pitch decks, and feasibility reports. The frontend is a Next.js application that gives users public marketing pages, authentication screens, a dashboard, analysis forms, detail pages, and PDF export actions.

The central workflow is:

1. A user enters a startup idea in the frontend.
2. The frontend sends that idea to the backend through `/ideas/analyze`.
3. The backend sends a structured prompt to OpenRouter through the OpenAI-compatible SDK.
4. The AI response is parsed as JSON, cleaned, normalized, stored in the database, and returned to the frontend.
5. The saved analysis can then be used to generate reports, pitch decks, SWOT documents, competitor analyses, and MVP plans.
6. Export routes convert saved data into Markdown, HTML, or PDF documents.

This structure separates responsibilities clearly:

- `frontend/` handles the user interface and browser-side API calls.
- `backend/app/routes/` defines HTTP endpoints.
- `backend/app/services/` contains AI prompting, parsing, normalization, OAuth, email, and export logic.
- `backend/app/models/` defines database tables with SQLAlchemy.
- `backend/app/schemas/` defines request and response shapes with Pydantic.
- `backend/app/utils/` holds shared helpers for authentication, security, and email validation.

Generated files such as `__pycache__/`, lockfiles, and `backend/launchmind.db` are not source logic, but they matter operationally. The SQLite database stores local development data, and lockfiles pin dependency versions.

## 2. Root-Level Files

### `README.md`

The root README is very small and identifies the repository as Launch-Mind. It does not currently provide setup or architecture instructions, so the more useful documentation lives in `backend/README.md`, `frontend/README.md`, and this generated report.

### `DEPLOY.md`

This file is intended for deployment guidance. It belongs at the project root because deployment concerns involve both the backend and frontend, plus environment variables that connect them.

### `package-lock.json`

There is a root-level package lock, but the active Next.js app has its own `frontend/package.json` and `frontend/package-lock.json`. The root lockfile should be treated carefully because it may be leftover or support a workflow not visible in the current source files.

## 3. Backend Architecture

The backend is built with FastAPI, SQLAlchemy, Pydantic, Passlib, JWT, OpenRouter/OpenAI SDK, requests, SMTP email, and ReportLab.

Important backend dependencies from `backend/requirements.txt` include:

- `fastapi`, `starlette`, and `uvicorn` for the API server.
- `SQLAlchemy` for ORM models and database access.
- `pydantic` and `email-validator` for request/response validation.
- `passlib`, `bcrypt`, and `python-jose` for password hashing and JWT handling.
- `openai` for OpenRouter's OpenAI-compatible chat API.
- `requests` for OAuth token/profile calls.
- `python-dotenv` for `.env` loading.
- `reportlab` for PDF generation.

### `backend/app/main.py`

`main.py` is the API entry point. It imports all models through `import app.models`, then calls:

- `Base.metadata.create_all(bind=engine)` to create database tables from SQLAlchemy models.
- `add_missing_user_columns_for_sqlite()` to patch older local SQLite databases that do not yet have newer auth columns.

Then it creates the FastAPI application with the configured name and version. CORS is set to allow all origins, methods, credentials, and headers. That is convenient for development, but production should restrict origins to trusted frontend domains.

The file includes every router:

- `/auth` for email/password auth and token endpoints.
- `/auth/google` and `/auth/github` OAuth endpoints.
- `/ai` for testing AI connectivity.
- `/ideas` for startup idea analysis.
- `/analyses` for reading/deleting saved analyses.
- `/projects` for project CRUD.
- `/reports` for full feasibility reports.
- `/pitch` for pitch decks.
- `/swot` for SWOT analysis.
- `/competitors` for competitor analysis.
- `/mvp` for MVP plans.
- `/exports` for Markdown, HTML, and PDF output.
- `/health` for health checks.

The root `GET /` endpoint returns a simple status object with app name, message, and version.

### `backend/app/config.py`

`config.py` centralizes settings. It loads `.env` with `load_dotenv()` and exposes a `settings` object.

The helper `get_env_value()` is defensive. It cleans whitespace, strips quotes, and even tries to recover from accidentally copied values like `JWT_SECRET_KEY=abc` being placed as the value itself. `get_env_url()` also removes trailing slashes from URLs.

Important settings:

- `DATABASE_URL` defaults to `sqlite:///./launchmind.db`.
- `JWT_SECRET_KEY`, `JWT_ALGORITHM`, and `ACCESS_TOKEN_EXPIRE_MINUTES` control JWT auth.
- `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and `OPENROUTER_BASE_URL` control AI calls.
- Google and GitHub client settings control OAuth.
- `FRONTEND_URL` controls OAuth redirects back to the frontend.
- SMTP settings control verification email delivery.

### `backend/app/database.py`

This file creates the database engine, session factory, declarative base, and dependency function.

- `engine` is created from `settings.DATABASE_URL`.
- SQLite gets `check_same_thread=False` so FastAPI request handling can use SQLite safely enough for local development.
- `SessionLocal` creates SQLAlchemy sessions.
- `Base` is the parent class for all ORM models.
- `get_db()` is a FastAPI dependency that yields a session and closes it afterward.

`add_missing_user_columns_for_sqlite()` is a small local migration helper. It checks whether a SQLite database already has a `users` table, inspects existing columns, and adds OAuth/verification columns if missing. This is not a full migration system like Alembic, but it prevents older local databases from breaking after auth fields were added.

## 4. Backend Data Models

Every model inherits from `Base` and maps to a database table.

### `User`

`backend/app/models/user.py` defines users.

Key fields:

- `id`: primary key.
- `name`: display name.
- `email`: unique login identity.
- `password_hash`: bcrypt-hashed password or placeholder for OAuth/guest users.
- `provider` and `provider_id`: identify OAuth or guest provider.
- `is_verified`: controls whether email/password users can log in.
- `verification_code_hash` and `verification_code_expires_at`: support email verification.
- `created_at`: timezone-aware creation timestamp.

`projects = relationship("Project", back_populates="owner")` connects users to projects.

### `Project`

`backend/app/models/project.py` stores a user's original startup idea before or around analysis.

Fields include title, raw idea, industry, target audience, status, created timestamp, and updated timestamp. The `updated_at` column uses SQLAlchemy's `onupdate` callback so edits refresh the timestamp automatically.

### `Analysis`

`backend/app/models/analysis.py` stores the core AI startup analysis.

It includes:

- original idea metadata: `idea`, `industry`, `target_audience`, optional `project_id`;
- generated positioning: `startup_names`, `one_line_pitch`;
- feasibility sections: market, technical, financial, operational, legal;
- strategic fields: risk assessment, revenue model, launch roadmap, final recommendation.

Some list-like values are stored as JSON text strings, such as `startup_names`, `risk_assessment`, `revenue_model`, and `launch_roadmap`. Pydantic response validators convert those strings back to arrays for the frontend.

### `SWOTAnalysis`

`backend/app/models/swot_analysis.py` stores generated SWOT output for a saved analysis:

- strengths
- weaknesses
- opportunities
- threats
- strategic recommendations

Each field is text, commonly containing JSON-encoded arrays.

### `CompetitorAnalysis`

`backend/app/models/competitor_analysis.py` stores market comparison output:

- direct competitors
- indirect competitors
- competitor strengths
- competitor weaknesses
- market gap
- differentiation strategy
- pricing comparison
- recommendations

### `MVPPlan`

`backend/app/models/mvp_plan.py` stores an implementation-focused plan:

- MVP summary
- core features
- excluded features
- recommended tech stack
- development phases
- timeline
- required team
- budget considerations
- launch checklist
- success metrics

### `PitchDeck`

`backend/app/models/pitch_deck.py` stores pitch-deck content:

- startup name
- elevator pitch
- problem
- solution
- market
- business model
- competitor landscape
- go-to-market strategy
- revenue model
- MVP summary
- traction strategy
- funding needs
- roadmap
- closing statement

### `Report`

`backend/app/models/report.py` stores a formal feasibility report. Its fields match report sections such as executive summary, methodology, feasibility areas, legal considerations, findings, recommendations, and conclusion.

### `models/__init__.py`

This file imports every ORM model and exposes them through `__all__`. Importing `app.models` in `main.py` ensures SQLAlchemy knows all table definitions before `create_all()` runs.

## 5. Backend Schemas

Schemas live in `backend/app/schemas/`. They are Pydantic models that validate inbound JSON and shape outbound responses.

### Auth Schemas

`auth.py` defines:

- `UserRegister`: name, email, password.
- `UserLogin`: email and password.
- `VerifyEmailRequest`: email and six-digit code.
- `ResendCodeRequest`: email.
- `UserResponse`: id, name, email, created_at.

Email fields use `EmailStr`, so invalid email formats are rejected before route logic runs.

### Analysis Schemas

`analysis.py` defines `AnalysisResponse` and `AnalysisListResponse`.

Its important feature is `parse_json_list()`. Database list values are stored as strings, but the frontend expects arrays. The validator converts JSON strings into Python lists for:

- startup names
- risk assessment
- revenue model
- launch roadmap

If parsing fails, it returns an empty list instead of crashing the response.

### Idea Schema

`idea.py` defines the request for idea analysis. It carries the idea text, optional industry, optional target audience, and optional project id.

### Project, Report, Pitch, SWOT, Competitor, MVP, AI Schemas

These files define response objects that mirror database fields. Their job is to keep API responses predictable and to let FastAPI generate accurate OpenAPI documentation.

## 6. Authentication and Security

### `backend/app/utils/security.py`

This file handles password hashing and JWTs.

- `hash_password()` hashes plain text with Passlib's bcrypt context.
- `verify_password()` compares a plain password to a stored hash.
- `create_access_token()` copies token data, adds an expiration timestamp, and encodes it with the configured JWT secret and algorithm.
- `decode_access_token()` decodes and verifies a JWT, returning `None` if verification fails.

### `backend/app/utils/dependencies.py`

`get_current_user()` is the main auth dependency. It uses `OAuth2PasswordBearer` with `auto_error=False`, which means missing tokens do not automatically reject the request.

Instead, missing, invalid, expired, or unknown-user tokens fall back to a guest user. That guest user is created by `get_or_create_guest_user()` with:

- email `guest@launchmind.local`
- provider `guest`
- verified status

This design makes many API flows usable without a real account, but it also means authorization is permissive by default. If private-account-only behavior is required later, the app should add a stricter dependency for protected routes.

### `backend/app/routes/auth.py`

This route file implements email/password registration, email verification, resend code, login, OAuth-compatible token login, and `/auth/me`.

Important behavior:

- Only Gmail addresses are currently allowed.
- Passwords shorter than six characters are rejected.
- Passwords too similar to name/email are rejected.
- Existing verified accounts cannot be registered again.
- Existing unverified accounts are deleted and recreated during registration.
- Verification codes are six digits, randomly generated with `secrets.randbelow()`.
- Verification codes expire after 10 minutes.
- Codes are stored hashed, not plain text.
- Unverified users cannot log in. When they try, a new verification code is sent.

The `/auth/login` endpoint returns a JWT plus user data. The `/auth/token` endpoint returns the OAuth2-compatible token shape used by Swagger/UI clients.

## 7. OAuth and Email

### `backend/app/services/oauth_service.py`

This service builds OAuth login URLs and exchanges provider callback codes for profile data.

Google flow:

- `build_google_auth_url()` builds the Google consent URL.
- `exchange_google_code_for_user()` exchanges the code for a token, calls Google's userinfo endpoint, and returns provider profile data.

GitHub flow:

- `build_github_auth_url()` builds the GitHub authorize URL.
- `exchange_github_code_for_user()` exchanges the code, fetches the GitHub user profile, and resolves a verified primary email when possible.

### `backend/app/routes/oauth.py`

The OAuth routes use the service above, then call local user logic:

- If a provider account already exists, reuse it.
- If an email account already exists, attach provider metadata and mark it verified.
- Otherwise, create a new verified OAuth user.

After OAuth login succeeds, the backend creates a JWT and redirects to the frontend success page with the token in the query string. On failure, it redirects to the frontend OAuth error page.

### `backend/app/services/email_service.py`

This file sends verification emails. If SMTP is not configured, it prints the verification code in development mode instead of sending email. When SMTP is configured, it uses the configured host, port, username, password, and sender email.

### `backend/app/utils/email.py`

This utility currently contains `is_gmail_address()`, used by auth routes to restrict registration/login to Gmail addresses.

## 8. AI Service Pattern

The AI services follow a repeated architecture:

1. Define a system prompt that tells the model exactly what JSON shape to return.
2. Define a default object for all expected fields.
3. Build a user prompt from the saved analysis or idea.
4. Call OpenRouter through the OpenAI SDK.
5. Extract JSON from the model response.
6. Clean text to remove Markdown, bad punctuation, hype language, and boilerplate.
7. Normalize missing or malformed fields.
8. Return a plain dictionary to the route.

### `backend/app/services/ai_service.py`

This is the core startup idea analyzer.

`IDEA_ANALYSIS_SYSTEM_PROMPT` asks the AI to behave like a practical feasibility consultant and return only raw JSON. It also discourages hype phrases and fake statistics.

`extract_json_from_text()` handles imperfect model output. It first tries to parse the full response as JSON. If that fails, it searches for the first `{` and last `}` and tries to parse that slice. This makes the app more tolerant of accidental text around the JSON.

`clean_ai_text()` removes code fences, Markdown bold markers, AI boilerplate, long dash characters, replacement characters, repeated punctuation, and banned hype phrases.

`normalize_analysis()` ensures every required key exists and has the right type. List fields become clean lists; string fields become clean strings.

`get_openrouter_client()` checks for an API key and imports the OpenAI SDK lazily. This makes configuration errors clear.

`test_ai_connection()` sends a simple chat completion and returns the text.

`analyze_startup_idea()` builds the final prompt, sends it to OpenRouter, validates the response, and returns normalized analysis data.

### `swot_service.py`

This service generates SWOT sections from an existing analysis. It uses the same JSON extraction and cleanup pattern, but the expected fields are strengths, weaknesses, opportunities, threats, and strategic recommendations.

### `competitor_service.py`

This service turns a saved analysis into competitor intelligence. It asks for direct/indirect competitors, strengths, weaknesses, market gaps, differentiation, pricing comparison, and recommendations.

### `mvp_service.py`

This service turns a saved analysis into a practical product-building plan. It produces core features, exclusions, tech stack, development phases, timeline, team, budget considerations, checklist, and metrics.

### `pitch_service.py`

This service turns a saved analysis into pitch-deck content. It focuses on investor-style sections: pitch, problem, solution, market, model, competition, go-to-market, traction, funding, roadmap, and closing.

### `report_service.py`

This service generates a formal feasibility report. Unlike some other services, it defines specific custom exceptions:

- `ReportGenerationUnavailableError`
- `ReportAIConfigurationError`
- `ReportInvalidResponseError`

The route maps those exception types to user-friendly HTTP errors.

## 9. Backend Routes

### `health.py`

`GET /health` returns a basic health status. It is useful for deployment checks and quick local testing.

### `ai.py`

`POST /ai/test` lets a caller test whether the AI connection works. It delegates to `test_ai_connection()`.

### `ideas.py`

`POST /ideas/analyze` is the most important creation endpoint.

It:

1. Optionally verifies that `project_id` belongs to the current user.
2. Calls `analyze_startup_idea()`.
3. Converts AI list fields to JSON strings for storage.
4. Saves an `Analysis` row.
5. Returns `AnalysisResponse`, where validators convert stored JSON strings back to arrays.

OpenRouter and model errors are returned as `502 Bad Gateway`. Other value errors become `400 Bad Request`.

### `analyses.py`

This file supports saved analysis management:

- `GET /analyses` returns all analyses for the current user, newest first.
- `GET /analyses/{analysis_id}` returns one analysis if it belongs to the current user.
- `DELETE /analyses/{analysis_id}` deletes one analysis.

Every query filters by `user_id`, which prevents users from fetching each other's records.

### `projects.py`

This file implements project CRUD:

- create project
- list projects
- get one project
- update project with partial fields
- delete project

The update endpoint uses `model_dump(exclude_unset=True)` so omitted fields are not overwritten with null values.

### `reports.py`

`POST /reports/generate/{analysis_id}` creates a formal report from an existing analysis.

The route verifies ownership of the analysis, calls `generate_report_from_analysis()`, catches report-specific exceptions, stores the new `Report`, and returns it.

It also provides list, detail, and delete endpoints for reports.

### `pitch.py`

This file mirrors the report pattern for pitch decks:

- Generate from an analysis.
- List all pitch decks for the current user.
- Fetch one deck.
- Delete one deck.

### `swot.py`

This file mirrors the same pattern for SWOT analyses.

### `competitors.py`

This file mirrors the same pattern for competitor analyses.

### `mvp.py`

This file mirrors the same pattern for MVP plans.

### `exports.py`

The exports router converts saved records into downloadable formats.

For startup analyses:

- `GET /exports/analysis/{analysis_id}/markdown`
- `GET /exports/analysis/{analysis_id}/html`
- `GET /exports/analysis/{analysis_id}/pdf`

For generated artifacts:

- `GET /exports/report/{report_id}/pdf`
- `GET /exports/pitch/{pitch_id}/pdf`
- `GET /exports/swot/{swot_id}/pdf`
- `GET /exports/mvp/{mvp_id}/pdf`

The helper `get_user_record()` is important. It filters by both record id and current user's id, so exports cannot be downloaded across users.

## 10. Export Service

`backend/app/services/export_service.py` converts database objects into Markdown, HTML, and PDF.

Important helpers:

- `parse_list()` accepts a Python list, a JSON string containing a list, or a plain string fallback.
- `markdown_list()` renders bullet lists.
- `html_list()` escapes list items and renders HTML lists.
- `analysis_to_markdown()` formats a saved analysis as a Markdown document.
- `analysis_to_html()` creates a standalone HTML report with inline CSS.

PDF generation uses ReportLab:

- `pdf_styles()` defines Times-based title, meta, section, body, and footer styles.
- `clean_pdf_text()` normalizes Unicode dash variants, nonbreaking spaces, and invalid characters.
- `paragraph()` safely escapes text for ReportLab.
- `bullet_list()` creates bullet lists.
- `draw_pdf_frame()` draws a header line, footer, document type, and page number.
- `build_pdf()` assembles the document and returns raw PDF bytes.

Format-specific functions map model fields into sections:

- `analysis_to_pdf()`
- `report_to_pdf()`
- `pitch_to_pdf()`
- `swot_to_pdf()`
- `mvp_to_pdf()`

This service is one of the more reusable parts of the backend because it cleanly separates document rendering from route code.

## 11. Frontend Architecture

The frontend is a Next.js app using the App Router, React 19, TypeScript, Tailwind CSS 4, and plain browser `fetch`.

Important scripts in `frontend/package.json`:

- `npm run dev`: starts the development server.
- `npm run build`: builds the production app.
- `npm run start`: runs the production build.
- `npm run lint`: runs ESLint.

The app is organized by routes under `frontend/app/`. Shared browser helpers live in `frontend/lib/`.

## 12. Frontend Shared Libraries

### `frontend/lib/api.ts`

This file centralizes API calls.

- `API_BASE_URL` comes from `NEXT_PUBLIC_API_URL`, defaulting to `http://127.0.0.1:8000`.
- `ApiError` preserves an HTTP status code with the error message.
- `getStoredToken()` reads `launchmind_token` from localStorage on the client.
- `isUnauthorizedError()` identifies API 401 errors.
- `apiRequest<T>()` builds headers, attaches Bearer auth when a token exists, sends the request, parses JSON or text, and throws `ApiError` for non-OK responses.

This keeps page components from repeating fetch boilerplate.

### `frontend/lib/auth.ts`

This file wraps auth behavior.

Important details:

- Real JWTs are stored under `launchmind_token`.
- If there is no browser token, `getToken()` returns `launchmind_guest`.
- `getCurrentUser()` calls `/auth/me` but falls back to a local guest user if the request fails.
- `registerUser()`, `verifyEmail()`, `resendVerificationCode()`, and `loginUser()` call backend auth routes.
- `loginUser()` saves the returned access token.
- `logoutUser()` removes the token from localStorage.

The guest token pairs with the backend's permissive `get_current_user()` fallback.

### `frontend/lib/download.ts`

`downloadPdf()` requests a PDF endpoint with a Bearer token, converts the response into a Blob, creates a temporary object URL, clicks a temporary anchor element, and revokes the URL. This is the browser-side download mechanism used by PDF export buttons.

## 13. Frontend Layout and Navigation

### `frontend/app/layout.tsx`

The root layout loads the Inter font, imports global CSS, defines metadata, and wraps the whole app in `SmartNavbar`.

### `frontend/app/components/SmartNavbar.tsx`

This component decides whether the sidebar navbar should appear. It hides the sidebar on:

- `/`
- `/login`
- `/register`
- `/verify-email`
- OAuth pages

For dashboard pages, it renders `Navbar` and applies left padding on large screens so the sidebar does not overlap content.

### `frontend/app/components/Navbar.tsx`

This is the main sidebar/navigation component. It gives authenticated/dashboard users links into the app's core tools and likely handles session-oriented navigation such as logout. It is intentionally separate from `SmartNavbar` so route-level layout logic stays small.

### `frontend/app/components/AuthHeader.tsx`

This is a small reusable auth-page header component. It keeps login/register/verification pages visually consistent.

### `frontend/app/components/PdfExportButton.tsx`

This client component wraps `downloadPdf()`. It manages exporting state and shows a small error message if the download fails. Detail pages use it instead of re-implementing PDF download logic.

## 14. Frontend Public Pages

### `frontend/app/page.tsx`

The landing page introduces LaunchMind AI and links users into the product. It is mostly presentational but important because it is the first public entry point.

### `features/page.tsx`, `pricing/page.tsx`, `about/page.tsx`, `contact/page.tsx`

These are static or mostly static public pages. They describe product capabilities, pricing, background, and contact information.

### `template.tsx`

The app-level template provides route transition behavior. It wraps pages in a place where animation or remount behavior can be applied across navigation.

## 15. Frontend Authentication Pages

### `login/page.tsx` and `login/LoginForm.tsx`

The login page renders the `LoginForm`. The form:

- supports Google OAuth redirect through the backend;
- validates email/password presence and minimum password length;
- calls `loginUser()`;
- redirects to `/dashboard` after success;
- displays backend errors such as invalid password or unverified email.

### `register/page.tsx` and `register/RegisterForm.tsx`

The registration page renders `RegisterForm`. The form:

- supports Google OAuth redirect;
- validates name, email, and password presence;
- validates minimum password length;
- calls `/auth/register`;
- redirects to `/verify-email?email=...` after account creation.

### `verify-email/page.tsx` and `verify-email/verify-form.tsx`

The verification page lets users submit the emailed six-digit code. It also supports resending a code. After successful verification, the user can log in.

### `oauth/success/page.tsx` and `oauth/error/page.tsx`

These pages handle OAuth redirects from the backend. The success page extracts the token, stores it, and moves the user into the dashboard. The error page presents a failure state.

## 16. Frontend Dashboard Flow

### `dashboard/page.tsx`

This is the hub page after login or guest entry. It loads the current user, handles unauthorized sessions by logging out and redirecting, and renders cards for:

- new idea analysis
- saved analyses
- reports
- pitch decks
- SWOT
- competitors
- MVP planner

### `dashboard/new-analysis/page.tsx`

This is the main creation screen. It manages:

- idea text
- industry
- target audience
- field validation
- loading state
- request errors
- analysis result rendering

On submit, it posts to `/ideas/analyze`. When a response arrives, it renders startup names, one-line pitch, feasibility sections, risk assessment, revenue model, launch roadmap, and final recommendation.

### `dashboard/analyses/page.tsx`

This page lists saved analyses. It lets the user return to previous analyses and continue generating related artifacts.

### `dashboard/analyses/[id]/page.tsx`

This detail page loads one saved analysis and renders all major sections. It also provides action cards to generate:

- full report through `/reports/generate/{analysis.id}`;
- pitch deck through `/pitch/generate/{analysis.id}`;
- SWOT analysis through `/swot/generate/{analysis.id}`;

It includes `PdfExportButton` for exporting the analysis itself.

### Reports Pages

`dashboard/reports/page.tsx` lists generated reports. `dashboard/reports/[id]/page.tsx` shows one report, supports deletion, and exports the report as PDF.

### Pitch Pages

`dashboard/pitch/page.tsx` lists generated pitch decks. `dashboard/pitch/[id]/page.tsx` shows deck sections and exports PDF.

### SWOT Pages

`dashboard/swot/page.tsx` lists SWOT analyses. `dashboard/swot/[id]/page.tsx` shows strengths, weaknesses, opportunities, threats, recommendations, and PDF export.

### Competitor Pages

`dashboard/competitors/page.tsx` lists competitor analyses. `dashboard/competitors/[id]/page.tsx` shows competitor categories, strengths, weaknesses, gaps, differentiation, pricing, and recommendations.

### MVP Pages

`dashboard/mvp/page.tsx` lists MVP plans. `dashboard/mvp/[id]/page.tsx` shows the implementation plan and PDF export.

### `dashboard/template.tsx`

This template wraps dashboard routes, likely for page transitions or consistent remount behavior.

## 17. End-to-End Data Flow Example

For a new idea analysis:

1. User opens `/dashboard/new-analysis`.
2. React state stores form values.
3. Client validation ensures idea is at least 20 characters and industry/audience are present.
4. `apiRequest()` sends `POST /ideas/analyze`.
5. `get_current_user()` resolves a real user or guest user.
6. The route optionally checks project ownership.
7. `analyze_startup_idea()` sends the prompt to OpenRouter.
8. The service extracts JSON, cleans strings, normalizes lists, and returns a dictionary.
9. The route saves an `Analysis` row.
10. `AnalysisResponse` converts JSON text fields into arrays.
11. The frontend renders the result and offers links to saved analyses.

For generating a report:

1. User opens an analysis detail page.
2. User clicks generate report.
3. Frontend calls `POST /reports/generate/{analysis_id}`.
4. Backend verifies the analysis belongs to the current user.
5. `report_service.py` builds a report prompt from that analysis.
6. The report is parsed, cleaned, normalized, and stored.
7. Frontend redirects to `/dashboard/reports/{report.id}`.
8. User can export PDF through `/exports/report/{report_id}/pdf`.

## 18. Error Handling

The backend mostly uses `HTTPException` to return clear status codes:

- `400` for bad input or invalid responses.
- `401` for invalid login credentials.
- `403` for unverified email login.
- `404` for records not found or not owned by the user.
- `502` for AI response/request failures.
- `503` for unavailable or unconfigured AI report generation.

The frontend catches `ApiError`, checks unauthorized errors, and displays user-friendly messages. Some pages redirect to login on unauthorized sessions.

## 19. Strengths of the Codebase

- The separation between routes, services, models, schemas, and utilities is clear.
- AI outputs are normalized before saving, which protects the UI from malformed model responses.
- Ownership filters are consistently applied to user-specific records.
- Email verification stores hashed codes instead of plain codes.
- PDF generation is centralized and reusable.
- The frontend has a shared API helper and auth helper, reducing duplication.
- The dashboard flow maps cleanly to backend resources.

## 20. Risks and Improvement Areas

### Permissive Guest Auth

`get_current_user()` falls back to guest access for missing or invalid tokens. This is useful for demos, but it means invalid auth does not always fail closed. A stricter dependency should be added for routes that must require real accounts.

### No Real Migration System

The SQLite helper adds missing user columns, but broader schema changes would be safer with Alembic or another migration system.

### CORS Allows Everything

`allow_origins=["*"]` is convenient in development but should be restricted in production.

### JSON Lists Stored as Text

List fields are stored as JSON strings in text columns. This works, but native JSON columns or relational child tables would be stronger for querying and validation.

### AI Calls Are Synchronous

Long AI generation happens during request handling. For production, background jobs or queues could improve reliability and user experience.

### Frontend Auth Checks Are Mixed With Guest Logic

Some pages check for a token, but `getToken()` usually returns a guest token. This works with the backend's guest behavior, but it can make "logged in" versus "guest" behavior harder to reason about.

### Limited Automated Tests

No test files were visible in the repository. The most important tests to add would cover auth flows, ownership filtering, AI response parsing, export generation, and frontend form validation.

## 21. Suggested File Reading Order

For someone learning this codebase, read in this order:

1. `backend/app/main.py`
2. `backend/app/config.py`
3. `backend/app/database.py`
4. `backend/app/models/*.py`
5. `backend/app/schemas/analysis.py` and `backend/app/schemas/auth.py`
6. `backend/app/utils/security.py`
7. `backend/app/utils/dependencies.py`
8. `backend/app/routes/auth.py`
9. `backend/app/services/ai_service.py`
10. `backend/app/routes/ideas.py`
11. `backend/app/services/export_service.py`
12. `frontend/lib/api.ts`
13. `frontend/lib/auth.ts`
14. `frontend/app/layout.tsx`
15. `frontend/app/dashboard/new-analysis/page.tsx`
16. `frontend/app/dashboard/analyses/[id]/page.tsx`

This order follows the path from application boot, to persistence, to auth, to AI analysis, to frontend usage.

## 22. Final Summary

Launch Mind is a practical AI-assisted startup planning platform. The backend owns persistence, authentication, AI generation, and exports. The frontend owns the user journey: public pages, authentication, dashboard navigation, creation forms, artifact detail pages, and downloads.

The most important architectural idea is that a saved `Analysis` is the hub. Almost every advanced feature starts from an analysis: reports, pitch decks, SWOT analyses, competitor analyses, MVP plans, and exports. Because of that, the quality and reliability of `ai_service.py`, `ideas.py`, `AnalysisResponse`, and ownership filtering directly affect the rest of the application.

The codebase is understandable and organized, with a few production-hardening opportunities around auth strictness, migrations, CORS, async/background AI work, and tests.
