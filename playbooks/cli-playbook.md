---
date: 2026-05-20
status: canonical
tags: [playbook, cli, citty, standards]
---

# CLI Construction Playbook (using Citty)

## Purpose
Establishing a robust Command Line Interface (CLI) is the foundational step for exposing core system capabilities to human developers, automation pipelines, and agentic AI sessions. By building a high-quality CLI, we also set up a seamless transition path to other protocols, such as Model Context Protocol (MCP) servers.

This playbook codifies the standard toolchain and architectural conventions for building CLIs within the workspace using **Citty** (by Unjs).

---

## Why Citty?
We select **Citty** as our unified CLI-builder framework because:
1. **Declarative Parsing:** Commands, arguments, options, and flags are defined as a single type-safe schema.
2. **Subcommand Nesting:** Allows modular decomposition of complex CLI trees into separate, clean files.
3. **Zero Configuration Help:** Automatically formats and prints beautiful `--help` screens.
4. **Runtime Agnostic:** Works flawlessly on Bun, Node, or Deno.

---

## Directory Architecture

To separate command-parsing concerns from core domain logic, we organize CLI-related files under `src/cli/`:

```
src/
├── cli/
│   ├── main.ts              # CLI entry point (defines global CLI details)
│   └── commands/
│       ├── scan.ts          # Subcommand: scan feature
│       └── analyze.ts       # Subcommand: analyze feature
├── lib/
│   └── index.ts             # Core business/domain logic (CLI calls this)
```

> [!IMPORTANT]
> The CLI module is a thin presentation wrapper. **Never** put database queries, direct API calls, or heavy core business logic inside the command `run()` function. Instead, import and call functions from `src/lib/` or equivalent domain layers.

---

## Citty Boilerplate Implementation

### 1. Main CLI Entry Point (`src/cli/main.ts`)

```typescript
import { defineCommand, runMain } from "citty";
import { scanCommand } from "./commands/scan";

const main = defineCommand({
  meta: {
    name: "silo",
    version: "1.0.0",
    description: "Siloed developer-AI project task companion",
  },
  subCommands: {
    scan: scanCommand,
  },
});

export const runCLI = () => runMain(main);
```

### 2. Subcommand Structure (`src/cli/commands/scan.ts`)

```typescript
import { defineCommand } from "citty";

export const scanCommand = defineCommand({
  meta: {
    name: "scan",
    description: "Scan system files for boundaries and style compliance",
  },
  args: {
    dir: {
      type: "string",
      description: "Target directory to scan",
      default: ".",
      alias: "d",
    },
    json: {
      type: "boolean",
      description: "Output results in JSON format",
      default: false,
    },
  },
  async run({ args }) {
    console.log(`Scanning directory: ${args.dir}...`);
    
    // Call clean business logic from the lib folder
    const results = { filesScanned: 12, violations: 0 };

    if (args.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log(`Scan completed. Scanned ${results.filesScanned} files with ${results.violations} violations.`);
    }
  },
});
```

---

## Developer-AI Alignment Conventions

When constructing CLIs in an environment where AI agents (like Antigravity) will operate, follow these strict design rules:

### 1. Non-Interactive Overrides
* **Rule:** AIs cannot answer interactive CLI prompts (e.g., inquirer, gum confirm) without blocking the thread.
* **Solution:** Always provide explicit flags (e.g., `--yes`, `--force`, `--non-interactive`) that bypass prompts and choose secure defaults.
* **Example:**
  ```typescript
  args: {
    yes: {
      type: "boolean",
      description: "Automatically answer yes to all prompts",
      default: false,
      alias: "y",
    }
  }
  ```

### 2. Output Formatting (JSON vs. Human Text)
* **Rule:** AIs and automation pipelines need structured data to parse outputs reliably, while developers prefer readable text.
* **Solution:** Provide a `--json` option for every read/query subcommand.
* **Example:**
  ```typescript
  if (args.json) {
    console.log(JSON.stringify(outputData));
  } else {
    // Beautiful formatted output (using table or bullet lists)
  }
  ```

### 3. Exit Codes Matter
* **Rule:** The shell environment detects failure via non-zero exit codes.
* **Solution:** Never swallow errors or return exit code `0` on command failures.
  * Successful operations: Exit code `0`
  * Validation / Lint / Quality errors: Exit code `1`
  * System / Configuration / Crash errors: Exit code `2` or higher

### 4. Direct Piping Support
* Keep output streams clean. If outputting binary data or raw file contents, ensure standard logging (e.g. "Starting command...") goes to `stderr` (`console.error`), leaving `stdout` (`console.log`) free for piping.
