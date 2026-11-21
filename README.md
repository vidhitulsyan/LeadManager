# Lead Manager

A small full-stack app for capturing and tracking sales leads. A user can add, list, edit, delete, search and filter leads, with validation on both the frontend and the backend.

## Features

- Add a lead with name, email, phone, company, source (dropdown) and status (New / Contacted / Qualified / Lost)
- List all leads in a table with colour-coded status badges
- Edit a lead, including its status
- Delete a lead after a confirmation dialog
- Search by name and filter by status (done server-side)
- Validation on the client (inline field errors) and on the server (400 with per-field messages)
- Clear error, loading and empty states, including when the API is unreachable

## Running locally

**Prerequisites:** Node.js 22 or newer and npm. No database server is needed, because SQLite stores everything in a local file.

Open two terminals from the repository root:

```bash
# Terminal 1 – API on http://localhost:4000
cd backend
npm install
npm run dev
```

```bash
# Terminal 2 – UI on http://localhost:5173
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173.

The database file (`backend/data/leads.db`) and its table are created automatically on first start.

### Configuration

The backend reads an optional `backend/.env` file (copy `backend/.env.example`):

| Variable  | Default         | Description                    |
|-----------|-----------------|--------------------------------|
| `PORT`    | `4000`          | Port the API listens on        |
| `DB_FILE` | `data/leads.db` | Path to the SQLite database file |

In development, the Vite dev server forwards `/api/*` to `http://localhost:4000`, so the frontend needs no configuration and the API needs no CORS setup.

## Tech stack

| Layer      | Choice                         | Why |
|------------|--------------------------------|-----|
| Frontend   | React 19 + Vite, plain CSS     | Fast setup and hot reload. Plain CSS keeps dependencies at zero for a UI this small. |
| Backend    | Node.js + Express 5            | A minimal, well-known framework. Express 5 forwards thrown errors to the error handler automatically. |
| Database   | SQLite via `better-sqlite3`    | No database server to install, so reviewers can run the app with just `npm install`. The schema is portable to PostgreSQL. |
| Validation | `zod` (backend)                | One declarative schema that both validates and normalises input (trimming, empty → `null`, defaults). |

## Project structure

```
backend/
  src/
    server.js                  entry point – opens the DB, starts the HTTP server
    app.js                     Express app – middleware and routes
    constants.js               allowed statuses and sources
    db/                        connection and schema (table, CHECK constraints, indexes)
    repositories/              all SQL for leads (parameterised queries)
    routes/                    REST handlers for /api/leads
    validators/                zod schemas for body, query and id
    middleware/errorHandler.js 404 and central error → JSON responses
frontend/
  src/
    api/leads.js               fetch wrapper and API calls, with friendly network errors
    hooks/                     useLeads (fetching), useDebouncedValue (search)
    components/                LeadTable, LeadFilters, LeadForm, Modal, ConfirmDialog, StatusBadge
    utils/validateLead.js      client-side validation (mirrors the backend rules)
```

## API

Base URL: `/api`

| Method | Endpoint          | Description                                                   | Success |
|--------|-------------------|---------------------------------------------------------------|---------|
| GET    | `/health`         | Health check                                                  | 200 |
| GET    | `/leads`          | List leads, newest first. Optional `?search=` (name) and `?status=` | 200 |
| GET    | `/leads/:id`      | Get one lead                                                  | 200 |
| POST   | `/leads`          | Create a lead                                                 | 201 |
| PUT    | `/leads/:id`      | Replace a lead (all fields)                                   | 200 |
| DELETE | `/leads/:id`      | Delete a lead                                                 | 204 |

Request body for POST and PUT:

```json
{
  "name": "Alice Smith",
  "email": "alice@acme.com",
  "phone": "+91 98765 43210",
  "company": "Acme",
  "source": "Website",
  "status": "New"
}
```

- `name`, `email` and `source` are required.
- `phone` and `company` are optional.
- `status` defaults to `New`.

Errors are always JSON:

```json
{ "error": "Validation failed", "details": { "email": ["Enter a valid email address"] } }
```

| Status | When |
|--------|------|
| 400 | Invalid body, query or id, or malformed JSON |
| 404 | Unknown lead or route |
| 500 | Unexpected error (logged on the server; no internals leaked to the client) |

## Database design

There is a single `leads` table:

| Column       | Type    | Notes |
|--------------|---------|-------|
| `id`         | INTEGER | Primary key, auto-increment |
| `name`       | TEXT    | NOT NULL |
| `email`      | TEXT    | NOT NULL |
| `phone`      | TEXT    | Nullable |
| `company`    | TEXT    | Nullable |
| `source`     | TEXT    | NOT NULL, `CHECK` against the allowed sources |
| `status`     | TEXT    | NOT NULL, default `New`, `CHECK` against the allowed statuses |
| `created_at` | TEXT    | UTC timestamp, set by the DB |
| `updated_at` | TEXT    | UTC timestamp, refreshed on update |

- **Indexes:**
  - `status` speeds up the status filter.
  - `name COLLATE NOCASE` supports exact-name and prefix lookups. The current substring search (`LIKE '%term%'`) can't use an index; at larger scale I'd switch to SQLite FTS5 or PostgreSQL trigram indexes.
- **Validation in the database too:** the `CHECK` constraints protect data integrity even if something bypasses the API validation.

## Assumptions

- **Single user.** There's no authentication, so everyone sees the same leads.
- **Fixed sources.** The source options are Website, Referral, LinkedIn, Cold Call, Event and Other.
- **Duplicate emails are allowed.** One contact can come in more than once, for example from different campaigns.
- **Search matches names only,** as a case-insensitive partial match, as the brief asks. It combines with the status filter.
- **`PUT` replaces the whole lead.** The edit form always sends every field.

## What I cut (bonus items) and why

None of the bonus items were built. The brief favours a small, solid core over wider scope:

- authentication
- pagination and sorting
- a dashboard
- deployment
- automated API tests

## What I would improve with more time

- **API tests** with Jest/Vitest and Supertest. `app.js` is already separate from `server.js`, and `DB_FILE=:memory:` gives each test run its own database.
- **Pagination and sorting** on the server (`?page=&limit=&sort=`) once the list grows.
- **Shared validation.** Move the zod schema into a shared package so the frontend and backend rules can't drift apart. Today they are mirrored by hand.
- **Authentication** with a `users` table and a `user_id` foreign key on `leads`, so each user only sees their own leads.
- **Feedback and accessibility:** toast notifications after save and delete, and focus trapping in modals.
- **Deployment:** a single command to start both apps, and a deployment such as Render for the API and Vercel for the UI.

## Notes

**What I'm proud of:**
- The backend stays thin and layered: routes → validation → repository.
- All errors flow through one handler, so the API always answers with consistent JSON.

**What was tricky:**
- Keeping the search responsive without racing requests. Typing is debounced, and responses from outdated requests are ignored.
