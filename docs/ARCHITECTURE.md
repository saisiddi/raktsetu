# Architecture

## Current (Phase 1)

RaktSetu is a static Next.js (App Router) app — no backend, no database. All "data" is static JSON read at build/render time.

```
app/
  layout.js          Root layout: demo banner, navbar, footer
  page.js             "/"            Landing page
  blood-banks/page.js "/blood-banks" Search/filter over data/blood-banks.demo.json
  request/page.js     "/request"     Urgent request form (demo mode, no submit)
  donate/page.js       "/donate"      Donor sign-up form (demo mode, no submit)
  donors/page.js       "/donors"      List from data/donors.demo.json, masked contact
  about/page.js        "/about"       About RaktSetu
  privacy/page.js      "/privacy"     In-app privacy principles

components/            Reusable UI (Navbar, Footer, cards, forms' subparts)
data/                  Static demo JSON (blood-banks.demo.json, donors.demo.json)
lib/
  i18n.js              t(key, vars) — dot-notation lookup + {{var}} interpolation
  config.js            REQUEST_EXPIRY_HOURS, DONATION_GAP_DAYS(_FEMALE), FOUNDING_YEAR
locales/
  en.json              All UI strings (source of truth for translators)
```

Every form validates client-side only and shows a "Demo mode" message on submit instead of sending data anywhere.

## Planned (Phase 2) data model

Once Supabase is introduced, the following tables are planned. Exact column types/constraints will be finalized in the Phase 2 design issue, but the shape is:

### `users`

| Field      | Type        | Notes                                            |
| ---------- | ----------- | ------------------------------------------------ |
| id         | uuid        | Supabase Auth user id                            |
| phone      | text        | Private — never returned to other users' clients |
| email      | text        | Optional                                         |
| created_at | timestamptz |                                                  |

### `donors`

| Field           | Type        | Notes                                             |
| --------------- | ----------- | ------------------------------------------------- |
| id              | uuid        |                                                   |
| user_id         | uuid        | FK → users.id                                     |
| first_name      | text        | Only first name is ever shown publicly            |
| blood_group     | text        | Enum: A+, A-, B+, B-, AB+, AB-, O+, O-            |
| city            | text        |                                                   |
| available       | boolean     | Toggled by donor                                  |
| last_donated_on | date        | nullable                                          |
| paused_until    | date        | Computed from last_donated_on + DONATION_GAP_DAYS |
| created_at      | timestamptz |                                                   |

### `requests`

| Field             | Type        | Notes                             |
| ----------------- | ----------- | --------------------------------- |
| id                | uuid        |                                   |
| requester_user_id | uuid        | FK → users.id                     |
| blood_group       | text        |                                   |
| units             | integer     |                                   |
| hospital_name     | text        | Required                          |
| city              | text        | Required                          |
| needed_by         | date        |                                   |
| status            | text        | open / fulfilled / expired        |
| expires_at        | timestamptz | created_at + REQUEST_EXPIRY_HOURS |
| created_at        | timestamptz |                                   |

### `messages`

| Field          | Type        | Notes                                                    |
| -------------- | ----------- | -------------------------------------------------------- |
| id             | uuid        |                                                          |
| request_id     | uuid        | FK → requests.id                                         |
| sender_user_id | uuid        | FK → users.id                                            |
| body           | text        | Never contains either party's raw phone number by design |
| created_at     | timestamptz |                                                          |

### `reports`

| Field            | Type        | Notes                           |
| ---------------- | ----------- | ------------------------------- |
| id               | uuid        |                                 |
| reporter_user_id | uuid        | FK → users.id                   |
| target_type      | text        | "request" / "donor" / "message" |
| target_id        | uuid        |                                 |
| reason           | text        | e.g. "scam", "spam", "abuse"    |
| status           | text        | open / reviewed / dismissed     |
| created_at       | timestamptz |                                 |

Row-level security policies will ensure `users.phone` and any donor contact detail are never readable by another user's client directly — all contact is brokered through server-side logic, per [docs/PRIVACY.md](./PRIVACY.md).
