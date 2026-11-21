import { describe, expect, it } from "vitest";
import { BLOOD_COMPATIBILITY } from "./bloodCompatibility";

const ALL_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Helper map to quickly look up compatibility rules by blood group
const compatibilityMap = new Map(
  BLOOD_COMPATIBILITY.map((entry) => [entry.group, entry])
);

describe("BLOOD_COMPATIBILITY", () => {
  describe("structure and completeness", () => {
    it("contains exactly 8 blood groups", () => {
      expect(BLOOD_COMPATIBILITY).toHaveLength(8);
      const groups = BLOOD_COMPATIBILITY.map((entry) => entry.group);
      expect(groups).toEqual(expect.arrayContaining(ALL_BLOOD_GROUPS));
      expect(new Set(groups).size).toBe(8);
    });

    it("has valid array fields for donateTo and receiveFrom without duplicates", () => {
      BLOOD_COMPATIBILITY.forEach(({ group, donateTo, receiveFrom }) => {
        expect(Array.isArray(donateTo)).toBe(true);
        expect(Array.isArray(receiveFrom)).toBe(true);
        expect(donateTo.length).toBeGreaterThan(0);
        expect(receiveFrom.length).toBeGreaterThan(0);

        // No duplicates within lists
        expect(new Set(donateTo).size).toBe(donateTo.length);
        expect(new Set(receiveFrom).size).toBe(receiveFrom.length);

        // Every listed group must be one of the known 8 groups
        donateTo.forEach((target) => {
          expect(ALL_BLOOD_GROUPS).toContain(target);
        });
        receiveFrom.forEach((source) => {
          expect(ALL_BLOOD_GROUPS).toContain(source);
        });

        // Every blood group can donate to and receive from itself
        expect(donateTo).toContain(group);
        expect(receiveFrom).toContain(group);
      });
    });
  });

  describe("individual blood group donation rules", () => {
    const expectedDonations = [
      { group: "A+", donateTo: ["A+", "AB+"] },
      { group: "A-", donateTo: ["A+", "A-", "AB+", "AB-"] },
      { group: "B+", donateTo: ["B+", "AB+"] },
      { group: "B-", donateTo: ["B+", "B-", "AB+", "AB-"] },
      { group: "AB+", donateTo: ["AB+"] },
      { group: "AB-", donateTo: ["AB+", "AB-"] },
      { group: "O+", donateTo: ["A+", "B+", "AB+", "O+"] },
      {
        group: "O-",
        donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
    ];

    it.each(expectedDonations)(
      "correctly defines who $group can donate to",
      ({ group, donateTo }) => {
        const entry = compatibilityMap.get(group);
        expect(entry).toBeDefined();
        expect(entry.donateTo).toEqual(donateTo);
      }
    );
  });

  describe("individual blood group recipient rules", () => {
    const expectedReceipts = [
      { group: "A+", receiveFrom: ["A+", "A-", "O+", "O-"] },
      { group: "A-", receiveFrom: ["A-", "O-"] },
      { group: "B+", receiveFrom: ["B+", "B-", "O+", "O-"] },
      { group: "B-", receiveFrom: ["B-", "O-"] },
      {
        group: "AB+",
        receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      },
      { group: "AB-", receiveFrom: ["A-", "B-", "AB-", "O-"] },
      { group: "O+", receiveFrom: ["O+", "O-"] },
      { group: "O-", receiveFrom: ["O-"] },
    ];

    it.each(expectedReceipts)(
      "correctly defines who $group can receive from",
      ({ group, receiveFrom }) => {
        const entry = compatibilityMap.get(group);
        expect(entry).toBeDefined();
        expect(entry.receiveFrom).toEqual(receiveFrom);
      }
    );
  });

  describe("universal donor and recipient assertions", () => {
    it("asserts O- is a universal donor", () => {
      const oNeg = compatibilityMap.get("O-");
      expect(oNeg).toBeDefined();
      expect(oNeg.donateTo).toHaveLength(8);
      expect(oNeg.donateTo).toEqual(expect.arrayContaining(ALL_BLOOD_GROUPS));

      // Assert O- is the only universal donor
      const allUniversalDonors = BLOOD_COMPATIBILITY.filter(
        (entry) => entry.donateTo.length === 8
      ).map((entry) => entry.group);
      expect(allUniversalDonors).toEqual(["O-"]);
    });

    it("asserts AB+ is a universal recipient", () => {
      const abPos = compatibilityMap.get("AB+");
      expect(abPos).toBeDefined();
      expect(abPos.receiveFrom).toHaveLength(8);
      expect(abPos.receiveFrom).toEqual(
        expect.arrayContaining(ALL_BLOOD_GROUPS)
      );

      // Assert AB+ is the only universal recipient
      const allUniversalRecipients = BLOOD_COMPATIBILITY.filter(
        (entry) => entry.receiveFrom.length === 8
      ).map((entry) => entry.group);
      expect(allUniversalRecipients).toEqual(["AB+"]);
    });
  });

  describe("consistency between donor and recipient views", () => {
    it("asserts donor and recipient views are bidirectional across all 64 blood group pairs", () => {
      ALL_BLOOD_GROUPS.forEach((donor) => {
        ALL_BLOOD_GROUPS.forEach((recipient) => {
          const donorEntry = compatibilityMap.get(donor);
          const recipientEntry = compatibilityMap.get(recipient);

          const canDonate = donorEntry.donateTo.includes(recipient);
          const canReceive = recipientEntry.receiveFrom.includes(donor);

          // If donor can donate to recipient, recipient must be able to receive from donor, and vice versa
          expect(canDonate).toBe(canReceive);
        });
      });
    });

    it("ensures every group listed in donateTo reciprocates with receiveFrom", () => {
      BLOOD_COMPATIBILITY.forEach(({ group: donor, donateTo }) => {
        donateTo.forEach((recipient) => {
          const recipientEntry = compatibilityMap.get(recipient);
          expect(
            recipientEntry.receiveFrom,
            `Expected ${recipient} receiveFrom to include ${donor}`
          ).toContain(donor);
        });
      });
    });

    it("ensures every group listed in receiveFrom reciprocates with donateTo", () => {
      BLOOD_COMPATIBILITY.forEach(({ group: recipient, receiveFrom }) => {
        receiveFrom.forEach((donor) => {
          const donorEntry = compatibilityMap.get(donor);
          expect(
            donorEntry.donateTo,
            `Expected ${donor} donateTo to include ${recipient}`
          ).toContain(recipient);
        });
      });
    });
  });

  describe("biological Rh factor invariants", () => {
    it("ensures Rh- recipients can only receive from Rh- donors", () => {
      const rhNegativeGroups = ["A-", "B-", "AB-", "O-"];
      rhNegativeGroups.forEach((group) => {
        const entry = compatibilityMap.get(group);
        entry.receiveFrom.forEach((donor) => {
          expect(donor.endsWith("-")).toBe(true);
        });
      });
    });

    it("ensures Rh+ donors can only donate to Rh+ recipients", () => {
      const rhPositiveGroups = ["A+", "B+", "AB+", "O+"];
      rhPositiveGroups.forEach((group) => {
        const entry = compatibilityMap.get(group);
        entry.donateTo.forEach((recipient) => {
          expect(recipient.endsWith("+")).toBe(true);
        });
      });
    });
  });
});
