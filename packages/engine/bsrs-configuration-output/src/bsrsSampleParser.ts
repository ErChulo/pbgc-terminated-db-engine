import type { BsrsSemanticValidationSource } from "./semanticValidationTypes";

export type BsrsSampleRow = {
  row_index: number;
  values: Record<string, string>;
};

export type BsrsParsedSample = {
  source_path: string;
  raw_text: string;
  headers: string[];
  rows: BsrsSampleRow[];
};

export function parseBsrsSample(source: BsrsSemanticValidationSource): BsrsParsedSample {
  const lines = source.text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.length > 0);
  const [headerLine, ...rowLines] = lines;
  const headers = headerLine?.split("\t") ?? [];

  return {
    source_path: source.source_path.replaceAll("\\", "/"),
    raw_text: source.text,
    headers,
    rows: rowLines.map((line, index) => {
      const cells = line.split("\t");
      return {
        row_index: index + 2,
        values: Object.fromEntries(headers.map((header, headerIndex) => [header, cells[headerIndex] ?? ""])),
      };
    }),
  };
}
