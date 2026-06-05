/**
 * Import Boundary Guard Check
 * Enforces strict boundary rules between system layers to prevent dependency cycles.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC_DIR = join(import.meta.dir, "..", "src");

function getFiles(dir: string): string[] {
  const subdirs = readdirSync(dir);
  const files: string[] = [];

  for (const subdir of subdirs) {
    const res = join(dir, subdir);
    if (statSync(res).isDirectory()) {
      files.push(...getFiles(res));
    } else if (res.endsWith(".ts") || res.endsWith(".tsx")) {
      files.push(res);
    }
  }

  return files;
}

function checkImportBoundaries(): boolean {
  console.log("Auditing system import boundaries...");

  // Verify directories exist
  try {
    statSync(SRC_DIR);
  } catch {
    console.log("No src/ directory found. Skipping boundary check.");
    return true;
  }

  const files = getFiles(SRC_DIR);
  let violationCount = 0;

  for (const file of files) {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === undefined) continue;
      const importMatch = line.match(/from\s+['"](.+)['"]/);
      if (!importMatch) continue;

      const importPath = importMatch[1];
      if (importPath === undefined) continue;

      // Rule 1: No production code in src/ may import from support scripts/
      if (importPath.startsWith("@scripts") || importPath.includes("scripts/")) {
        console.error(`Boundary Violation in ${file}:${i + 1}`);
        console.error(
          `  Production source is illegally importing support scripts: "${importPath}"`,
        );
        violationCount++;
      }

      // Rule 2: Leaf layer src/lib/ may not import from higher layers
      if (
        file.includes("src/lib/") &&
        (importPath.includes("@server/") || importPath.includes("src/server/"))
      ) {
        console.error(`Boundary Violation in ${file}:${i + 1}`);
        console.error(
          `  Leaf shared module src/lib/ is illegally importing server layers: "${importPath}"`,
        );
        violationCount++;
      }
    }
  }

  if (violationCount > 0) {
    console.error(`Boundary validation failed: ${violationCount} violations found.`);
    return false;
  }

  console.log("Boundary validation passed: All layer bounds are strictly respected.");
  return true;
}

const success = checkImportBoundaries();
if (!success) {
  process.exit(1);
}
