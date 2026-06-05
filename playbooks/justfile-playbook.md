---
date: 2026-05-20
status: canonical
tags: [playbook, tooling, justfile]
---

# Justfile Construction Playbook

## Purpose
A **Justfile** (managed via `just`) serves as the uniform task execution runner and automation gateway. By establishing a rigid, siloed layout for workflow commands, we ensure that human developers and AI sessions can run compilations, formatting, linters, and services identically without having to memorize raw bash syntax or run inconsistent shell environments.

This playbook codifies our standards for organizing and documenting task silos in `justfile`.

---

## Architecture of a High-Quality Justfile

We structure our `justfile` around three core principles:
1. **Zero-Args Help Menu:** Running `just` without arguments should list all available recipes sorted logically.
2. **Task Grouping ("Silos"):** Grouping commands visually using the `[group("name")]` attribute.
3. **Single-Character Navigation Shortcuts:** Providing single-letter recipes that quickly filter or launch grouped tasks.

---

## Standard Boilerplate Template

```justfile
# Standard Developer-AI Silo Runner
# Requires: just (https://github.com/casey/just), bun

# Default: list all available recipes
default:
    @just --list

# ── Navigation Shortcuts ──────────────────────────────────────────────────
b:
    @just --list --unsorted | grep -E "^  \[bun\]" || echo "No bun recipes found"

m:
    @just --list --unsorted | grep -E "^  \[meta\]" || echo "No meta recipes found"

r:
    @just --list --unsorted | grep -E "^  \[reg\]" || echo "No reg recipes found"

# ── Meta: Orientation and Onboarding ─────────────────────────────────────

# Session Orientation: git branch, status, recent commits, in-flight tasks
[group("meta")]
orient:
    #!/usr/bin/env bash
    set -euo pipefail
    branch=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD || echo "detached")
    echo "=== Branch: $branch ==="
    echo ""
    git status --short
    echo ""
    last=$(git log -1 --format="%cr (%ci) - %s" 2>/dev/null || echo "No commits yet")
    echo "=== Last commit: $last ==="

# Print project help summary
[group("meta")]
help:
    @cat README.md

# Print project details, local toolchains, and dependency specs
[group("meta")]
about:
    @echo "=== Project Metadata ==="
    @jq -r '"Name: \(.name)\nVersion: \(.version)\nDescription: \(.description)"' package.json
    @echo ""
    @echo "=== Dependency Runtimes ==="
    @bun --version &>/dev/null && echo "Bun: $(bun --version)" || echo "Bun: Not found"
    @node --version &>/dev/null && echo "Node: $(node --version)" || echo "Node: Not found"
    @just --version &>/dev/null && echo "Just: $(just --version)" || echo "Just: Not found"

# ── Bun: Strict Coding Gate ──────────────────────────────────────────────

# Execute all compiler, linter, and registry checks
[group("bun")]
check:
    bunx @biomejs/biome check .
    bunx tsc --noEmit
    bun scripts/check-boundaries.ts
    bun scripts/reg-sync.ts --verify

# Run Biome auto-formatting
[group("bun")]
format:
    bunx @biomejs/biome format . --write
```

---

## Best Practices & Guidelines

### 1. The `@` Command Prefix
* **Rule:** Prepend all standard recipes with `@` to suppress command printing unless debugging is explicitly required. This keeps outputs clean for parsing by developer logs or AI tools.
* **Example:** Use `@echo "Starting..."` instead of `echo "Starting..."`.

### 2. Multi-line Bash Scripts
* **Rule:** For complex logic (e.g. parsing branch details or verifying environment settings), use the `#!/usr/bin/env bash` shebang pattern inside the recipe. This isolates the command execution block in a dedicated subprocess.
* **Example:**
  ```justfile
  orient:
      #!/usr/bin/env bash
      set -euo pipefail
      # complex bash logic here
  ```

### 3. Check Gates Are Blocking
* **Rule:** The `check` target must cover all compiler, linter, formatter, and registry-sync scripts. If any child check fails (exits with non-zero status), the entire check recipe must fail immediately to block commits or deployments.

### 4. Standard Orientation Recipes
Every blueprint `justfile` must define the following canonical orientation targets under the `[meta]` group:
* **`just orient`:** Inspects git states, active branches, status drift, and uncommitted modifications.
* **`just help`:** Prints high-level documentation (such as rendering the `README.md`) directly in the shell using `cat` or terminal formatters.
* **`just about`:** Safely checks toolchain dependencies (Node, Bun, CLI runtimes) and queries metadata indices (`package.json`) to confirm local environmental alignments.
