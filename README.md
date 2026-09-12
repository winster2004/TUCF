# TUCF

TUCF is a career companion for discovering jobs, tracking applications, improving resumes, and preparing for interviews. It combines a React/Vite client with a NestJS API, PostgreSQL persistence, document processing, and AI-assisted career workflows.

## 🎥 Demo

[▶ Watch Demo Video](https://chatgpt.com/c/YOUR_DEMO_VIDEO_LINK)

[🌐 Live Demo](https://chatgpt.com/c/YOUR_LIVE_APP_URL)

The demo shows the main workflow and features. No public demo URL or UI screenshot is currently stored in the repository.

## ✨ Key Features

- Job search with query, location, pagination, and Adzuna integration.
- Save jobs and track applied jobs per user.
- Resume builder with PDF export through the local Express utility server.
- Resume upload and ATS analysis against a job description.
- Portfolio generation and resume upload workflows.
- Roadmap, cover-letter, interview-prep, and AI-assistant experiences in the React client.
- Starter and Pro subscription roles with expiry-aware access guards.

## 🏗️ Architecture

The repository contains two application layers. The NestJS service owns authenticated persistence and subscription-aware API modules. The frontend also uses a small Express server for PDF, ATS, portfolio, and local job utility routes, while selected AI workflows call Groq from the browser using a user-provided key.

```mermaid
flowchart LR
    Browser[React + Vite client] -->|Auth, jobs, subscriptions| Nest[NestJS API :3000]
    Browser -->|/api and local utility routes| Express[Express utility server :5000]
    Browser -->|AI prompts with local key| Groq[Groq API]
    Nest --> Prisma[Prisma ORM]
    Prisma --> Postgres[(PostgreSQL)]
    Nest --> Adzuna[Adzuna Jobs API]
    Express --> Files[In-memory files and job state]
```

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, React Router, Tailwind CSS, Framer Motion, Lucide React
- **Backend:** NestJS 11, TypeScript, Express platform, Axios
- **Database:** PostgreSQL with Prisma 7
- **Auth:** Passport JWT, bcrypt, bearer tokens, route guards
- **AI/APIs:** Adzuna Jobs API, Groq Chat Completions API, `@huggingface/transformers`
- **Tools:** npm, Jest, Supertest, Swagger/OpenAPI, ESLint, Prettier, Multer, pdf-parse, PDFKit

## 🚀 How It Works

1. A user opens the Vite client and explores the landing page, authentication screens, and career modules.
2. Job searches query the local API path and can retrieve normalized job results from Adzuna.
3. Authenticated users can save jobs and record applications, which are stored with Prisma.
4. Users can upload resumes, build a resume, generate a portfolio, and request ATS analysis.
5. Premium-only modules are checked by JWT and subscription guards before access is granted.
6. AI-powered client workflows use Groq when a user supplies an API key in the app settings.

## 📸 Screenshots

No product screenshots are currently included. Add verified captures here when available.

## 📁 Project Structure

```text
TUCF/
├── TUCF-Backend-main/
│   ├── src/
│   │   ├── auth/              # Registration, login, JWT strategy and guard
│   │   ├── jobs/              # Search, saved jobs and applications
│   │   ├── subscription/      # Starter/Pro roles and status
│   │   ├── ats/               # Resume analysis endpoint
│   │   ├── portfolio/         # Portfolio and resume workflows
│   │   ├── resume/            # Protected resume export endpoint
│   │   ├── roadmap/           # Roadmap generation endpoint
│   │   └── dashboard/         # Protected dashboard endpoint
│   ├── prisma/schema.prisma   # User, SavedJob and AppliedJob models
│   └── package.json
└── Tucf-Frontend-main/
    ├── src/                   # React pages, contexts, API clients and styles
    ├── server/                # Express utility server and document workflows
    ├── vite.config.ts         # Client port and local proxy rules
    └── package.json
```

## ⚙️ Local Setup

Prerequisites: Node.js/npm and a PostgreSQL database.

### Backend

```bash
cd TUCF-Backend-main
npm install
```

Create `TUCF-Backend-main/.env` with placeholders replaced by local values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-local-secret"
ADZUNA_APP_ID="replace-with-adzuna-app-id"
ADZUNA_API_KEY="replace-with-adzuna-api-key"
PORT=3000
```

Apply the checked-in migrations and start the API:

```bash
npx prisma migrate deploy
npm run start:dev
```

The Nest API listens on `http://localhost:3000`; Swagger is available at `http://localhost:3000/api`.

### Frontend and utility server

In a second terminal:

```bash
cd Tucf-Frontend-main
npm install
npm run dev
```

The Vite client runs on `http://localhost:5173`. To run its Express utility server separately:

```bash
npm run server
```

That server listens on port `5000`. `npm run dev:full` starts the Vite client and utility server together, but the Nest API still needs to be started separately.

## 🔌 API Endpoints

### NestJS API (`:3000`)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a user |
| `POST` | `/auth/login` | Authenticate and return a JWT |
| `GET` | `/jobs/search` | Search Adzuna jobs with `q`, `location`, and `page` |
| `POST` | `/jobs/save` | Save a job for the authenticated user |
| `GET` | `/jobs/saved` | List saved jobs |
| `POST` | `/jobs/apply` | Record a job application |
| `GET` | `/jobs/applied` | List applied jobs |
| `POST` | `/ats/analyze` | Analyze an uploaded resume against a job description |
| `POST` | `/portfolio/generate` | Generate portfolio content |
| `POST` | `/portfolio/resume` | Upload a portfolio resume |
| `POST` | `/resume/export` | Export a resume for an active paid plan |
| `POST` | `/roadmap/generate` | Generate a roadmap for an active subscription |
| `GET` | `/dashboard` | Return protected dashboard data |
| `POST` | `/subscription/upgrade` | Upgrade to a validated plan |
| `POST` | `/subscription/upgrade/starter` | Upgrade to Starter |
| `POST` | `/subscription/upgrade/pro` | Upgrade to Pro |
| `GET` | `/subscription/status` | Read subscription status |

Protected routes require an `Authorization: Bearer <token>` header. Subscription-protected routes additionally require an active Starter or Pro role.

### Express utility server (`:5000`)

The frontend utility server also exposes `/api/health`, `/api/resume/pdf`, `/api/ats/parse`, `/api/ats/score`, `/api/portfolio/resume`, `/api/portfolio/resume/:id`, and `/api/portfolio/generate`, plus local `/jobs/*` and `/subscription/*` routes used by the client proxy.

## 🔐 Environment Variables

| Variable | Location | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Backend | PostgreSQL connection string for Prisma |
| `JWT_SECRET` | Backend | Signs and verifies JWTs |
| `ADZUNA_APP_ID` | Backend | Adzuna application identifier |
| `ADZUNA_API_KEY` | Backend | Adzuna API credential |
| `PORT` | Backend or utility server | Optional HTTP port override; defaults to `3000` for Nest and `5000` for Express |
| `VITE_API_USE_CREDENTIALS` | Frontend | Opts the Axios client into browser credentials when set to `true` |
| `VITE_API_BASE_URL` / `VITE_API_URL` | Frontend | Optional subscription API base URL override |
| `VITE_GROQ_MODEL` | Frontend | Optional preferred Groq model |

The frontend stores a user-provided Groq API key in browser local storage; no key is included in this README.

## 🧠 Engineering Highlights

- Modular NestJS REST architecture separates authentication, jobs, subscriptions, ATS, portfolio, resume, roadmap, and dashboard responsibilities.
- Prisma migrations model users, subscription windows, saved jobs, and applied jobs in PostgreSQL.
- JWT bearer authentication is backed by Passport and a database-backed user lookup; passwords are hashed with bcrypt.
- Subscription and JWT guards enforce access to premium workflows and automatically treat expired subscriptions as free.
- Adzuna requests use normalized response mapping, a ten-second timeout, credential checks, rate-limit handling, and a no-location fallback for empty results.
- Resume workflows use Multer memory uploads, `pdf-parse` for extraction, and PDFKit for generated PDF output.
- Jest and Supertest configuration is included for backend unit and end-to-end testing.

## 🚀 Deployment

**Current status: not deployed yet.**

Planned options include:

- Vercel for the frontend
- Railway for the backend and PostgreSQL where suitable
- AWS as a future cloud deployment option

## 🔮 Future Improvements

- Complete production deployment with managed secrets, HTTPS, and environment-specific CORS.
- Replace local or in-memory utility state with durable, user-scoped persistence.
- Connect dashboard metrics to persisted application and portfolio activity instead of placeholder values.
- Move browser-direct AI requests behind a protected backend service with rate limiting and usage controls.
- Add broader integration coverage for authenticated, subscription, upload, and third-party API failure paths.

## 👨‍💻 Author

**Winster Mano**

- LinkedIn: `YOUR_LINKEDIN_URL`
- GitHub: `YOUR_GITHUB_URL`
- Portfolio: `YOUR_PORTFOLIO_URL`

## ⭐ Closing

Explore the repository to see how TUCF combines a modern React client with a modular NestJS API and practical career tooling.
