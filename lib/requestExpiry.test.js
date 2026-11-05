import { describe, it, expect } from "vitest";
import { isExpired } from "./requestExpiry";
import { REQUEST_EXPIRY_HOURS } from "./config";

const MS_PER_HOUR = 60 * 60 * 1000;
const EXPIRY_MS = REQUEST_EXPIRY_HOURS * MS_PER_HOUR;

const CREATED_AT = Date.parse("2026-11-03T00:00:00.000Z");
const BOUNDARY = CREATED_AT + EXPIRY_MS;

describe("isExpired", () => {
  describe("boundary", () => {
    it("is not expired just created", () => {
      expect(isExpired(CREATED_AT, CREATED_AT)).toBe(false);
    });

    it("is not expired one millisecond before the boundary", () => {
      expect(isExpired(CREATED_AT, BOUNDARY - 1)).toBe(false);
    });

    it("is expired exactly at the boundary", () => {
      expect(isExpired(CREATED_AT, BOUNDARY)).toBe(true);
    });

    it("is expired one millisecond after the boundary", () => {
      expect(isExpired(CREATED_AT, BOUNDARY + 1)).toBe(true);
    });

    it("is expired long after the boundary", () => {
      expect(isExpired(CREATED_AT, BOUNDARY + 30 * 24 * MS_PER_HOUR)).toBe(
        true
      );
    });
  });

  describe("expiryHours", () => {
    it("uses REQUEST_EXPIRY_HOURS by default", () => {
      expect(isExpired(CREATED_AT, BOUNDARY - 1)).toBe(false);
      expect(isExpired(CREATED_AT, BOUNDARY)).toBe(true);
    });

    it("respects a custom expiry window", () => {
      const oneHourLater = CREATED_AT + MS_PER_HOUR;
      expect(isExpired(CREATED_AT, oneHourLater - 1, 1)).toBe(false);
      expect(isExpired(CREATED_AT, oneHourLater, 1)).toBe(true);
    });

    it("supports fractional hours", () => {
      const halfHourLater = CREATED_AT + MS_PER_HOUR / 2;
      expect(isExpired(CREATED_AT, halfHourLater - 1, 0.5)).toBe(false);
      expect(isExpired(CREATED_AT, halfHourLater, 0.5)).toBe(true);
    });
  });

  describe("accepted createdAt types", () => {
    it("accepts a Date object", () => {
      const created = new Date(CREATED_AT);
      expect(isExpired(created, BOUNDARY - 1)).toBe(false);
      expect(isExpired(created, BOUNDARY)).toBe(true);
    });

    it("accepts an ISO 8601 string with Z", () => {
      const created = new Date(CREATED_AT).toISOString();
      expect(isExpired(created, BOUNDARY - 1)).toBe(false);
      expect(isExpired(created, BOUNDARY)).toBe(true);
    });

    it("accepts an ISO 8601 string with a timezone offset", () => {
      // Same instant as CREATED_AT, written in UTC+05:30.
      const created = "2026-11-01T05:30:00.000+05:30";
      expect(isExpired(created, BOUNDARY - 1)).toBe(false);
      expect(isExpired(created, BOUNDARY)).toBe(true);
    });

    it("accepts epoch milliseconds", () => {
      expect(isExpired(CREATED_AT, BOUNDARY - 1)).toBe(false);
      expect(isExpired(CREATED_AT, BOUNDARY)).toBe(true);
    });
  });

  describe("default now", () => {
    it("treats a request created just now as active", () => {
      expect(isExpired(Date.now())).toBe(false);
    });

    it("treats a request created well past the window as expired", () => {
      expect(isExpired(Date.now() - EXPIRY_MS - MS_PER_HOUR)).toBe(true);
    });
  });

  describe("invalid createdAt", () => {
    it.each([
      ["null", null],
      ["undefined", undefined],
      ["empty string", ""],
      ["garbage string", "not-a-date"],
      ["invalid Date", new Date("nope")],
      ["NaN", NaN],
    ])("throws a TypeError for %s", (_label, value) => {
      expect(() => isExpired(value, BOUNDARY)).toThrow(TypeError);
    });
  });
});