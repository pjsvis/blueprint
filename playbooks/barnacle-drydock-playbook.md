---
date: 2026-06-03
updated: 2026-06-03
tags: [playbook, documentation, barnacles, drydock]
agent: codex
environment: local
---

# Barnacle Drydock Playbook

## Purpose

Move stale or contradicted project instructions out of active documents without pretending the historical context never existed.

## When to Use This Playbook

Use this when documentation contains obsolete setup steps, contradicted architecture, stale task status, or copied text that no longer fits the current silo.

## The Protocol

1. Identify the barnacle and confirm it is not load-bearing.
2. If the rationale is still important, promote it into an ADR before removing active text.
3. Move quarantined text to `decisions/drydock/YYYY-MM-DD/{source-path}/`.
4. Record source, reason, and date in a local drydock note.
5. Update the active document so it describes the current system.
6. Run `just check`.

## Validation

- Active docs no longer contain stale instructions.
- Important rationale lives in `decisions/`.
- `decisions/drydock/` remains gitignored.
- `just check` passes.

## Related Documents

- `decisions/adr-003-barnacle-drydock-policy.md`
- `playbooks/unified-registry-playbook.md`
