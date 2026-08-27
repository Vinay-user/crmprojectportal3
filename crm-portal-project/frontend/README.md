# CRM Portal — Frontend (React + Vite)

A React 19 / Vite single-page app for the CRM Portal, talking to the
Spring Boot backend over REST. This README documents the frontend as it
actually exists in this codebase (see `backend/README.md` and
`database/README.md` for the other two pieces).

> Note: this project previously only had one combined, aspirational
> project-level README describing the whole intended system. This file
> is a new, frontend-only README that documents what's actually in
> `frontend/` today — it replaces relying on that combined doc for
> frontend setup.

## 1. Prerequisites

* Node.js 18+ and npm
* The backend running on `http://localhost:8080` (see `backend/README.md`)

## 2. Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on **http://localhost:5173** (see `vite.config.js`).

Available scripts (`package.json`):

```bash
npm run dev       # start the Vite dev server
npm run build     # production build
npm run preview   # preview the production build locally
```

## 3. Configuration

`src/config/config.js` is the single source of frontend config:

```js
apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
tokenKey: "crm_access_token",
userKey: "crm_user",
pagination: { defaultPageSize: 10, pageSizes: [10, 20, 50, 100] }
```

To point at a different backend, create `frontend/.env` with:

```
VITE_API_URL=http://localhost:8080/api
```

## 4. How auth currently works (matches the backend's simple-auth stage)

* `src/services/authService.js` calls `POST /api/auth/login`, and stores
  whatever `token` and `user` come back in `localStorage` under
  `crm_access_token` / `crm_user` (see `src/context/AuthContext.jsx`).
* `src/services/api.js` is an Axios instance whose request interceptor
  attaches `Authorization: Bearer <token>` from `localStorage` to every
  request automatically.
* The backend's token right now is a **plain opaque session id**, not a
  JWT (see `backend/README.md` Section 6) — the frontend doesn't need to
  know or care about that distinction; it just stores and replays
  whatever string the backend gives it. When the backend switches to real
  JWTs later, **nothing here needs to change**.
* On a `401` response, the Axios interceptor clears local storage and
  redirects to `/login` (see `api.js`).

**Sample logins** (from `database/seed.sql` — see `backend/README.md`
Section 7 for the full table):

| Email | Password | Role |
|---|---|---|
| `admin@crmportal.com` | `Password123!` | ADMIN |
| `john.doe@crmportal.com` | `Password123!` | MANAGER |
| `sarah.adams@crmportal.com` | `Password123!` | SALES |
| `david.kumar@crmportal.com` | `Password123!` | TRAINER |

## 5. Project structure

```
frontend/src/
├── main.jsx, App.jsx, index.css
├── config/config.js          Single source of frontend config (API URL, storage keys, pagination)
├── context/AuthContext.jsx    Holds the logged-in user + token, exposes login()/logout()
├── hooks/                     useFetch.js, usePagination.js, ...
├── services/                  One file per REST resource - the actual API contract:
│   api.js                       Axios instance + interceptors (auth header, 401 handling)
│   authService.js               login, register, me, logout
│   leadService.js, contactService.js, companyService.js, dealService.js
│   activityService.js, taskService.js, calendarService.js
│   notificationService.js, reportService.js, userService.js, settingsService.js
├── pages/                     One folder per feature area (routed):
│   auth, dashboard, leads, contacts, companies, deals, activities,
│   tasks, calendar, communications, notifications, reports, users,
│   teams, settings, courses, batches, enrollments
└── utils/constants.js          ROLES (incl. TRAINER), DEAL_STAGES,
                                 LEAD_STATUSES, TASK_STATUSES, PRIORITIES,
                                 BATCH_MODES, BATCH_STATUSES,
                                 ENROLLMENT_STATUSES, PAYMENT_STATUSES,
                                 STORAGE_KEYS - must stay in sync with the
                                 backend's Java enums (com.crm.portal.enums.*)
```

## 5a. IT training module (Courses, Batches, Enrollments)

Added for an org that runs IT training and sells to IT companies as
clients — see `backend/README.md` Section 8 for the full data model.

* `pages/courses/Courses.jsx` + `services/courseService.js` — course
  catalog (name, code, category, duration, fee).
* `pages/batches/Batches.jsx` + `services/batchService.js` — scheduled
  runs of a course, with a trainer, mode, and status.
* `pages/enrollments/Enrollments.jsx` + `services/enrollmentService.js`
  — trainees enrolled per batch, with payment status and (once
  completed) a generated certificate number.

All three follow the exact same list+search pattern as `Leads.jsx` /
`leadService.js` — same `DataTable`, same `response.data?.content ||
response.data || []` handling, same "Add X" button placeholder — so
they're consistent with the rest of the app and easy to extend the same
way once create/edit forms are added.

A trainer is just a `User` with role `TRAINER` — no separate concept on
the frontend; `ROLES.TRAINER` is available in `utils/constants.js` if you
need to branch UI on it (e.g. a trainer-only "My Batches" view later).

## 6. Talking to the backend

Every `services/*.js` file maps 1:1 to a backend controller — see
`backend/README.md` Section 5 for the full endpoint list and response
shape. List endpoints return:

```json
{ "content": [...], "page": 0, "size": 10, "totalElements": 42, "totalPages": 5, "last": false }
```

which is why list pages read `response.data?.content || response.data || []`.

## 7. Scope / known gaps

* Several pages under `src/pages/` (e.g. `dashboard`, `reports`,
  `teams`, `settings`, parts of `communications`) are still
  placeholder/static UI — they render but aren't wired to their
  matching service yet. The services themselves (`reportService.js`,
  etc.) are fully implemented and working against the backend already;
  wiring the pages to call them is the remaining frontend work.
* `package.json` currently lists `bcrypt` as a frontend dependency.
  That's leftover/unused — password hashing (if added later) belongs on
  the backend, not in the browser bundle. Safe to remove with
  `npm uninstall bcrypt` unless something added a real use for it.
* No automated tests yet.
