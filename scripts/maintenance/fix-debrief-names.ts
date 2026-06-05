/**
 * Maintenance Script: Fix Debrief Names
 * Scans the debriefs directory and ensures all retrospective files follow the
 * canonical chronological naming convention: YYYY-MM-DD-debrief-topic.md
 */

import { existsSync, readFileSync, readdirSync, renameSync, statSync } from "node:fs";
import { join } from "node:path";

const DEBRIEFS_DIR = join(import.meta.dir, "..", "..", "debriefs");

function parseYamlDate(content: string): string | null {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!frontmatterMatch) return null;

  const lines = (frontmatterMatch[1] ?? "").split("\n");
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line
      .slice(colonIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");

    if (key === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }
  }

  return null;
}

function fixDebriefNames(): boolean {
  console.log("Auditing debrief filenames...");

  try {
    const stat = statSync(DEBRIEFS_DIR);
    if (!stat.isDirectory()) {
      console.log("Debriefs path is not a directory. Skipping.");
      return true;
    }
  } catch {
    console.log("No debriefs folder found. Skipping.");
    return true;
  }

  const files = readdirSync(DEBRIEFS_DIR).filter(
    (file) => file.endsWith(".md") && file !== "README.md",
  );

  let fixCount = 0;

  for (const file of files) {
    // Expected pattern: 2026-05-20-debrief-topic.md
    const hasCorrectDatePattern = /^\d{4}-\d{2}-\d{2}-debrief-.+\.md$/.test(file);
    if (hasCorrectDatePattern) continue;

    const path = join(DEBRIEFS_DIR, file);
    const content = readFileSync(path, "utf-8");
    const frontmatterDate = parseYamlDate(content);

    let datePrefix = frontmatterDate;
    if (!datePrefix) {
      // Fallback: extract date from file creation stat
      const stat = statSync(path);
      datePrefix = stat.birthtime.toISOString().split("T")[0] ?? null;
    }

    if (!datePrefix) {
      console.warn(`Could not resolve a reliable date for debrief: "${file}". Skipping rename.`);
      continue;
    }

    // Clean up filename to extract raw topic slug
    let topicSlug = file
      .replace(/^\d{4}-\d{2}-\d{2}-/, "") // strip leading date
      .replace(/^debrief-/, "") // strip debrief prefix
      .replace(/-\d{4}-\d{2}-\d{2}/, "") // strip trailing date
      .replace(/\.md$/, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // slugify remaining text
      .replace(/^-+|-+$/g, "");

    if (!topicSlug) {
      topicSlug = "topic";
    }

    const newFilename = `${datePrefix}-debrief-${topicSlug}.md`;
    if (newFilename === file) continue;

    const newPath = join(DEBRIEFS_DIR, newFilename);
    if (existsSync(newPath)) {
      console.error(
        `Collision warning: Tried renaming "${file}" to "${newFilename}", but target already exists!`,
      );
      continue;
    }

    console.log(`Renaming: "${file}" ➔ "${newFilename}"`);
    renameSync(path, newPath);
    fixCount++;
  }

  console.log(`Completed debrief names audit. Renamed ${fixCount} file(s).`);
  return true;
}

const success = fixDebriefNames();
if (!success) {
  process.exit(1);
}
