# Debriefs Playbook (Change Management)

## Purpose
A **Debrief** is a retrospective record created immediately *after* the completion of a significant task, brief, or milestone. While the Brief describes what was *planned*, the Debrief captures what was *actually built*, what challenges were faced, what was learned, and the concrete verification proof of success.

---

## The Change Management Protocol (CMP)

A debrief is **MANDATORY** for all significant feature implementations, cleanups, or refactorings. It serves as:
* **The Semantic Knowledge Base:** Keeping the developer and future AI sessions fully informed.
* **Verification Proof:** Recording exactly how the implementation was validated.
* **Architecture Decision Records (ADRs):** Linking to architectural decision documents created during the work.

---

## File Naming and Frontmatter

* **File Name:** `YYYY-MM-DD-debrief-[topic].md` (forces chronological listing).
* **Metadata:** Standard YAML frontmatter is required to allow search tools to index and traverse the workspace context graph.

```yaml
---
date: YYYY-MM-DD
tags: [tag1, tag2, tag3]
agent: [name of AI assistant, e.g. antigravity]
environment: [local | development | production]
---
```

### Recommended Tags Categories
* **Task Type:** `cleanup`, `refactoring`, `feature`, `bugfix`, `security`, `testing`
* **Domain:** `database`, `api`, `cli`, `ui`, `infrastructure`, `documentation`

---

## Debrief Template

```markdown
---
date: [YYYY-MM-DD]
tags: [feature, api]
agent: antigravity
environment: local
---

# Debrief: [Task/Brief Name]

## Accomplishments
- **[Accomplishment 1]:** [What was implemented, which files were touched/created]
- **[Accomplishment 2]:** [What was implemented]

## Problems Encounted & Resolutions
- **[Problem 1]:** [Description of bug, compile error, or roadblock, and how it was resolved]
- **[Problem 2]:** [Description]

## Architectural Decisions (ADRs)
- Link to any Architecture Decision Records (e.g. `decisions/adr-001-orm-choice.md`) created during this task to capture *why* specific choices were made.

## Verification Proof
- **Automated Tests:** [Commands run and output summaries]
- **Manual Verification:** [Step-by-step confirmation, screenshot links, or output logs proving correctness]

## Lessons Learned
- **[Lesson 1]:** [Insight gained that should be applied to future workspace tasks]
- **[Lesson 2]:** [Insight]
```
