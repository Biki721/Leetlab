# Product Requirements Document (PRD) – LeetLab

## 1. Objective

Build a coding practice platform like leetCode where users can register, solve problems, upload custom DSA sheets, and participate in coding contest to prepare for interviews and competitive programming

## 2. Scope

### In Scope (MVP)

- Auth (email/password + OAuth Google/GitHub), email verification, password reset
- Problem browsing (list, search, filter by difficulty/tags) and SEO friendly detail pages
- Problem detail with statement, constraints, examples; Monaco editor with Python and biolerplate
- Submissions with server-side judge for Python returning verdicts (AC, WA, TLE, RE, CE), runtime, memory
- Submissions history per user with filtering and details
- Admin authoring: CRUD for problems, tags, and test cases; mark sample vs hidden; preview run
- Basic discussions/solutions (Optional if time permits)

### Out‑of‑scope (MVP):

- Contests, leaderboards, badges/gamification, multiple languages beyond Python, plagiarism detection, team/org features, mobile apps

## 3. Features and Requirements:

### P1 - Must-have

#### 3.1 Browsing and Search

- Users can view a paginated list of problems with title, difficulty tags, and solve status (if logged in)
- Users can filter by difficulty( Easy, Medium, Hard) and tags (Array, Strings, DP, Graphs, etc); search by title
- URL reflects filter/search state for shareable views.
- Acceptance criteria: Pagination works; filters combine; URL reflects query for shareable state.

#### 3.2 Problem Detail and Editor

- Users can read statement, constraints, examples; select language (Python for MVP) and edit the code in browser
- Users can run sample tests locally (client or safe server call) for quick feedback; not used for final verdict
- Monaco editor with Python, syntax highlighting, dark/light themes, boilerplate, and stdin/stdout panel.
- Acceptance criteria: Code editor supports syntax highlight, input panel, and displays sample output and errors clearly

#### 3.3 Code Submission and Verdict

- Users submit code to be run against hidden tests in an isolated sandbox; system returns verdict and resource usage
- Asynchronous flow: API returns submission_id; client polls status every 1-2s until compilation; shows final verdict and per-test summary
- Acceptance criteria: Valid verdicts (AC/WA/TLE/RE/CE), runtime/memory reported; submission_id retrievable, robust error messaging

#### 3.4 Submissions History

- Users can view their past submissions with language, verdict, runtime, memory, and timestamp; can open details.
- Retain Source and outputs within set limits
- Acceptance criteria: Sort/filter by verdict/date/problem; details page renders safely with code formatting.

#### 3.5 Admin Authoring

- Admin users can create/edit problems, tags, and tests; mark tests as sample vs. hidden; preview run before publishing.
- Acceptance criteria: Validation for unique slugs, required fields, and test IO size limits; draft/publish states.

#### 3.6 Custom DSA Sheet Upload

- Users can upload and manage their own problem sets (CSV/JSON or simple form).
- Uploaded sheets integrate with the problem discovery flow (tagged as “Custom”).
- Users can track progress on their personal sheet separately from the global curated problems.
- Acceptance criteria: Upload supports standard format (problem title, statement URL, tags). System validates file; errors shown clearly. Sheets are private to the user by default.

### P2 - Nice-to-have

#### 3.1 Browsing and Search (enhancements)

- Advanced search (e.g., search in statements), saved filters, recently viewed.
- Acceptance criteria: Advanced search returns relevant results within reasonable latency; saved filters persist per user.

#### 3.2 Problem Detail and Editor (enhancements)

- Additional editor conveniences: keyboard shortcuts, code templates/snippets, theming beyond basic dark/light.
- Acceptance criteria: Shortcuts discoverable; templates selectable per language/topic.

#### 3.3 Code Submission and Verdict (enhancements)

- Real-time status via SSE/WebSocket (replace polling) with step updates (queued → running → completed).
- Acceptance criteria: Live updates push within 1s of state change under normal load.

#### 3.4 Submissions History (enhancements)

- Re-run past submissions on updated tests (admin-triggered) with clear labeling of re-run results versus original.
- Acceptance criteria: Re-run results do not overwrite original; UI differentiates runs and timestamps.

#### 3.5 Admin Authoring (enhancements)

- Bulk import/export of problems and tests; versioning for problem statements and tests with change logs.
- Acceptance criteria: Version history view; restore to prior version without data loss.

## 4. User Stories or Use Cases

### P1

- As a learner, I can filter problems by difficulty/tags to target practice.
- As a learner, I can run samples to quickly validate basic logic.
- As a learner, I can submit my code and receive a clear verdict with runtime/memory.
- As a learner, I can review my submission history to learn from past attempts.
- As an admin, I can create problems with sample and hidden tests and preview them before publishing.
- As a learner, I can upload my own DSA sheet and practice from it, with progress tracked separately.

### P2

- As a learner, I can solve in C++ or JS in addition to Python.
- As a learner, I see live submission status without manual refresh.
- As a learner, I can read and share editorial write ups to learn standard approaches.

## Technical Requirement

### Architecture

- Frontend: Next.js + TypeScript + TanStack Query + Zustand + Tailwind/shadcn
- Backend: Express (TypeScript) with OpenAPI; services for Auth, Problems, Submissions, Judge, Admin.
- Database: Postgres (users, problems, tags, problem_tags, test_cases, languages, submissions, discussions).
- Queue/Cache: Redis (job queue, rate limits, caching).
- Storage/CDN: Object storage for large blobs; CDN for static assets.
- Execution/Judge: One job→one container; pinned language image; cgroups/seccomp; read‑only root; no network.
- Observability: Structured logs, tracing/IDs, metrics, error tracking; backups and restore drill.

### Performance Targets (P1)

- p95 page load <= 1.5s; median queue wait < 5s; per‑run time limit≤2s (Python baseline).
- p95 judge completion≤8s under light load (10 concurrent users).

### Security & Compliance (P1)

- Minimal PII; hashed passwords; secret management; CSRF/CORS; dependency scanning.
- Input and output size limits; stdout/compile log truncation; code size limits.

## 5. Design Requirement

- Clean, minimal "LeetLab" branding; two‑pane problem page (statement left, editor right); responsive layout.
- Accessibility: Keyboard navigable; high contrast; ARIA roles; editor font scaling; WCAG 2.1 AA for core flows.
- Content style: Markdown statements with consistent headings; code blocks for examples; highlighted constraints.
- States: Skeleton loaders; clear empty/error states; retry actions.
- SEO: Descriptive meta, canonical tags, sitemap for public problems.

## 6. Success Metrics

### Product

- Activation: % new users with 1 AC within 24h (target >= 40% early).
- Engagement: Median submissions/user/week; AC rate by difficulty; time‑to‑first‑AC.

### Quality

- Verdict accuracy >= 99%; flaky test incidents/week <= 1; sandbox error rate < 0.5%.

### System

- Median queue wait < 5s; p95 queue wait <= 10s at 10 concurrent users.
- Runner error < 1%; DLQ < 0.1% over 24h soak; uptime aligned with solo‑project constraints.

### Content

- 30 published problems; >=3 tags/problem; 10 editorials (P2).

## 7. Timeline

### Target: 10 days (solo)

- Day 1: Finalize PRD; ERD; OpenAPI; repositories; auth skeleton; seed 10 problems.
- Day 2: Problems CRUD; list/detail (SSR+SEO); tags/filters; initial styling.
- Day 3: Monaco editor; sample run UI; refine problem detail UX.
- Day 4: Queue + worker; Python runner image; submission lifecycle (enqueue→status→result).
- Day 5: Hidden tests; verdicts AC/WA/TLE/RE/CE; submissions history; polling updates.
- Day 6: Sandbox hardening (cgroups/seccomp/caps); rate limits; dashboards; +10–15 problems.
- Day 7: Performance pass (cache, pagination, warm runners if time); backups; admin UX polish.
- Day 8: Release readiness check vs. P1; publish 30 problems; private beta and resume/demo assets.
- Days 9–10 (optional P2): Add JS or C++ runner; discussions/editorials; live status via SSE/WebSocket.

### Milestone gates

- Alpha (end Day 3): Browse/detail/editor + sample runs.
- Beta (end Day 6–8): Stable Python judge + history, 30 problems, monitoring and backups.
- GA (optional): 1 additional language and discussions/editorials behind flags.

LINK: Architetcture and Project Planning: https://www.tldraw.com/f/B9mBKe9S1K03058fEBus6?d=v-1934.-1753.8094.4461.MgdhDO6oPqvNESKaVnuYL
