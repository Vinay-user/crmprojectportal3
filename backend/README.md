# CRM Portal — Backend (Spring Boot + MySQL/XAMPP)

Spring Boot 3.2 / Java 17 / Maven backend for the CRM Portal React frontend,
built against:

* the exact MySQL schema in `database/schema.sql` (16 tables, no
  roles/permissions/tags tables — see "Scope" below)
* the exact API contract already used by `frontend/src/services/*.js`

## 1. Prerequisites

* JDK 17+
* Maven 3.9+ (or use an IDE with bundled Maven)
* XAMPP with MySQL running, and the `crm_portal` database created and
  loaded from `database/schema.sql` → `indexes.sql` → `seed.sql`
  (see `database/README.md`)

## 2. Configure the database connection

`src/main/resources/application.properties` is already set up for a
default local XAMPP install:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crm_portal?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

XAMPP's MySQL `root` user has **no password** by default, so this should
work unmodified. If you changed the MySQL root password, update
`spring.datasource.password` accordingly.

There's no secret/key to configure at this stage — see Section 6 for how
auth currently works (plain passwords, in-memory tokens) and what to add
when you're ready for hashing/JWT.

## 3. Run it

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The API starts on **http://localhost:8080**, matching
`frontend/src/config/config.js` (`VITE_API_URL=http://localhost:8080/api`).

Hibernate is set to `ddl-auto=none` — it maps onto the tables created by
`database/schema.sql` rather than generating its own schema, so run the
database scripts first.

## 4. First login

Passwords are currently stored **as plain text** (see Section 6), so the
seed data (`database/seed.sql`) uses a real, usable password. All five
seeded accounts (`admin@crmportal.com`, `john.doe@crmportal.com`, etc.)
log in with:

```
Password123!
```

or use `POST /api/auth/register` to create a fresh account (defaults to
role `USER`), then update its role directly in the `users` table if you
need `ADMIN` for testing `/api/users`.

**3 sample logins to try** (see Section 7 for the full table with roles):

| Email | Password | Role |
|---|---|---|
| `admin@crmportal.com` | `Password123!` | ADMIN |
| `john.doe@crmportal.com` | `Password123!` | MANAGER |
| `sarah.adams@crmportal.com` | `Password123!` | SALES |

## 5. API surface

Every endpoint below is implemented and matches what
`frontend/src/services/*.js` already calls:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/logout

GET    /api/leads                GET/PUT/DELETE /api/leads/{id}
POST   /api/leads                POST /api/leads/{id}/convert

GET    /api/contacts             GET/PUT/DELETE /api/contacts/{id}
POST   /api/contacts

GET    /api/companies            GET/PUT/DELETE /api/companies/{id}
POST   /api/companies

GET    /api/deals                GET/PUT/DELETE /api/deals/{id}
POST   /api/deals                PATCH /api/deals/{id}/stage

GET    /api/activities           GET/PUT/DELETE /api/activities/{id}
POST   /api/activities

GET    /api/tasks                GET/PUT/DELETE /api/tasks/{id}
POST   /api/tasks                PATCH /api/tasks/{id}/complete

GET    /api/calendar/events      GET/PUT/DELETE /api/calendar/events/{id}
POST   /api/calendar/events

GET    /api/notifications        PATCH /api/notifications/{id}/read
DELETE /api/notifications/{id}   PATCH /api/notifications/read-all

GET    /api/reports/sales
GET    /api/reports/revenue

GET    /api/users                GET/PUT/DELETE /api/users/{id}   (ADMIN/MANAGER only)
POST   /api/users

GET    /api/settings
PUT    /api/settings

GET    /api/courses              GET/PUT/DELETE /api/courses/{id}
POST   /api/courses

GET    /api/batches              GET/PUT/DELETE /api/batches/{id}
POST   /api/batches              PATCH /api/batches/{id}/status

GET    /api/enrollments          GET/PUT/DELETE /api/enrollments/{id}
POST   /api/enrollments          PATCH /api/enrollments/{id}/complete
                                  PATCH /api/enrollments/{id}/payment-status
```

List endpoints accept `search`, plus entity-specific filters (`status`,
`source`, `stage`, `priority`, `owner`, `companyId`, etc.), and pagination
params `page`, `size`, `sort`, `direction` — matching
`usePagination.js` / `config.pagination`. They return:

```json
{
  "content": [ ... ],
  "page": 0,
  "size": 10,
  "totalElements": 42,
  "totalPages": 5,
  "last": false
}
```

`response.data?.content || response.data || []` (used throughout the
React list pages) resolves correctly against this shape.

Errors always come back as:

```json
{ "success": false, "message": "...", "code": "...", "timestamp": "..." }
```

## 6. Auth & RBAC (current: simple, temporary)

**By design, this stage has no password hashing and no JWT.** Passwords
are compared as plain text, and "login" issues a random opaque token kept
in server memory. This is intentional for where the project is right now
— see the note at the top of `pom.xml` and the Javadoc on
`security/TokenService.java` for how to upgrade it later.

How it works today:

* `POST /api/auth/login` checks `User#password` with a plain
  `.equals(...)` against `users.password` in MySQL, and, on success, asks
  `TokenService` for a token.
* `TokenService` (`security/TokenService.java`) is an interface with one
  implementation right now, `InMemoryTokenService` — a `ConcurrentHashMap`
  of random UUID tokens to user id + expiry (`crm.auth.token-expiration-ms`,
  default 24h). No signing, no verification — just a lookup.
* The frontend still sends `Authorization: Bearer <token>` exactly as
  before (see `frontend/src/services/api.js`), so **no frontend changes
  are needed**. Only the meaning of the token changed (opaque id vs. JWT).
* `security/AuthFilter.java` is a single plain Servlet filter (not Spring
  Security) that resolves the token, loads the user, and enforces the
  same access rules the app has always had: `/api/auth/**` is public,
  `/api/users/**` and any `DELETE /api/**` require `ADMIN`/`MANAGER`,
  everything else under `/api/**` just needs a valid token.
* `service/CurrentUserService.java` is the one place the rest of the app
  (audit logging, "who owns this record", etc.) asks "who is the current
  user" — it reads a thread-local set by `AuthFilter`, not the filter or
  token mechanism directly.
* An `audit_logs` entry is still written for login, register, and every
  create/update/delete/stage-change/complete action, unchanged.

**Adding password hashing and JWT later** should only touch the
`security` package and two call sites, not the rest of the app:

1. Add `spring-boot-starter-security` and a hashing library (BCrypt/Argon2)
   back to `pom.xml` (see the comment there).
2. In `AuthService.login()`/`register()`, replace the plain `.equals(...)`
   check and plain `.password(...)` assignment with an encoder's
   `matches(...)` / `.encode(...)`.
3. Write a new `TokenService` implementation (e.g. `JwtTokenService`) and
   let Spring inject it in place of `InMemoryTokenService`.
4. Optionally replace `AuthFilter`'s hand-rolled rules with a Spring
   Security `SecurityFilterChain` for richer expression-based RBAC.

No changes needed in `LeadService`, `DealService`, `UserController`, etc.
— they all depend on `CurrentUserService`, not on how auth is implemented.

## 7. Sample logins (seeded data)

All six accounts from `database/seed.sql` share the same password
(`Password123!`) so you can log in as any of them immediately after
loading the seed data — useful for exercising RBAC (`/api/users/**` and
`DELETE` only work for ADMIN/MANAGER):

| # | Email | Password | Role | Team |
|---|---|---|---|---|
| 1 | `admin@crmportal.com` | `Password123!` | ADMIN | — |
| 2 | `john.doe@crmportal.com` | `Password123!` | MANAGER | Sales - East |
| 3 | `sarah.adams@crmportal.com` | `Password123!` | SALES | Sales - East |
| 4 | `mike.king@crmportal.com` | `Password123!` | SALES | Sales - West |
| 5 | `rachel.brooks@crmportal.com` | `Password123!` | USER | Customer Success |
| 6 | `david.kumar@crmportal.com` | `Password123!` | TRAINER | — |

Try `POST /api/auth/login` with `{ "email": "admin@crmportal.com", "password": "Password123!" }`
— the response looks like:

```json
{
  "token": "b3f1c9a0-...-random-uuid",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "fullName": "Admin User",
    "email": "admin@crmportal.com",
    "role": "ADMIN",
    "isActive": true,
    "permissions": [],
    ...
  }
}
```

Send that `token` back as `Authorization: Bearer <token>` on subsequent
requests (the frontend already does this automatically).

## 8. IT training module (Courses, Batches, Enrollments)

Added on top of the base CRM for an org that runs IT training and sells
to IT companies as clients:

* **`Course`** — the catalog (`AWS Cloud Practitioner`, `Full Stack Java
  Development`, etc.) — name, code, category, duration, fee.
* **`Batch`** — one scheduled run of a course: dates, mode
  (`ONLINE`/`OFFLINE`/`HYBRID`), status (`UPCOMING`/`ONGOING`/`COMPLETED`/
  `CANCELLED`), capacity, and an assigned trainer. A trainer is just a
  `User` with role `TRAINER` (added to the existing role enum) — no
  separate trainer table.
* **`Enrollment`** — links a `Contact` (the trainee) to a `Batch`, with
  status (`ENROLLED`/`IN_PROGRESS`/`COMPLETED`/`DROPPED`) and payment
  status (`PENDING`/`PARTIAL`/`PAID`/`REFUNDED`). If a client IT company
  is sponsoring the trainee, `companyId` links back to the existing
  `Company` entity — so an IT company you already track as a client can
  also be the one paying for its employees' training, with no separate
  "client" concept needed.
* `PATCH /api/enrollments/{id}/complete` marks an enrollment completed
  and generates a `certificateNumber` automatically.

This reuses the existing `User`/`Contact`/`Company` entities rather than
inventing parallel "trainer"/"trainee"/"client" tables — a trainee who's
also a sales lead's contact, or an IT company that's both a training
client and a regular CRM company record, is just one row, not two.

## 9. Scope — what's included vs. simplified

The original project brief (`README.md` at the repo root) describes a much
larger aspirational system (separate `roles`/`permissions` tables, tags,
soft-deletes, CSV import/export, rate limiting, a full notification
unread-count endpoint, etc.). This backend is built to match **the actual
MySQL schema you're running** (`database/schema.sql`, 16 tables) and **the
actual frontend contract** (`frontend/src/services/*.js`), rather than the
larger aspirational spec, so that everything here is real, wired-up, and
testable today. Concretely, **not** included (but straightforward to add
later against this same structure):

* Separate `roles` / `permissions` tables — roles are the `role` enum
  column on `users`; fine-grained permissions use the existing
  `user_permissions` table.
* Tags, Notes-as-their-own-entity, soft-deletes (`deleted_at`) — the
  actual schema doesn't have these tables/columns.
* CSV import/export endpoints, rate limiting on `/api/auth/**`.
* Password hashing and JWT — see Section 6, this is deliberate for now.
* Email sending — `communications` table/entity exist in the schema and
  DB, but no controller wires it up yet since no frontend service calls
  it.

Everything else in the "Definition of Done" list that depends on real
CRUD, RBAC, pagination/filtering/sorting, reports, and audit logging is
implemented and working end-to-end.

## 10. Project layout

```
backend/src/main/java/com/crm/portal/
├── CrmPortalApplication.java
├── config/           CORS
├── security/          Simple token auth (TokenService, AuthFilter) — see Sec. 6
├── entity/            JPA entities (1:1 with database/schema.sql tables,
│                       including Course/Batch/Enrollment)
├── enums/              UserRole (incl. TRAINER), LeadStatus, DealStage,
│                       TaskStatus, BatchMode, BatchStatus,
│                       EnrollmentStatus, PaymentStatus, ...
├── repository/         Spring Data JPA repositories (+ Specifications)
├── specification/      Dynamic search/filter query builders
├── dto/                 Request/response DTOs (entities are never
│                        exposed directly over the API)
├── mapper/              Entity → DTO mapping
├── service/             Business logic, validation, audit logging
├── controller/           Thin REST controllers
├── exception/            Centralized error handling
└── util/                 PageUtils (pagination/sorting helper)
```
