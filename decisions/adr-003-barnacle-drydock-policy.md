# Decision: Barnacle Drydock Policy

**Date:** 2026-06-03
**Status:** Accepted

## Context

Blueprint projects are meant to survive repeated AI-assisted sessions. Stale instructions and copied assumptions accumulate quickly. Deleting them outright loses context; leaving them inline misleads future agents.

## Decision

Use `decisions/drydock/` as the local quarantine for removed documentation barnacles. Keep the full automated scrubber optional; the template should define the policy before forcing a particular implementation.

## Alternatives Considered

| Option | Why Rejected |
|--------|--------------|
| Delete stale text immediately | Loses useful historical context. |
| Keep stale text inline | Makes active documents lie. |
| Require a scrubber daemon by default | Too much machinery for a template repository. |

## Consequences

**Positive:**
- Active docs remain current.
- Removed context has a predictable local home.
- Future scrubber tooling has a defined target.

**Negative:**
- Drydock is local and ignored, so durable rationale must still be promoted into ADRs.
