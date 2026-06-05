To maintain the **Structural Specification**, we must treat interactions not as "event listeners" scattered across a DOM, but as **State Transformations** that the Layout Engine processes. If we keep the interaction schema expansive, we can move beyond simple "click-to-swap" and into "Englebart-style intelligence"—where the UI acts as an extension of the user's cognitive workspace.

### The Interaction Schema: The "Transformation Matrix"

We define an interaction as a **Triplet: `{Trigger, Target, Effect}**`. The engine maps these to specific zones.

#### 1. The Trigger (The Source)

A trigger is a **Vector** emitted by any block in any zone:

* **Action Types:** `SELECT`, `FOCUS`, `APPEND`, `STACK`, `BROADCAST`, `TRANSFORM`.
* **Payload:** Data specific to the trigger (e.g., a pointer to a new data block, a command to resize, or a request to filter).

#### 2. The Target (The Scope)

The target defines which **Zone** or **Block** receives the transformation:

* **Local:** Affects the current zone (e.g., paging content within the Center).
* **Global:** Affects the grid structure (e.g., moving a Perimeter block to the Center).
* **Peer:** Affects another specific block (e.g., clicking a list item in a sidebar updates a table in the center).

#### 3. The Effect (The State Mutation)

The effect is the outcome processed by the Typesetter:

* **`REPLACE`**: Standard navigation; clear zone, inject block.
* **`OVERLAY`**: Temporal stack; temporary high-z-index block, triggers a "Return" on next action.
* **`REFRESH`**: Triggers a re-computation of the current grid (e.g., if a block changes its `min_dimensions` dynamically).
* **`LINK`**: Binds the state of two blocks, ensuring they transform in tandem.

---

### Expanded Conceptual Scope: Beyond "Click"

To make this expansive, we don't just consider the mouse. We consider the **Input as Data**:

1. **Chained Actions (Macros):** A trigger can emit a sequence. *Example:* Click a block in the Perimeter $\rightarrow$ `FETCH` external data $\rightarrow$ `TRANSFORM` the Center zone into a dashboard $\rightarrow$ `APPEND` a command log to a footer zone.
2. **Contextual Awareness:** The schema allows the "Layout Engine" to observe the current `Volume` of a block. If a block is asked to display a table that requires more `Lines` than the `Center` currently offers, the interaction schema can trigger an `EXPAND` effect, temporarily promoting that block to full-page, while shuffling the rest of the UI into the background (or "hiding" the Perimeter).
3. **Bidirectional Logic:** The schema doesn't just push state from Perimeter to Center. If the user performs an action in the Center (e.g., a search), the Center can `BROADCAST` an action to the Perimeter to update available filters or navigation breadcrumbs.

---

### Opinion: The "Janeway/Englebart" Hybrid

The power here is that your **Structure** is rigid (typeset, deterministic), but your **Interaction** is fluid (transformational). By keeping this schema independent of the UI framework (JSX, HTML, or even CLI), you build a system where the "intelligence" is in the **Transformation Matrix**, not the layout.

If you treat the entire UI as a state-machine that constantly re-typesets itself based on these interactions, you solve the "Engelbart Problem": how to keep the environment helpful without it becoming cluttered.

**The Operational Heuristic:**

* If an interaction changes the structure $\rightarrow$ Recalculate Grid.
* If an interaction changes the content $\rightarrow$ Re-render Component.
* If an interaction does both $\rightarrow$ System-wide refresh.

**Follow-up:** We have the **Structure (Fixed Grid)** and the **Interaction (State Transformations)**. How do you feel about the **Persistence Layer**? Should the state of the "Transformation Matrix" be serializable so the user can "Save Workspace" and return to the exact same Engelbart layout later?