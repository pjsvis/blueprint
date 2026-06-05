# Lab-First Script Promotion Playbook

## Purpose
This playbook defines the **promotion path** for software assets. It prevents the rapid accumulation of technical debt, raw/untyped scripts, and half-baked prototypes from polluting production source code (`src/`).

---

## The Promotion Ladder

Every new tool, algorithm, or script must ascend the three-tier promotion ladder. No code is written directly in `src/` without first passing the experimental gates.

```
Tier 0: Lab Experiment (scripts/lab/foo.ts)
           ↓ Proven stable, add basic types
Tier 1: Internal Script (scripts/foo.ts)
           ↓ Enforced strict compilation, add test suites
Tier 2: Production Module (src/lib/foo.ts)
```

---

## Tier Definitions & Standards

### Tier 0: Lab Experiments (`scripts/lab/`)
* **Purpose:** Prototyping, API exploration, direct manual scratchpads.
* **Rules:**
  * Permissive types. Use of `any` is allowed to move quickly.
  * No test coverage required.
  * Excluded from standard CI type-checking (`tsc` for `src/` ignores `scripts/lab/`).
  * Checked into version control but never imported by production layers.

### Tier 1: Internal Scripts (`scripts/`)
* **Purpose:** Automation, database seeding, document synchronization, testing tools.
* **Rules:**
  * Basic types enforced.
  * Must compile correctly under script-specific compiler options.
  * Must be fully linted and formatted with Biome.
  * Never imported by any file inside the `src/` directory.

### Tier 2: Production Modules (`src/lib/` or `src/`)
* **Purpose:** Authoritative codebase, public APIs, production routes, or core math models.
* **Rules:**
  * Zero use of `any` (fully type-safe).
  * 100% compliant with strict `tsconfig.json` requirements.
  * Mandatory automated unit or integration test coverage.
  * Complete documentation and integration into the registry.

---

## How to Promote an Asset

To promote a script from Tier 0 to Tier 1, or Tier 1 to Tier 2:
1. **Refactor and Harden:** Linearize the logic, remove nested helper functions, and replace loose types with strict interfaces.
2. **Write Automated Tests:** Verify edge cases, wrong input formats, and failure states.
3. **Audit Boundaries:** Ensure that the asset's imports respect the layer boundaries.
4. **Move File:** Relocate the file to the corresponding folder in a single commit, updating all references.
5. **Verify Gate:** Run `just check` to ensure the compilation gate is completely green.
