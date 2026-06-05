# Workspace Silo Manifest

**Purpose:** Single source of truth for workspace assets. Any agent or developer spinning up in this silo can find every key asset here.

**First Step:** Run `just orient` to see branch, git status, and current session tasks.

---

## Asset Map

| Asset | Location | Description | Owner |
|-------|----------|-------------|-------|
| **Project Identity** | `AGENTS.md` | Strict coding boundaries and workflow rules | project |
| **Task Runner** | `justfile` | Siloed command runner for quality checks and services | project |
| **Architecture Guide**| `README.md` | General design pattern, philosophy, and boundaries | project |
| **Conventions Playbook**| `playbooks/conventions-playbook.md` | Active rules and the Anti-Barnacle removal protocol | project |
| **Tasks Playbook** | `playbooks/td-playbook.md` | Lightweight local task management workflow | project |
| **Promotion Playbook**| `playbooks/lab-first-playbook.md` | Scaffolding script promotion workflow | project |
| **Briefs Playbook** | `playbooks/briefs-playbook.md` | Standards for proposing work (epics and stories) | project |
| **Debriefs Playbook** | `playbooks/debriefs-playbook.md` | Retrospectives and change management validation | project |
| **Playbooks Playbook** | `playbooks/playbooks-playbook.md` | Standard for compiling and maintaining playbooks | project |
| **Registry Tools** | `scripts/reg-sync.ts`, `scripts/reg-check.ts`, `scripts/reg-list.ts` | Maintain, validate, and list JSONL document registries | project |
| **Boundary Guard** | `scripts/check-boundaries.ts` | Prevents illegal imports between system layers | project |
| **Agent Sandbox** | `sandbox/` | Dedicated, gitignored playground for experimental work | agent |

---

## Key Conventions

| Convention | Description | Command |
|------------|-------------|---------|
| **Database Access** | Always use centralized factories/singletons, never direct instances. | — |
| **Strict Check Gate**| All linting, typing, and sync checks must pass prior to commit. | `just check` |
| **Task Workflow** | Mark tasks as active, write log entries, and register handoffs. | `td start` |
| **Registry Sync** | Check indices for drift after document changes. | `just reg-sync` |
| **Registry Repair** | Rebuild indices after adding, renaming, or deleting documents. | `just reg-fix` |
