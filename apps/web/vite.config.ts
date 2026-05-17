import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      "@pbgc/shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@pbgc/db": resolve(__dirname, "../../packages/db/src/index.ts"),
      "@pbgc/benefit-kernel": resolve(__dirname, "../../packages/engine/benefit-kernel/src/index.ts"),
      "@pbgc/date-resolution": resolve(__dirname, "../../packages/engine/date-resolution/src/index.ts"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ["sql.js"],
  },
});
