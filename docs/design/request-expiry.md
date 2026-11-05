# Request Expiry Design

A blood request shouldn't stay active forever. Right now Phase 1 shows an "auto-expires after 48 hours" notice, but nothing actually enforces it. This doc explains how we'll make that real once requests are stored.

The expiry window lives in `REQUEST_EXPIRY_HOURS` in `lib/config.js` (currently 48). Everything below builds on that one constant.

## What "expired" means

A request expires exactly `REQUEST_EXPIRY_HOURS` after it was created:

```
expired = now >= created_at + REQUEST_EXPIRY_HOURS * 3600000 ms
```

The boundary is inclusive, so at exactly 48 hours the request is expired and one millisecond earlier it isn't. A few things keep this reliable:

- `created_at` is set by the database or server, never the client.
- "Now" is server time, so a wrong clock on someone's phone can't change the result.
- Timestamps should carry a timezone (ISO 8601 with `Z` or an offset). Without one, JavaScript parses them as local time and the result can be off by hours.

## Option 1: Scheduled job

A job (cron, or `pg_cron` on Supabase) runs periodically and marks old requests as `expired`.

**Good:** the status is stored, so queries can filter on it, and it's a natural place to send notifications or archive later.

**Not so good:** it needs a scheduler, adds database writes, and has to handle failed or duplicate runs. It's also not instant: a request can sit as "active" until the next run, so reads would still need a time check to be accurate.

## Option 2: Computed on read

We never store an expired status. Whenever a request is read, we compare its `created_at` to the current time using `isExpired()` in `lib/requestExpiry.js`.

**Good:** no infrastructure, no extra writes, always accurate to the moment of the read, and trivial to unit test.

**Not so good:**
- Every read path has to apply the check, and one that forgets will show expired requests.
- List queries and counts need the same rule in SQL (for example `created_at > now() - interval '48 hours'`). That means the rule lives in two places, JS and SQL, and they have to stay in sync.
- Expired rows stay in the database unless we clean them up separately.
- It can't trigger anything on expiry, like a notification.

## Side by side

| | Scheduled job | Computed on read |
|---|---|---|
| Needs a scheduler | Yes | No |
| Extra DB writes | Yes | No |
| Accurate at read time | Only as fresh as the last run | Always |
| Stored expired status | Yes | No |
| Can trigger notifications | Yes | No |
| Complexity | Higher | Lower |

## Decision

Go with **computed on read**. Nothing in the app reacts to expiry yet, so a background job would add moving parts without giving us anything new.

This doesn't lock us in. If we later want notifications or cleanup, we can add a job on top and keep `isExpired()` as the single definition of expiry.

Ground rules:

- Always use `REQUEST_EXPIRY_HOURS`. Never hardcode 48.
- Build the "auto-expires after N hours" notice from the same constant so the text and the behavior can't drift apart.
- Any SQL filter should compute its cutoff from that constant too.

## `isExpired()`

```javascript
isExpired(createdAt, now = Date.now(), expiryHours = REQUEST_EXPIRY_HOURS)
```

- `createdAt` can be a `Date`, an ISO string, or epoch milliseconds.
- `now` defaults to the current time but can be passed in, which keeps tests simple (no fake timers).
- `expiryHours` defaults to the config value.
- Returns `true` once `now >= createdAt + expiryHours`, otherwise `false`.
- Throws a `TypeError` if `createdAt` is `null`, `undefined`, or not a valid date. A missing timestamp is a data bug, and failing loudly beats silently showing or hiding a blood request.

It never touches the database.

Tests should cover: just before the boundary, exactly on it, just after it, a custom `expiryHours`, each accepted input type, and invalid inputs throwing.

## Later

If we need an explicit `expired` status, notifications, archiving, or audit records, we add a scheduled job. It should reuse the same rule as `isExpired()` so the stored status and the computed result always agree.