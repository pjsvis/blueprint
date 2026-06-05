# Task Management Playbook (td-based)

## Purpose
This playbook defines the standardized workflow for managing tasks, tracking sessions, and executing handoffs using the local, lightweight `td` CLI task manager (or generic task equivalents).

---

## Session Lifecycle

### 1. Startup & Orientation
At the beginning of every programming session:
```bash
just orient    # Inspect branch, git status, last commits, and active tasks
git fetch origin
```

### 2. Register Session Identity
Register the session to establish a clean, traceable context window:
```bash
td usage --new-session   # Or local task manager session start
```

### 3. Claiming and Starting a Task
Before modifying any files, claim the task:
```bash
td start <task-id>       # Mark the task as in progress
td log "Started task"    # Log the session start
```

If another session has claimed the task, comment or coordinate a handoff:
```bash
td comment <task-id> "Requesting handover for this task"
```

### 4. Progress Logging
For any substantial progress or architectural choices made mid-session, append a local log entry to keep task context rich:
```bash
td log "Completed database schema refactoring, starting route wiring"
```

### 5. Finalizing & Handoff
Never exit a session with uncommitted progress or undocumented context. 
```bash
# Capture what was accomplished and what remains
td handoff <task-id> --done "Scaffolded database files" --remaining "Wire API routes"
td review <task-id>   # Submit for human/semantic review
```

---

## Branch Hygiene Guidelines

* **Never commit directly to `main`:** Keep the main branch pristine.
* **Feature Branches:** Always create a descriptive branch from main: `git checkout -b feat/<task-id>-<topic>`
* **Stacking:** If tasks are heavily dependent, stack your branches rather than stuffing multiple concerns into a single massive branch. Keep files-changed per branch under 30.
* **Pre-Commit Checks:** Run `just check` before every single commit.
