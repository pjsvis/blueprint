# ADR-001: Foundational Toolchain Selection (Bun & Biome)

**Date:** 2026-05-20
**Status:** Accepted

---

## Context
When building a reusable developer-AI process blueprint, establishing a highly responsive, type-safe, and low-friction feedback loop is paramount. Traditional Node.js setups combined with separate compilation (TSC) and formatting/linting engines (ESLint and Prettier) suffer from:
1. Significant startup lag (critical when tools are run repeatedly by developers or AI agents).
2. Complex, separate configuration files that are prone to version skew and linting mismatch.
3. High memory usage and complex setup steps.

## Decision
We select the **Bun runtime** and the **Biome toolchain** as the primary foundational components of the blueprint:
- **Bun** replaces Node.js for running local task scripts, executing TypeScript code directly without a separate build phase, and providing high-performance subprocess APIs.
- **Biome** replaces ESLint, Prettier, and import organizers, consolidating formatting, linting, and import-sorting into a single, cohesive engine.

## Consequences

### Positive
- **Instantaneous Feedback:** Execution times for linter, formatter, and registry-sync tasks drop to milliseconds, making local verification gates extremely fast.
- **Consolidated Configuration:** A single `biome.json` replaces the fragmented `eslintrc`, `prettierrc`, `eslintignore`, and `prettierignore` files.
- **Built-in TypeScript Execution:** Support scripts can be run directly using `bun scripts/...` without manual compile, watch, or packaging configurations.

### Negative / Risks
- **Ecosystem Maturity:** Some highly specific ESLint plugins might not be supported natively by Biome yet. However, for a clean process template, the core linter rules in Biome cover over 95% of standard production needs.
