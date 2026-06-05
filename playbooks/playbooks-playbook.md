# Playbook for Playbooks

## Purpose
A **Playbook** is a codified, highly targeted set of guidelines, constraints, and instructions for a specific repeatable task. It exists to minimize cognitive overhead, enforce uniformity, and preserve critical tribal engineering knowledge across developers and AI assistant iterations.

---

## When to Compile a Playbook

1. **Repeatability:** If you have done a task more than twice, codify it.
2. **Cognitive Load:** If a task has more than three non-obvious steps, delicate environmental setup, or complex safety considerations (e.g. Postgres migrations, SSH keys handling).
3. **Novel Solutions ("First Contact"):** If you resolve an intricate or undocumented bug, immediately write a playbook to ensure the solution is never forgotten.
4. **Active Standards:** If you wish to enforce style (e.g. CSS naming, SQL query parameters formatting), codify it.

---

## Playbook Structure

All playbooks must live in the `playbooks/` directory and use the standard filename convention: `topic-subtopic-playbook.md` (or simply `topic-playbook.md`).

Every playbook must contain the following components:

```markdown
---
date: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [playbook, topic, subtopic]
agent: [optional, creator assistant]
environment: [optional, local | staging]
---

# [Operational Title, e.g. SQLite Lifecycle Playbook]

## Purpose
A single, highly clear sentence explaining *what* this playbook covers and *why* it is required.

## Context & Prerequisites
- Required tools, packages, or runtimes.
- Starting system state.
- Links to related playbooks.

## The Protocol (How-To)
An imperative, numbered list of actions. Be extremely specific.
1. Run command X.
2. Verify Y is active.
   * *Critical constraint:* Do not run Z while X is running.

## Verification & Acceptance Criteria
Concrete verification checks to prove the protocol was successfully executed.
- [ ] Task is completed.
```

---

## Maintenance & Registry Lifecycle

* **Playbooks are Living Code:** Playbooks are never static. They are continuously refined and updated as the project proceeds and operations evolve. If a playbook step fails or shifts during dev sessions, **update the playbook immediately** in place.
* **Deprecation:** If a playbook is completely obsolete, do not delete it immediately. Mark it with a `> **DEPRECATED**` banner at the top and link it to its modern successor.
* **The Registry Model:** Maintain `playbooks/REGISTRY.jsonl` for playbooks. Other document directories use `INDEX.jsonl`. Run `just reg-fix` after file changes and replace generated summaries with useful descriptions.
* **Registry Promotion & Corporate Assimilation:** Local playbooks representing unique, high-value, or reusable engineering standards are promoted to a central playbook registry. In this registry, they are evaluated for compliance with corporate-level architectures, refined, and assimilated into a global, corporate-level set of playbooks, seeding process standards across all organizational workspaces.

