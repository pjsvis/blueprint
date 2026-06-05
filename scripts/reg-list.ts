#!/usr/bin/env bun
/** Human-readable registry lister. */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const MAX_SUMMARY_WIDTH = 72;

interface UnifiedEntry {
  file: string;
  date: string;
  status: string;
  summary: string;
  meta?: Record<string, unknown>;
}

const FILE_MAP: Record<string, string> = {
  briefs: "briefs/INDEX.jsonl",
  debriefs: "debriefs/INDEX.jsonl",
  decisions: "decisions/INDEX.jsonl",
  playbooks: "playbooks/REGISTRY.jsonl",
  docs: "docs/INDEX.jsonl",
  scripts: "scripts/INDEX.jsonl",
};

function getTerminalWidth(): number {
  const columns = Bun.env.COLUMNS;
  if (columns) return Number.parseInt(columns, 10);
  return 80;
}

function wrap(text: string, width: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function formatMeta(meta: Record<string, unknown> | undefined): string[] {
  if (!meta) return [];
  return Object.entries(meta)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `${key}: ${String(value)}`);
}

function formatEntry(entry: UnifiedEntry, width: number): string {
  const indent = "      ";
  const textWidth = width - indent.length;
  const header = `${entry.date}  ${entry.status.toUpperCase().padEnd(10)}  ${entry.file}`;
  const summaryLines = wrap(entry.summary, textWidth);
  const metaLines = formatMeta(entry.meta);

  return [
    header,
    ...summaryLines.map((line) => `${indent}${line}`),
    ...metaLines.map((line) => `${indent}${line}`),
    "",
  ].join("\n");
}

function loadJsonl(path: string): UnifiedEntry[] {
  const content = readFileSync(path, "utf-8").trim();
  if (!content) return [];
  return content.split("\n").map((line) => JSON.parse(line) as UnifiedEntry);
}

function main(): void {
  const registry = Bun.argv[2];
  if (!registry) {
    console.error(
      "Usage: bun scripts/reg-list.ts <briefs|debriefs|decisions|playbooks|docs|scripts>",
    );
    process.exit(1);
  }

  const path = FILE_MAP[registry];
  if (!path) {
    console.error(`Unknown registry: ${registry}`);
    console.error(`Known: ${Object.keys(FILE_MAP).join(", ")}`);
    process.exit(1);
  }

  const width = Math.min(getTerminalWidth(), MAX_SUMMARY_WIDTH + 10);
  const entries = loadJsonl(join(process.cwd(), path));
  console.log(`── ${registry.toUpperCase()} (${entries.length} entries) ──
`);
  for (const entry of entries) console.log(formatEntry(entry, width));
}

main();
