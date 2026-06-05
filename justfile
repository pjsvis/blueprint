# Unified Task Silo Runner
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

srv:
    @just --list --unsorted | grep -E "^  \[srv\]" || echo "No srv recipes found"

n:
    @just --list --unsorted | grep -E "^  \[news\]" || echo "No news recipes found"

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
    echo ""
    if command -v td &> /dev/null; then
        echo "=== Active Task ==="
        td current 2>/dev/null || echo "  (no active task)"
    else
        echo "=== Local Task Manager (td) not installed ==="
    fi

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

# Execute all compiler, linter, boundary, and registry checks
[group("bun")]
check:
    bunx @biomejs/biome check .
    bunx tsc --noEmit
    bun scripts/check-boundaries.ts
    bun scripts/reg-check.ts
    bun scripts/reg-sync.ts --all

# Run Biome lint checks
[group("bun")]
lint:
    bunx @biomejs/biome check .

# Run Biome auto-formatting
[group("bun")]
format:
    bunx @biomejs/biome format . --write

# ── Registry: Document Indices ───────────────────────────────────────────

# Validate all document registers
[group("reg")]
reg-check:
    bun scripts/reg-check.ts

# Check all directory registers for drift
[group("reg")]
reg-sync:
    bun scripts/reg-sync.ts --all

# Repair all directory registers after adding, renaming, or deleting files
[group("reg")]
reg-fix:
    bun scripts/reg-sync.ts --all --fix

# List one document register
[group("reg")]
reg-list registry:
    bun scripts/reg-list.ts {{registry}}

# ── Services: Process Lifecycle Daemon ───────────────────────────────────

# Start background services
[group("srv")]
start:
    @echo "Starting background services..."
    # Add your startup daemon command here (e.g. Bun.spawn daemon)

# Stop background services
[group("srv")]
stop:
    @echo "Stopping background services..."
    # Add your shutdown/sigterm command here

# Check background service status
[group("srv")]
status:
    @echo "Checking services status..."
    # Add status verification command

# ── News: Daily News Pipeline ─────────────────────────────────────────────

# Fetch news and run sentiment analysis (default limit 5)
[group("news")]
news-fetch limit="5":
    bun run src/cli/main.ts fetch --limit {{limit}}

# List stored news articles
[group("news")]
news-list json="false":
    bun run src/cli/main.ts list {{if json == "true" { "--json" } else { "" }}}

# Run Tier 0 lab news pipeline experiment
[group("news")]
news-lab:
    bun scripts/lab/fetch-news-lab.ts

