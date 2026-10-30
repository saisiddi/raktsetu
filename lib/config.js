// Configurable platform rules. Kept out of UI copy and docs so the actual
// medical/business decision lives in one place, not scattered across text.

export const BASE_URL = "https://raktsetu.vercel.app";

export const REQUEST_EXPIRY_HOURS = 48;

export const DONATION_GAP_DAYS = 90;

// Static rather than `new Date().getFullYear()` so the footer stays a plain
// server component; bump it once a year.
export const FOUNDING_YEAR = 2026;
