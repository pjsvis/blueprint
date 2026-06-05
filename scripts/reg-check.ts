#!/usr/bin/env bun
/** Validate JSONL document registries against the unified required-field contract. */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const REQUIRED = ["file", "date", "status", "summary"] as const;

const REGISTRIES: Record<string, string> = {
  briefs: "briefs/INDEX.jsonl",
  debriefs: "debriefs/INDEX.jsonl",
  decisions: "decisions/INDEX.jsonl",
  playbooks: "playbooks/REGISTRY.jsonl",
  docs: "docs/INDEX.jsonl",
  scripts: "scripts/INDEX.jsonl",
};

function checkRegistry(name: string, path: string): boolean {
  const fullPath = join(process.cwd(), path);
  let ok = true;

  try {
    const content = readFileSync(fullPath, "utf-8").trim();
    if (!content) {
      console.log(`  ✓ ${name} (0 entries)`);
      return true;
    }

    const lines = content.split("\n");
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]?.trim();
      if (!line) continue;

      let obj: Record<string, unknown>;
      try {
        obj = JSON.parse(line) as Record<string, unknown>;
      } catch {
        console.error(`  ✗ ${name}:${index + 1} — invalid JSON`);
        ok = false;
        continue;
      }

      for (const field of REQUIRED) {
        if (obj[field] == null) {
          console.error(`  ✗ ${name}:${index + 1} — missing "${field}"`);
          ok = false;
        }
      }
    }

    if (ok) console.log(`  ✓ ${name} (${lines.length} entries)`);
  } catch (error) {
    console.error(`  ✗ ${name} — ${error instanceof Error ? error.message : String(error)}`);
    ok = false;
  }

  return ok;
}

function main(): void {
  const target = Bun.argv[2];
  let allOk = true;

  if (target) {
    const path = REGISTRIES[target];
    if (!path) {
      console.error(`Unknown registry: ${target}`);
      console.error(`Known: ${Object.keys(REGISTRIES).join(", ")}`);
      process.exit(1);
    }
    console.log(`Validating ${target}...`);
    allOk = checkRegistry(target, path);
  } else {
    console.log("Validating registries...");
    for (const [name, path] of Object.entries(REGISTRIES)) {
      if (!checkRegistry(name, path)) allOk = false;
    }
  }

  if (!allOk) process.exit(1);
}

main();
