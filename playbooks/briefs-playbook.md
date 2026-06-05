# Briefs & Epics Playbook

## Purpose
A **Brief** is a lightweight, aspirational requirements document written *before* starting work on any feature or major refactoring task. An **Epic** is a grouping of related stories. They exist to establish absolute clarity on "What to Build" and "How to Verify" before a single line of production code is changed.

---

## Writing a Brief

All briefs live in `briefs/` (or `docs/briefs/`). Use this standard Markdown template:

```markdown
# Brief: [Feature/Task Name]

**Date:** [YYYY-MM-DD]
**Status:** [Open | In Progress | Done]

---

## Objective
A single, high-impact sentence describing *what* this accomplishes and *why* it matters.

## Requirements
Clear, specific, and testable checklist items. Avoid ambiguous terms like "fast," "nice," or "flexible."
- [ ] Specific requirement 1 (e.g. "Save logs to a UTF-8 JSON lines file")
- [ ] Specific requirement 2

## Verification Plan
Exact, manual, or automated steps required to prove that the objective is achieved and no regressions are introduced.
- [ ] Run automated gate `just check`
- [ ] Manual test: [Exact CLI commands or manual execution steps]
- [ ] Edge case test: [What happens when inputs are malformed or missing?]

## Technical Constraints & Notes
Dependencies, architectural boundaries, or pre-conditions that must be met.
```

---

## Rules of Briefs

* **File Naming:** Keep it chronological and descriptive. Standard: `brief-[topic]-[YYYY-MM-DD].md` or `epic-[name].md`.
* **Zero Jargon:** Keep requirements highly descriptive, specific, and testable.
* **Living Document:** Mark status updates directly inside the brief file. 
* **Archiving:** Keep completed briefs in `briefs/` (or `briefs/archive/`) as an immutable historical record of the system's requirements over time.

---

## Designing an Epic

For large, multi-story features spanning several days, create an Epic brief `epic-[name].md` mapping the acceptance criteria and estimation for each component story:

```markdown
# Epic: [Epic Name]

**Date:** [YYYY-MM-DD]
**Epic ID:** [PREFIX-NNN]
**Status:** [Open | In Progress]

---

## Vision
One paragraph context. Why does this epic exist?

## Component Stories

### PREFIX-NNN-S01 — [Story Title]
**What:** [Detailed description of work]
**Acceptance:**
- [ ] [Testable criteria]
**Estimate:** [0.25d | 0.5d | 1d]

---

## Done Checklist
| Story | Status |
|---|---|
| PREFIX-NNN-S01 | 🔲 |
```
