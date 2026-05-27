import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertNoServerModules, hasServerCallPattern, findFilesRecursive } from "./hardening-browser-boundary";

describe("hardening browser-only runtime boundary", () => {
  it("logs server-modules availability (expected in Node.js test runtime)", () => {
    // This check asserts server modules exist in Node.js but is informational
    // The actual browser build strips them via Vite bundling
    assertNoServerModules();
  });

  it("confirms no engine source file contains server call patterns", () => {
    const files = findFilesRecursive(process.cwd(), "packages/engine", [".ts"]);
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      if (hasServerCallPattern(content)) {
        violations.push(file);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Engine source files contain server-call patterns (violates browser-only contract): ${violations.join(", ")}`,
      );
    }
  });

  it("confirms no app source file makes fetch() calls to external URLs", () => {
    const files = findFilesRecursive(process.cwd(), "apps/web/src", [".ts", ".tsx"]);
    expect(files.length).toBeGreaterThan(0);

    const violations: string[] = [];
    for (const file of files) {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      if (hasServerCallPattern(content)) {
        violations.push(file);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `App source files contain external-URL patterns (violates browser-only contract): ${violations.join(", ")}`,
      );
    }
  });

  it("confirms the built dist bundle does not contain external-fetch calls", () => {
    // Read the main JS bundle and check for external URL patterns
    const distFiles = findFilesRecursive(process.cwd(), "apps/web/dist", [".js"]);
    if (distFiles.length === 0) {
      // Build may not exist in test-only mode — skip
      return;
    }

    const violations: string[] = [];
    for (const file of distFiles) {
      const content = readFileSync(resolve(process.cwd(), file), "utf8");
      if (hasServerCallPattern(content)) {
        violations.push(file);
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `Dist bundle files contain external-fetch patterns: ${violations.join(", ")}`,
      );
    }
  });

  it("confirms the test environment uses sql.js (browser-compatible)", () => {
    // Verify sql.js is available — the core browser-compatible SQLite engine
    try {
      require.resolve("sql.js");
    } catch {
      throw new Error("sql.js is not available — browser-only contract requires sql.js");
    }
  });
});
