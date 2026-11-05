import { REQUEST_EXPIRY_HOURS } from "./config";

const MS_PER_HOUR = 60 * 60 * 1000;

export function isExpired(
  createdAt,
  now = Date.now(),
  expiryHours = REQUEST_EXPIRY_HOURS
) {
  const createdAtMs = createdAt == null ? NaN : new Date(createdAt).getTime();

  if (Number.isNaN(createdAtMs)) {
    throw new TypeError("isExpired: createdAt must be a valid date");
  }

  return now >= createdAtMs + expiryHours * MS_PER_HOUR;
}
