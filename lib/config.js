// Configurable platform rules. Kept out of UI copy and docs so the actual
// medical/business decision lives in one place, not scattered across text.

export const REQUEST_EXPIRY_HOURS = 48;

export const DONATION_GAP_DAYS = 90;

// The official criteria give a longer whole blood interval for female donors
// (four months). Used by the self-check on /eligibility.
export const DONATION_GAP_DAYS_FEMALE = 120;

// Static rather than `new Date().getFullYear()` so the footer stays a plain
// server component; bump it once a year.
export const FOUNDING_YEAR = 2026;
