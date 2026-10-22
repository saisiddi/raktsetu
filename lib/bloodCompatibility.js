// RBC (Red Blood Cell) compatibility list. Source of all truth

// Red blood cell compatibility, one entry per blood group.
export const BLOOD_COMPATIBILITY = [
  {
    group: "A+",
    donateTo: ["A+", "AB+"],
    receiveFrom: ["A+", "A-", "O+", "O-"],
  },
  {
    group: "A-",
    donateTo: ["A+", "A-", "AB+", "AB-"],
    receiveFrom: ["A-", "O-"],
  },
  {
    group: "B+",
    donateTo: ["B+", "AB+"],
    receiveFrom: ["B+", "B-", "O+", "O-"],
  },
  {
    group: "B-",
    donateTo: ["B+", "B-", "AB+", "AB-"],
    receiveFrom: ["B-", "O-"],
  },
  {
    group: "AB+",
    donateTo: ["AB+"],
    receiveFrom: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  {
    group: "AB-",
    donateTo: ["AB+", "AB-"],
    receiveFrom: ["A-", "B-", "AB-", "O-"],
  },
  {
    group: "O+",
    donateTo: ["A+", "B+", "AB+", "O+"],
    receiveFrom: ["O+", "O-"],
  },
  {
    group: "O-",
    donateTo: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    receiveFrom: ["O-"],
  },
];
