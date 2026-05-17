import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@pbgc/shared": resolve(__dirname, "packages/shared/src/index.ts"),
      "@pbgc/db": resolve(__dirname, "packages/db/src/index.ts"),
      "@pbgc/date-resolution": resolve(__dirname, "packages/engine/date-resolution/src/index.ts"),
      "@pbgc/service-resolution": resolve(__dirname, "packages/engine/service-resolution/src/index.ts"),
      "@pbgc/compensation-resolution": resolve(__dirname, "packages/engine/compensation-resolution/src/index.ts"),
      "@pbgc/form-resolution": resolve(__dirname, "packages/engine/form-resolution/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["packages/tests/**/*.test.ts"],
  },
});
