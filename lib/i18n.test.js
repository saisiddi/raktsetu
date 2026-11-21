import { describe, expect, it } from "vitest";
import en from "@/locales/en.json";
import { t } from "./i18n";

describe("t()", () => {
  describe("plain lookup", () => {
    it("returns a top-level nested string for a dot-notation key", () => {
      expect(t("home.heroTitle")).toBe(en.home.heroTitle);
      expect(t("home.heroTitle")).toBe("RaktSetu");
    });

    it("returns the string unchanged when it has no placeholders", () => {
      expect(t("nav.bloodBanks")).toBe(en.nav.bloodBanks);
    });

    it("returns the whole array when the key points at an array", () => {
      const steps = t("home.howItWorks.steps");
      expect(Array.isArray(steps)).toBe(true);
      expect(steps).toHaveLength(en.home.howItWorks.steps.length);
    });
  });

  describe("missing key fallback", () => {
    it("returns the key itself when the path does not exist", () => {
      expect(t("does.not.exist")).toBe("does.not.exist");
    });

    it("returns the key when only part of the path exists", () => {
      expect(t("home.heroTitle.extra")).toBe("home.heroTitle.extra");
      expect(t("home.nope")).toBe("home.nope");
    });

    it("does not throw when walking through a non-object node", () => {
      expect(() => t("home.heroTitle.a.b.c")).not.toThrow();
    });
  });

  describe("string interpolation", () => {
    // en.json has this one with a {{hours}} token
    const key = "request.expiryNotice";

    it("fills a {{placeholder}} from vars", () => {
      expect(t(key, { hours: 48 })).toBe(
        en.request.expiryNotice.replace("{{hours}}", "48")
      );
      expect(t(key, { hours: 48 })).toContain("48 hours");
    });

    it("stringifies non-string values like numbers and zero", () => {
      expect(t(key, { hours: 0 })).toContain("0 hours");
    });

    it("leaves the placeholder as-is when the var is not provided", () => {
      expect(t(key)).toBe(en.request.expiryNotice);
      expect(t(key, { days: 3 })).toContain("{{hours}}");
    });

    it("fills a placeholder that is not hours", () => {
      const out = t("donate.availabilityNote", { days: 90 });
      expect(out).toBe(en.donate.availabilityNote.replace("{{days}}", "90"));
      expect(out).not.toContain("{{");
    });

    it("ignores extra vars that have no matching placeholder", () => {
      expect(t(key, { hours: 48, unused: "x" })).toBe(t(key, { hours: 48 }));
    });

    it("works for a different placeholder name", () => {
      expect(t("donors.requestContactFor", { name: "Demo Donor 1" })).toBe(
        "Request contact with Demo Donor 1"
      );
    });
  });

  describe("interpolation inside an array of strings", () => {
    it("fills placeholders in the matching items and leaves the rest alone", () => {
      const steps = t("home.howItWorks.steps", { hours: 24 });
      const original = en.home.howItWorks.steps;

      expect(steps).toHaveLength(original.length);
      expect(steps.some((s) => s.includes("24 hours"))).toBe(true);
      expect(steps.join(" ")).not.toContain("{{hours}}");

      original.forEach((line, i) => {
        if (!line.includes("{{")) expect(steps[i]).toBe(line);
      });
    });

    it("keeps the placeholder in array items when vars is empty", () => {
      const steps = t("home.howItWorks.steps");
      expect(steps.join(" ")).toContain("{{hours}}");
    });
  });

  describe("interpolation inside an array of objects (privacy.principles)", () => {
    it("fills placeholders in nested object fields and keeps the shape", () => {
      const principles = t("privacy.principles", { hours: 36 });
      const original = en.privacy.principles;

      expect(principles).toHaveLength(original.length);
      principles.forEach((p, i) => {
        expect(Object.keys(p)).toEqual(Object.keys(original[i]));
        expect(p.title).toBe(original[i].title);
      });

      const expiry = principles.find((p) => p.body.includes("36 hours"));
      expect(expiry).toBeDefined();
      expect(JSON.stringify(principles)).not.toContain("{{hours}}");
    });

    it("does not mutate the loaded locale data", () => {
      const before = JSON.stringify(en.privacy.principles);
      t("privacy.principles", { hours: 36 });
      expect(JSON.stringify(en.privacy.principles)).toBe(before);
      expect(before).toContain("{{hours}}");
    });
  });

  describe("unknown locale fallback", () => {
    it("falls back to English for a locale that has no dictionary", () => {
      expect(t("home.heroTitle", {}, "fr")).toBe(en.home.heroTitle);
    });

    it("still interpolates when falling back", () => {
      expect(t("request.expiryNotice", { hours: 48 }, "xx")).toBe(
        t("request.expiryNotice", { hours: 48 }, "en")
      );
    });

    it("still returns the key for a missing key under an unknown locale", () => {
      expect(t("does.not.exist", {}, "xx")).toBe("does.not.exist");
    });

    it("uses en by default when no locale is passed", () => {
      expect(t("nav.home")).toBe(t("nav.home", {}, "en"));
    });
  });
});
