#!/usr/bin/env bun
/**
 * Check if document registries are up to date, or regenerate them.
 *
 * Default convention: INDEX.jsonl in document-bearing directories.
 * Historical exception: playbooks/REGISTRY.jsonl.
 */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

interface RegistryDef {
  indexPath: string;
  dirPath: string;
  filePattern: RegExp;
  exclude?: RegExp[];
}

interface RegistryEntry {
  file: string;
  date: string;
  status: string;
  summary: string;
  meta?: Record<string, unknown>;
}

const REGISTRIES: Record<string, RegistryDef> = {
  briefs: {
    indexPath: "briefs/INDEX.jsonl",
    dirPath: "briefs",
    filePattern: /\.md$/,
    exclude: [/INDEX\.jsonl/],
  },
  debriefs: {
    indexPath: "debriefs/INDEX.jsonl",
    dirPath: "debriefs",
    filePattern: /\.md$/,
    exclude: [/INDEX\.jsonl/],
  },
  decisions: {
    indexPath: "decisions/INDEX.jsonl",
    dirPath: "decisions",
    filePattern: /\.md$/,
    exclude: [/INDEX\.jsonl/, /^drydock\//],
  },
  playbooks: {
    indexPath: "playbooks/REGISTRY.jsonl",
    dirPath: "playbooks",
    filePattern: /\.md$/,
    exclude: [/REGISTRY\.jsonl/, /README\.md/],
  },
  docs: {
    indexPath: "docs/INDEX.jsonl",
    dirPath: "docs",
    filePattern: /\.md$/,
    exclude: [/INDEX\.jsonl/],
  },
  scripts: {
    indexPath: "scripts/INDEX.jsonl",
    dirPath: "scripts",
    filePattern: /\.(ts|sh)$/,
    exclude: [/INDEX\.jsonl/],
  },
};

function loadIndex(path: string): RegistryEntry[] {
  try {
    const content = readFileSync(path, "utf-8").trim();
    if (!content) return [];
    return content.split("\n").map((line) => JSON.parse(line) as RegistryEntry);
  } catch {
    return [];
  }
}

function listFiles(def: RegistryDef): string[] {
  const results: string[] = [];

  function walk(dir: string): void {
    if (!existsSync(dir)) return;

    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && def.filePattern.test(entry.name)) {
        const relPath = relative(def.dirPath, fullPath);
        if (def.exclude?.some((re) => re.test(relPath))) continue;
        results.push(relPath);
      }
    }
  }

  walk(def.dirPath);
  return results.sort();
}

function checkRegistry(name: string, def: RegistryDef, fix: boolean): boolean {
  const indexEntries = loadIndex(def.indexPath);
  const indexedFiles = new Set(indexEntries.map((entry) => entry.file));
  const diskFiles = new Set(listFiles(def));

  const missing = [...diskFiles].filter((file) => !indexedFiles.has(file));
  const stale = [...indexedFiles].filter((file) => !diskFiles.has(file));

  console.log(`
── ${name.toUpperCase()} ──`);
  console.log(`  index: ${def.indexPath} (${indexedFiles.size} entries)`);
  console.log(`  files: ${def.dirPath} (${diskFiles.size} files)`);

  if (missing.length === 0 && stale.length === 0) {
    console.log("  ✓ up to date");
    return true;
  }

  if (missing.length > 0) {
    console.log(`  ⚠ MISSING from index (${missing.length}):`);
    for (const file of missing) console.log(`    + ${file}`);
  }

  if (stale.length > 0) {
    console.log(`  ⚠ STALE entries (${stale.length}):`);
    for (const file of stale) console.log(`    - ${file}`);
  }

  if (fix) {
    console.log("  → regenerating index...");
    const kept = indexEntries.filter((entry) => diskFiles.has(entry.file));
    const added = missing.map((file): RegistryEntry => {
      const fullPath = join(def.dirPath, file);
      const stat = statSync(fullPath);
      const date =
        stat.mtime.toISOString().split("T")[0] ??
        new Date().toISOString().split("T")[0] ??
        "1970-01-01";
      return {
        file,
        date,
        status: "active",
        summary: "(auto-generated - add description)",
        meta: {},
      };
    });

    const merged = [...kept, ...added].sort((a, b) => a.file.localeCompare(b.file));
    const lines = merged.map((entry) => JSON.stringify(entry)).join("\n");
    if (!existsSync(dirname(def.indexPath))) {
      // Kept deliberately tiny; registry directories should normally exist in the template.
      throw new Error(`registry directory missing: ${dirname(def.indexPath)}`);
    }
    writeFileSync(def.indexPath, lines ? `${lines}\n` : "", "utf-8");
    console.log(`  ✓ regenerated: ${merged.length} entries`);
  }

  return false;
}

function main(): void {
  const args = Bun.argv.slice(2);
  const fix = args.includes("--fix") || args.includes("--apply");
  const all = args.includes("--all") || args.includes("--verify") || args.includes("--apply");
  const targets = args.filter((arg) => !arg.startsWith("--"));

  if (all) {
    let ok = true;
    for (const [name, def] of Object.entries(REGISTRIES)) {
      if (!checkRegistry(name, def, fix)) ok = false;
    }
    if (!ok && !fix) {
      console.log("\nRun with --fix to regenerate indexes.");
      process.exit(1);
    }
    return;
  }

  if (targets.length === 0) {
    console.error("Usage: bun scripts/reg-sync.ts <registry|--all> [--fix]");
    console.error(`Registries: ${Object.keys(REGISTRIES).join(", ")}`);
    process.exit(1);
  }

  let ok = true;
  for (const target of targets) {
    const def = REGISTRIES[target];
    if (!def) {
      console.error(`Unknown registry: ${target}`);
      ok = false;
      continue;
    }
    if (!checkRegistry(target, def, fix)) ok = false;
  }

  if (!ok && !fix) {
    console.log("\nRun with --fix to regenerate indexes.");
    process.exit(1);
  }
}

main();
