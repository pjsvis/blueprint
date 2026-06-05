---
date: 2026-05-20
status: canonical
tags: [playbook, philosophy, tooling, lean]
---

# Lean Process & Minimalist Tooling Playbook

## Purpose
This playbook codifies our strict engineering philosophy of **Lean Process & Minimalist Tooling**. It serves as our guard against cognitive bloat, over-engineered integrations, and "barnacle-prone" documentation templates. We prioritize high-signal, hand-crafted files and direct, zero-overhead execution models.

---

## 1. Rejection of Pre-Generated Bloat (Skills & Templates)

In our developer-AI experience, we have found that generic, automated template frameworks often degrade the quality of the workspace.

### A. The "Skills" Problem
* **Observation:** Standard, pre-packaged AI "skills" files are typically wordy, excessively generic, and require massive manual editing to fit a project's real constraints.
* **Our Stance:** **We write our own custom playbooks.** Rather than relying on rigid, pre-generated AI capability manifests, we write lightweight, tailored markdown files (e.g., `playbooks/`) directly inside the codebase. They fit our specific environment and compile perfectly with our linter.

### B. The "Context7" Problem
* **Observation:** Complex, multi-file context scaffolding templates (like "Context7") generate a sprawling mess of template text that dilutes high-signal context and increases token overhead.
* **Our Stance:** **We write our own documentation.** We prefer a flat, high-signal structure containing a single `README.md`, an `AGENTS.md` boundary script, and a `SILO_MANIFEST.md` representing the file layout.

---

## 2. Minimalist Interfaces (CLI First, MCP Second)

While advanced integration layers have their place, they often introduce excessive complexity.

### A. The MCP Server Overhead
* **Observation:** Model Context Protocol (MCP) servers introduce significant environmental, network, and execution overhead even when they are not actively being used. They require constant background process management.
* **Our Stance:** **A CLI is better value.** A Command Line Interface (CLI) built declared natively with lightweight engines (like Citty) is easier to build, test, and run. It introduces zero background overhead, is perfectly callable by shell commands and agent processes, and acts as the perfect structural precursor to an MCP server if one is ever strictly needed.

---

## 3. The `just` Facade Principle

Complex multi-command sequences are prone to typos and differences in shell syntax across developers and AIs.

* **Our Stance:** **Put everything behind a clean `just` facade.** 
* By encapsulating compiler checks, linter configurations, import boundary tools, and onboarding commands under a simple `justfile` target, we accomplish massive engineering operations with very few words.
* **Example:**
  * To onboard and inspect: `just orient`
  * To run the comprehensive validation gate: `just check`
* This keeps agent prompts short, limits command line errors, and provides an immutable operational gateway for the workspace.

---

## 4. High-Value, Agent-Friendly CLI Tools

To maintain an ultra-lean workspace while maximizing the productivity of human developers and AI coding agents, we equip our environment with a curated set of lightweight, high-performance CLI tools. These tools are listed in `flox.toml` to ensure they are available in every shell session:

### A. Code Exploration & Inspection
* **`ripgrep` (`rg`):** An ultra-fast, line-oriented pattern search tool. Its speed and ripgrep-ignore defaults make it the standard for locating definitions and occurrences across large codebases.
* **`ast-grep` (`sg`):** A tool for structure-aware code searching and refactoring based on AST (Abstract Syntax Tree) queries rather than brittle regex. Perfect for agents carrying out structural rewrites or checking rule compliance.
* **`glow`:** A terminal markdown renderer. Enables developers and AI agents to quickly read playbooks, readmes, and debrief files with beautiful styling directly inside standard shell outputs.
* **`jq` / `yq`:** High-speed command-line JSON and YAML processors. Crucial for parsing local metadata config files (`package.json`, `.settings.json`) within shell scripts and automation gates.

### B. Workspace Diagnostics & Automation
* **`defuddle`:** A high-value developer/agent companion tool designed to untangle, diagnose, and demystify complex compiler type-checking errors, dependency conflicts, or formatting warnings.
* **`watchexec`:** A simple, high-speed, general-purpose file watcher. Instantly triggers automated compilation tests, format checks, or test runners when local project files are saved, closing the developer-AI feedback loop.

---

## 5. The Dedicated Agent Sandbox (`sandbox/`)

To keep the main repository pristine and prevent the accumulation of temporary testing "barnacles," the environment provides a dedicated sandbox folder.

* **Dedicated & `.gitignored`:** Located at `sandbox/` and explicitly ignored by `.gitignore`. It is a safe playground where AI agents can write, edit, compile, execute, and destroy files completely at will.
* **Purpose:** Agents should use this directory to run experimental scripts, code spikes, intermediate logs, and test queries.
* **Keep Production Clean:** Any stable logic or production-grade systems resulting from these sandboxed experiments must be promoted to the canonical folders (`src/`, `scripts/`, `playbooks/`) before finalizing the session, leaving the sandbox as a temporary scratchpad.


