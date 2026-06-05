# Conventions Playbook

## What This Is
A living registry of the project's **active conventions** and a rigorous protocol for identifying and scraping **barnacles**: outdated rules, obsolete comments, and stale documents that linger in files or agent context, causing friction and confusion.

---

## The Concept of a "Barnacle"
A barnacle is any document fragment, CLI instructions, script, or convention that:
1. **Misdirects** — instructs an agent or developer to do the wrong thing.
2. **Perpetuates Bad Practice** — conflicts with modern tools, compiler defaults, or system configurations.
3. **Lacks Living Justification** — has been superseded by automation, yet remains as noise.

**Process Barnacles:** These are non-code elements like local branches of merged pull requests, tasks marked active in the database when they are already shipped, or handoff logs referencing deleted code. They mislead agents about the true state of the project.

---

## Active Conventions

| Convention | Justification | Since |
|------------|---------------|-------|
| `justfile` lowercase | Tool default format compatibility; avoids duplicates. | 2026-05-20 |
| Strict type-checking | Enforced at code gates to prevent runtime crashes. | 2026-05-20 |
| Pre-PR self-review | Compile, lint, and run boundary checks before merging. | 2026-05-20 |
| Short, stacked PRs | Keep PRs under 30 files for reviewability and easy reverts. | 2026-05-20 |
| Drydock before deletion | Quarantine stale documentation in `decisions/drydock/` when context may matter. | 2026-06-03 |

---

## Barnacle Removal Protocol (Scrape on Sight)

Run this audit at the start of every developer-AI session. If any convention fails to prove its utility, **scrape it immediately.**

### 1. Document Barnacles Audit
- Check all markdown files, readmes, and scripts.
- Do any instructions contradict current files?
- Are they referencing directories, tools, or dependencies that have been deleted?
- Does following them create compiler or linter warnings?

### 2. Process Barnacles Audit
- Compare the local task manager state against any static status documents.
- Clean up local branches: run `git branch -d` on any branches that have been merged.
- Wipe or archive out-of-date handoff logs from previous sessions.

### Scraped Barnacles Record

Use `decisions/drydock/` for local quarantine and keep durable rationale in ADRs. Do not leave stale claims inline simply because they are historically interesting.

---

## Startup Ritual

When you boot into this workspace, execute this ritual:
1. **Orient:** Run `just orient` to see branch status and git diffs.
2. **Scrape:** Read this playbook's Scraped Barnacles Record and inspect files for active drift.
3. **Log:** Document any removed barnacles in your session handoff.
