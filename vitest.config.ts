import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@pbgc/shared": resolve(__dirname, "packages/shared/src/index.ts"),
      "@pbgc/db": resolve(__dirname, "packages/db/src/index.ts"),
      "@pbgc/benefit-kernel": resolve(__dirname, "packages/engine/benefit-kernel/src/index.ts"),
      "@pbgc/date-resolution": resolve(__dirname, "packages/engine/date-resolution/src/index.ts"),
      "@pbgc/service-resolution": resolve(__dirname, "packages/engine/service-resolution/src/index.ts"),
      "@pbgc/compensation-resolution": resolve(__dirname, "packages/engine/compensation-resolution/src/index.ts"),
      "@pbgc/form-resolution": resolve(__dirname, "packages/engine/form-resolution/src/index.ts"),
      "@pbgc/v1-ve-output": resolve(__dirname, "packages/engine/v1-ve-output/src/index.ts"),
      "@pbgc/valuation-listings-output": resolve(__dirname, "packages/engine/valuation-listings-output/src/index.ts"),
      "@pbgc/bsrs-configuration-output": resolve(__dirname, "packages/engine/bsrs-configuration-output/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["packages/tests/**/*.test.ts"],
  },
});
