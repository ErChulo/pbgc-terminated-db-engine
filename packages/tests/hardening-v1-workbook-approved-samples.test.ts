import { readFileSync, readdirSync } from "node:fs";
import { extname, join, posix, relative } from "node:path";
import { inflateRawSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const REPO_ROOT = process.cwd();
const V1_WORKBOOK_ROOT = join(REPO_ROOT, "artifacts/reference/approved-samples/v1-workbooks");

type ZipEntry = {
  name: string;
  compressionMethod: number;
  compressedSize: number;
  localHeaderOffset: number;
};

function listWorkbookFiles(): string[] {
  return readdirSync(V1_WORKBOOK_ROOT)
    .filter((file) => [".xlsx", ".xlsm"].includes(extname(file).toLowerCase()))
    .map((file) => join(V1_WORKBOOK_ROOT, file))
    .sort();
}

function readZipEntries(buffer: Buffer): ZipEntry[] {
  let eocdOffset = -1;
  for (let offset = buffer.length - 22; offset >= Math.max(0, buffer.length - 65557); offset -= 1) {
    if (buffer.readUInt32LE(offset) === 0x06054b50) {
      eocdOffset = offset;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error("Missing ZIP end-of-central-directory record");
  }

  const entryCount = buffer.readUInt16LE(eocdOffset + 10);
  let offset = buffer.readUInt32LE(eocdOffset + 16);
  const entries: ZipEntry[] = [];

  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`Invalid ZIP central-directory header at ${offset}`);
    }
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + fileNameLength);

    entries.push({ name, compressionMethod, compressedSize, localHeaderOffset });
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function readZipEntryText(buffer: Buffer, entry: ZipEntry): string {
  const offset = entry.localHeaderOffset;
  if (buffer.readUInt32LE(offset) !== 0x04034b50) {
    throw new Error(`Invalid ZIP local header for ${entry.name}`);
  }
  const fileNameLength = buffer.readUInt16LE(offset + 26);
  const extraLength = buffer.readUInt16LE(offset + 28);
  const dataStart = offset + 30 + fileNameLength + extraLength;
  const compressed = buffer.subarray(dataStart, dataStart + entry.compressedSize);

  if (entry.compressionMethod === 0) {
    return compressed.toString("utf8");
  }
  if (entry.compressionMethod === 8) {
    return inflateRawSync(compressed).toString("utf8");
  }
  throw new Error(`Unsupported ZIP compression method ${entry.compressionMethod} for ${entry.name}`);
}

function relationshipTargets(relsXml: string): Array<{ id: string; target: string; external: boolean }> {
  return [...relsXml.matchAll(/<Relationship\b[^>]*>/g)].map((match) => {
    const tag = match[0];
    const id = tag.match(/\bId="([^"]+)"/)?.[1] ?? "";
    const target = tag.match(/\bTarget="([^"]+)"/)?.[1] ?? "";
    const external = tag.includes('TargetMode="External"');
    return { id, target, external };
  });
}

describe("hardening V1 approved-sample workbook structure", () => {
  it("keeps approved V1 workbook samples structurally readable as XLSX/XLSM packages", () => {
    const workbookFiles = listWorkbookFiles();

    expect(workbookFiles.map((file) => relative(V1_WORKBOOK_ROOT, file))).toEqual([
      "sample-1-v1.XLSX",
      "sample-2-v1.xlsm",
      "sample-3-V1.XLSX",
      "sample-4-v1.XLSX",
    ]);

    for (const workbookFile of workbookFiles) {
      const buffer = readFileSync(workbookFile);
      const entries = readZipEntries(buffer);
      const names = new Set(entries.map((entry) => entry.name));
      const worksheetEntries = entries.filter((entry) => /^xl\/worksheets\/sheet\d+\.xml$/.test(entry.name));

      expect(names.has("[Content_Types].xml"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(names.has("_rels/.rels"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(names.has("xl/workbook.xml"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(names.has("xl/_rels/workbook.xml.rels"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(names.has("xl/sharedStrings.xml"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(names.has("xl/calcChain.xml"), relative(REPO_ROOT, workbookFile)).toBe(true);
      expect(worksheetEntries.length, relative(REPO_ROOT, workbookFile)).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps workbook relationships resolvable to package parts for backend validation", () => {
    for (const workbookFile of listWorkbookFiles()) {
      const buffer = readFileSync(workbookFile);
      const entries = readZipEntries(buffer);
      const byName = new Map(entries.map((entry) => [entry.name, entry]));
      const workbookEntry = byName.get("xl/workbook.xml");
      const relsEntry = byName.get("xl/_rels/workbook.xml.rels");
      expect(workbookEntry, relative(REPO_ROOT, workbookFile)).toBeDefined();
      expect(relsEntry, relative(REPO_ROOT, workbookFile)).toBeDefined();

      const workbookXml = readZipEntryText(buffer, workbookEntry as ZipEntry);
      const relsXml = readZipEntryText(buffer, relsEntry as ZipEntry);
      const rels = relationshipTargets(relsXml);
      const relIds = new Set(rels.map((rel) => rel.id));
      const sheetRelIds = [...workbookXml.matchAll(/<sheet\b[^>]*\br:id="([^"]+)"/g)].map((match) => match[1]);

      expect(sheetRelIds.length, relative(REPO_ROOT, workbookFile)).toBeGreaterThanOrEqual(4);
      expect(sheetRelIds.every((id) => relIds.has(id)), relative(REPO_ROOT, workbookFile)).toBe(true);

      for (const rel of rels.filter((entry) => !entry.external)) {
        const resolvedTarget = posix.normalize(`xl/${rel.target}`);
        expect(byName.has(resolvedTarget), `${relative(REPO_ROOT, workbookFile)} -> ${rel.target}`).toBe(true);
      }
    }
  });

  it("preserves macro-enabled workbook markers only for approved XLSM samples", () => {
    for (const workbookFile of listWorkbookFiles()) {
      const buffer = readFileSync(workbookFile);
      const entries = readZipEntries(buffer);
      const names = new Set(entries.map((entry) => entry.name));
      const isMacroEnabled = extname(workbookFile).toLowerCase() === ".xlsm";

      expect(names.has("xl/vbaProject.bin"), relative(REPO_ROOT, workbookFile)).toBe(isMacroEnabled);
    }
  });
});
