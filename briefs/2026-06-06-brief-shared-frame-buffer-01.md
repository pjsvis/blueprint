This is the **Master Directive** for the system we have defined. To persist this *espinazo*, we will frame this as a structural mandate for the coding agent.

---

# Project Brief: The Cartesian Logic Grid (CLG)

**Objective:** Implement a deterministic, grid-based "Workspace" where UI is an immutable frame buffer derived from the Kolmogorov-minimal representation of state.

### 1. The Core Philosophy

* **Symmetry of Context:** The AI and the Human share the same "view"—the Frame Buffer. There is no separate "data context" for the AI and "rendered UI" for the human.
* **Grid-First (The Cartesian Constraint):** All UI is composed of $W \times H$ boxes tiled onto a fixed coordinate plane. No fluid layouts, no responsive CSS.
* **Blat-Render Pattern:** The UI is maintained in an in-memory `Map<Coordinate, Character>`. Rendering is a single synchronous "blat" operation to the terminal output.
* **Immutable State:** The frame buffer is a deterministic output of the current artifact state.

### 2. Architectural Requirements

* **Box Model:** Every logical artifact (doc, list, terminal output) must be encapsulated in a defined $W \times H$ box.
* **Priority Queue:** Artifacts are assigned an integer priority. The system packs the grid by priority until the 80% occupancy threshold is reached. Anything exceeding this threshold is automatically dropped from the frame buffer (the "Hidden" state).
* **Fixed Packing Heuristic:** Implement a packing algorithm (Recursive Binary Partitioning) that respects fixed-size constraints for artifacts.
* **The 80% Rule:** The system must enforce a global 20% negative-space requirement to prevent cognitive saturation and maintain logical clarity.

### 3. Implementation Directives for the Agent

* **No Frameworks:** No DOM, no React, no CSS-in-JS. Use raw memory buffers for state and standard TTY escape sequences for the output.
* **Idempotency:** Given the same set of artifacts and priorities, the render output must be identical.
* **Language:** TypeScript/Bun (or equivalent high-performance, deterministic runtime).
* **Interface for AI:** The AI agent is expected to manipulate the *Artifacts* and *Priorities*. It should *not* manipulate the UI directly. The UI is a derived consequence of the Artifact state.

### 4. Definition of "Done" (The MVP)

1. **Engine:** A core loop that accepts an array of `Box` objects (with priority and content).
2. **Packer:** A deterministic routine that arranges boxes on a fixed-width grid (e.g., $160 \times 40$) using the 80% packing heuristic.
3. **Renderer:** A function that blats the resulting coordinate-buffer to `stdout` via ANSI escape sequences.
4. **Verification:** A test suite that confirms two identical inputs yield an identical frame buffer (bit-for-bit).

---

**This brief is now "live" context for your coding agents.** It anchors their behavior to the deterministic, grid-based reality we've designed, rather than letting them drift into the "Shannon" noise of traditional UI development.

**Do you want to initiate the first module (the Packing Engine or the Frame Buffer core) immediately, or is there a specific logical constraint you want to add to this brief before the agent starts its work?**