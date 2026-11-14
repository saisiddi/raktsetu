import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // mirror the "@/*" alias from jsconfig.json so lib files can import
    // "@/locales/en.json" the same way they do under Next
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.js"],
  },
});
