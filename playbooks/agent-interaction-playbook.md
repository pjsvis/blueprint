---
date: 2026-05-20
status: canonical
tags: [playbook, philosophy, agents, communication]
---

# Developer-Agent Interaction Playbook

## Purpose
This playbook codifies the standard conventions for high-signal human-to-AI communication inside the workspace. By standardizing how requests are formatted and bounded, we maximize execution reliability, minimize cognitive misalignments, and unlock the highest level of autonomous problem-solving from the agent.

---

## 1. Instruction Modifiers (`- opinion` vs. `- proceed`)

To prevent the agent from guessing or starting premature/unwanted modifications, we explicitly categorize requests using trailing suffixes:

* **`- opinion`**
  * **Intent:** Pause, analyze the request, and deliver a structured architectural opinion, design recommendation, or trade-off evaluation.
  * **Constraint:** The agent **must not** make any source code modifications or run modifying terminal commands under this instruction. It is for structural alignment and debate.
* **`- proceed`**
  * **Intent:** Immediately execute the plan, modify files, run the verification gates, and update progress registries.
  * **Constraint:** Only use this when the technical approach is fully aligned and ready for active coding.

---

## 2. Structured Request Layout (Bulleted Clauses)

AIs parse highly structured lists with infinitely greater precision than rambling paragraphs. 

* **Rule:** Break down complex requests into discrete, indented markdown bullet points, representing **one clause per line**.
* **Bad (Rambling Text):**
  > "Please fix the branches cleaner script because it has some lint warnings about any error types and also check if we can add an about recipe in justfile so we can check package.json details and run the check script to make sure we didn't break things."
* **Good (Line-Separated Clauses):**
  ```markdown
  - resolve the lint error in clean-branches.ts by catching errors as unknown
  - add a standard 'about' recipe in justfile to query package.json via jq
  - run 'just check' inside the workspace to verify all gates are green
  ```
* **Why:** This layout maps directly to the agent's check-lists and prevents subtle sub-tasks from getting lost in a mess of text.

---

## 3. Single-Focus Execution (One Thing at a Time)

* **Rule:** Focus on completing one specific task, story, or refactoring at a time.
* Never bundle random unrelated prompts, bug reports, or feature ideas into a single session update.
* Let the agent complete the active brief, run the verification checks, and write the chronological debrief before feeding in the next instructions. This prevents context contamination and token bleed.

---

## 4. High-Autonomy Directives (Guidance vs. Micro-management)

AIs are excellent at synthesis and structural composition. Micro-managing the exact lines of code, styling, or formatting commands they should write actually degrades their performance by breaking their cognitive context maps.

* **Rule:** State the high-level intent, technology targets, and structural constraints, and let the agent figure out the exact execution details.
* **Example:**
  * **Micro-managed (Brittle):** *"Use raw CSS to set padding to 1rem, margin to 0.5rem, color to hex #ef4444, border-radius to 8px, and a subtle border with light gray."* (Micro-manages styling properties, forcing verbose or inconsistent CSS declarations).
  * **High-Autonomy (Strong):** *"Just use Tailwind to style the warning container."* (Directs the agent to a cohesive styling system, giving it the autonomy to select the perfect responsive classes that blend seamlessly into the surrounding aesthetic).
* **Why:** High-level strategic directives (like *"just use Tailwind"* or *"integrate Hono JSX views"*) align with the LLM's pattern matching and trained abstractions far better than trying to dictate raw code tokens line-by-line. Let the agent figure out the *how*, while you define the *what* and the *why*.

