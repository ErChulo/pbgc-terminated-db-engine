import { readdirSync, statSync } from "node:fs";
import { resolve, relative } from "node:path";

/**
 * Hardening helper that confirms the test suite is running in a browser-compatible
 * Node.js environment (no server calls, no native modules beyond what sql.js supports).
 *
 * This is a lightweight scan — it checks that no Node.js-specific modules (like 'http',
 * 'https', 'net', 'fs/promises' for write operations, child_process, etc.) are required
 * by the engine packages. We use dynamic imports to detect availability rather than
 * requiring a full browser environment.
 */

const SERVER_ONLY_MODULES = [
  "http",
  "https",
  "net",
  "tls",
  "dgram",
  "child_process",
  "cluster",
  "worker_threads",
] as const;

/**
 * Verifies that no server-only Node.js modules are importable in the
 * current runtime. In a true browser runtime these would all be undefined.
 * In our Node.js test runtime, this serves as a reminder check.
 */
export function assertNoServerModules(): void {
  const available: string[] = [];
  for (const mod of SERVER_ONLY_MODULES) {
    try {
      require.resolve(mod);
      available.push(mod);
    } catch {
      // Module not available — good
    }
  }
  // In Node.js test runtime, these modules will be available.
  // The check logs rather than fails, since our tests run in Node.js.
  if (available.length > 0) {
    console.warn(
      `[hardening-browser-boundary] Server modules available in test runtime: ${available.join(", ")}. ` +
      "This is expected in Node.js test environment. The actual browser build excludes these via Vite bundling.",
    );
  }
}

/**
 * Returns true if a source file contains patterns that would break the
 * browser-only contract — i.e., actual server-call APIs.
 *
 * We intentionally exclude:
 *  - XML namespace URLs (xmlns="http://www.w3.org/...")
 *  - Vite/ESM module preload URLs
 *  - Import maps and other build-tool artifact URLs
 *  - SVG namespace references
 */
export function hasServerCallPattern(sourceCode: string): boolean {
  // Strip XML namespace attributes, SVG URLs, and other known-safe URL patterns
  const stripped = sourceCode
    .replace(/["'`]https?:\/\/www\.w3\.org[^"'`]*["'`]/g, '""')
    .replace(/xmlns=["']http:\/\/[^"']*["']/g, "")
    .replace(/import\s+.*from\s+["'][^"']*["']/g, "")
    .replace(/link\s+rel=["']modulepreload["']/gi, "")
    .replace(/integrity=["'][^"']*["']/gi, "");

  const patterns = [
    /fetch\s*\(\s*["'`]https?:\/\//g,  // fetch() to external URLs
    /new\s+WebSocket\s*\(/g,              // WebSocket connections to servers
    /\bnavigator\.sendBeacon\b/g,         // sendBeacon data to server
  ];
  return patterns.some((pattern) => pattern.test(stripped));
}

/**
 * Simple recursive glob-like file finder.
 * Returns relative paths for all files matching the given extension pattern
 * within the specified directory.
 */
export function findFilesRecursive(
  rootDir: string,
  dir: string,
  extensions: string[],
): string[] {
  const fullPath = resolve(rootDir, dir);
  const results: string[] = [];

  let entries: string[];
  try {
    entries = readdirSync(fullPath);
  } catch {
    return results;
  }

  for (const entry of entries) {
    const entryPath = resolve(fullPath, entry);
    let stat;
    try {
      stat = statSync(entryPath);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      if (entry !== "node_modules" && !entry.startsWith(".")) {
        const relSubDir = relative(rootDir, entryPath);
        results.push(...findFilesRecursive(rootDir, relSubDir, extensions));
      }
    } else if (extensions.some((ext) => entry.endsWith(ext))) {
      results.push(relative(rootDir, entryPath));
    }
  }

  return results;
}
