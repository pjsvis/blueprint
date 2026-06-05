# Brief: Siloed Developer-AI Process Blueprint

**Date:** 2026-05-20
**Status:** Done

---

## Objective
Establish a clean, reusable, cross-platform boilerplate workspace template (`blueprint/`) that codifies the elite, high-performance, and AI-aligned software engineering processes of the parent repository.

## Requirements
- [x] Standardize AI orientation and boundary rules under `AGENTS.md` and `SILO_MANIFEST.md`
- [x] Integrate standard configurations for high-speed linters and compilers (`tsconfig.json`, `package.json`, `biome.json`)
- [x] Codify 6 core developer-AI playbooks in the `playbooks/` folder (conventions, task-first flow, script tiering, briefs, debriefs, playbooks)
- [x] Implement automated quality verification scripts (registry index syncer, cyclical boundary checker, git branch pruner, debrief name validator)
- [x] Define reproducible Nix environment requirements under a cross-platform `flox.toml` manifest
- [x] Provide a streamlined `justfile` featuring grouped workflow commands and single-character navigation commands

## Verification Plan
- [x] Verify that `just check` executes all compiler, linter, formatting, boundary, and registry synchronization steps.
- [x] Ensure 100% green compilation/linting inside the blueprint environment.

## Technical Constraints & Notes
- Must run cleanly using Bun runtime and Biome toolchain.
- Must not contain hardcoded or specific system dependencies; variables must be generic and adaptable to new projects.
