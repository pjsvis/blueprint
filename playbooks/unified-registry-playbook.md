---
date: 2026-06-03
updated: 2026-06-03
tags: [playbook, registry, documentation, jsonl]
agent: codex
environment: local
---

# Unified Registry Playbook

## Purpose

Keep every document-bearing directory discoverable with a small JSONL register that can be checked, listed, and repaired by Bun tooling.

## When to Use This Playbook

Use this when adding, renaming, deleting, or substantially changing files in registered directories.

## The Protocol

1. Put source documents in the appropriate directory.
2. Use `INDEX.jsonl` as the default register name.
3. Use `playbooks/REGISTRY.jsonl` as the historical exception for playbooks.
4. Run `just reg-fix` after adding, renaming, or deleting registered files.
5. Replace auto-generated summaries with useful one-line descriptions.
6. Run `just reg-check` and `just check` before handoff.

## Unified Schema

Every register row uses this shape:

```json
{"file":"filename.md","date":"YYYY-MM-DD","status":"active","summary":"One-line purpose","meta":{}}
```

Required fields:

- `file`: path relative to the registered directory
- `date`: ISO date
- `status`: local lifecycle state
- `summary`: one-line human description
- `meta`: optional registry-specific fields

## Registered Directories

| Registry | Index file |
|----------|------------|
| briefs | `briefs/INDEX.jsonl` |
| debriefs | `debriefs/INDEX.jsonl` |
| decisions | `decisions/INDEX.jsonl` |
| docs | `docs/INDEX.jsonl` |
| playbooks | `playbooks/REGISTRY.jsonl` |
| scripts | `scripts/INDEX.jsonl` |

## Validation

- `just reg-sync` reports no missing or stale entries.
- `just reg-check` validates all register rows.
- `just check` passes.

## Related Documents

- `scripts/reg-sync.ts`
- `scripts/reg-check.ts`
- `scripts/reg-list.ts`
- `decisions/adr-002-unified-jsonl-document-registries.md`
