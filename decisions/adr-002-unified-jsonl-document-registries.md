# Decision: Unified JSONL Document Registries

**Date:** 2026-06-03
**Status:** Accepted

## Context

The blueprint is meant to seed future silo repositories. Its registry system must therefore teach the right habit from the start: document-bearing directories should be machine-checkable, human-readable, and consistent.

The previous blueprint registry implementation used `REGISTRY.jsonl` in several directories and only indexed briefs, debriefs, and playbooks. In practice, decisions and scripts are also load-bearing project knowledge.

## Decision

Adopt a unified JSONL register contract:

- default document register: `INDEX.jsonl`
- historical playbook exception: `playbooks/REGISTRY.jsonl`
- Bun/TypeScript registry tools: `reg-sync.ts`, `reg-check.ts`, `reg-list.ts`
- separate check and repair modes

Registered directories are briefs, debriefs, decisions, docs, playbooks, and scripts.

## Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Keep `REGISTRY.jsonl` everywhere | Conflicts with the broader INDEX convention and makes templates noisier. |
| Markdown tables | Human-readable but poor for drift detection. |
| SQLite registry | Useful for operational data, excessive for project knowledge. |
| Frontmatter-only indexing | Requires rescanning files to answer simple register queries. |

## Consequences

**Positive:**
- New silos get consistent document discovery.
- Registry drift is caught by `just check`.
- Repair is explicit with `just reg-fix`.

**Negative:**
- Existing templates must migrate old `REGISTRY.jsonl` files for briefs and debriefs.
- Contributors must still improve generated summaries.
