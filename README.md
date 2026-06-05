# Developer-AI Process Blueprint

This repository is a self-contained, highly optimized process blueprint template. It implements a rigorous, modern developer-AI pair-programming workflow designed to maximize type-safety, prevent document drift, and eliminate structural decay ("barnacles").

Use this blueprint to bootstrap any new high-performance, agent-friendly project.

## Philosophies

1. **The Language and Subsystem Boundary:** Keep the core business logic (e.g. Python scripts) and dashboard/GUI layers (e.g. Hono/Bun, Node.js) separated by strict interfaces. Standardize on subprocess streaming bridges or RPC pipelines rather than directly coupling them.
2. **The "Anti-Barnacle" Protocol:** Documentation, playbooks, and conventions inevitably drift. Treat stale instructions, unused local branches, or dead scripts as "barnacles." Audit and scrape them regularly.
3. **Lab-First Promotion:** Never build directly in production. Write disposable Tier 0 experiments under `scripts/lab/`, promote them to Tier 1 utility scripts under `scripts/` when stable, and promote them to Tier 2 strict type-safe production modules under `src/lib/` only after full test coverage is met.
4. **Commit Gates:** Enforce linting, type-checking, database constraint checks, registry validation, and registry synchronization locally before any commit is permitted.
5. **Unified Registers:** Every document-bearing directory gets a JSONL register. `INDEX.jsonl` is the default; `playbooks/REGISTRY.jsonl` is the historical exception.

## Structure

```
.
├── playbooks/              # Canonical developer playbooks (11 core playbooks)
│   ├── agent-interaction-playbook.md
│   ├── briefs-playbook.md
│   ├── cli-playbook.md
│   ├── conventions-playbook.md
│   ├── debriefs-playbook.md
│   ├── justfile-playbook.md
│   ├── lab-first-playbook.md
│   ├── minimalist-tooling-playbook.md
│   ├── playbooks-playbook.md
│   ├── sqlite-playbook.md
│   └── td-playbook.md
├── scripts/                # Utility and synchronization scripts
│   ├── check-boundaries.ts # Directory boundary checking
│   ├── reg-check.ts        # Registry row validation
│   ├── reg-list.ts         # Human-readable registry listing
│   ├── reg-sync.ts         # Registry drift checker/repair tool
│   └── maintenance/        # Repository pruning and automation scripts
│       ├── clean-branches.ts
│       └── fix-debrief-names.ts
├── briefs/                 # Project Epics and briefs
├── debriefs/               # Chronological project debriefs and retrospectives
├── decisions/              # Architecture Decision Records (ADRs)
├── docs/                   # Optional project documentation, indexed when populated
├── sandbox/                # Dedicated, gitignored AI agent playground
├── tsconfig.json           # Type safety gate
├── biome.json              # Standard formatting and lint rules
├── flox.toml               # Cross-platform development packages config
├── justfile                # Group-based command runner
└── AGENTS.md               # Upstream agent rules and identity
```

## Quick Start

1. **Install Prerequisites:** Ensure you have `just`, `bun` (or your preferred JS runtime), and required linters installed (or activate via `flox activate`).
2. **Review Orientation:** Run `just orient` to see current workspace branch, git status, and outstanding tasks.
3. **Register Session:** Start your session using `td` or your local task manager to track progress.
4. **Audit Gates:** Run `just check` to ensure your initial repository state is 100% green before editing any code.
5. **Registry Hygiene:** Run `just reg-fix` after adding, renaming, or deleting registered documents, then replace generated summaries with useful descriptions.

---

## Agent Orientation Challenge

We invite you to clone this blueprint repository and test it with your daily driver coding agent. 

Start a session, hand this repository to your agent, and ask it the following prompt:

> "Please orient yourself to this project, run the local orientation checks, and report back with your findings and initial impressions of the workspace."

**What to expect:**
* **Instant Alignment:** Your agent should immediately locate `AGENTS.md` to understand its role and structural boundaries.
* **Facade Execution:** It will run `just orient` to read active git branches, status, and in-flight tasks with zero wordy overhead.
* **Verification Gate:** It will run `just check` to ensure all linters, compilers, and indices are 100% green.
* **Context Clarity:** It will use `SILO_MANIFEST.md` as its guide, reporting back a precise, high-signal summary of the project without getting bogged down in boilerplate text.

