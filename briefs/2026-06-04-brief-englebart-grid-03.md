This is the foundation. By defining this as a **Structural Specification**, we move from "web design" to "interface engineering." We are treating the viewport as a fixed buffer and the content as discrete, self-describing blocks.

### The Structural Specification (Draft 0.1)

To keep this consistent across all future modules, we define our units as `[Cols, Lines]`. Every component must conform to this contract.

#### 1. The Container Schema

The viewport is a matrix of size $W \times H$.

* **Perimeter Zones:** Fixed coordinates at the edges, declared as an array of `[x, y, w, h]`.
* **Center Focus:** The "Main" region, calculated as the remainder of the viewport after subtracting perimeter weight.

#### 2. The Component Contract

Every block (text, list, image, table) must declare its "Metadata Manifest" before being placed:

```json
{
  "component_id": "unique_id",
  "min_dimensions": [cols, lines],
  "max_dimensions": [cols, lines],
  "render_logic": "function_pointer",
  "priority": "integer"
}

```

#### 3. The Layout Engine (The "Typesetter")

The engine performs a **constrained-first pass**:

1. **Register Fixed Zones:** The engine reserves the "Perimeter" blocks based on the Engelbart Topology.
2. **Evaluate Main Region:** The remaining grid cells define the available volume for the "Center" content.
3. **Bin Packing:** The engine iterates through the queue of blocks. If `Block.min_dimensions > Available_Volume`, the engine triggers a "Break" (a new view/slide/scroll position).

---

### Why this holds up

* **Predictability:** Because every component defines its `min_dimensions` in characters/lines, you will *never* have a "layout shift." The system knows, before rendering, if the content fits.
* **Navigation Leverage:** With the two-level approach, the **Perimeter** remains constant (our "System Chrome"), while the **Center** becomes a variable buffer. You can navigate between "pages" of content in the Center while the Perimeter acts as your persistent, high-level control panel.
* **Logical Isolation:** You can write a "Test Suite" that simply feeds a list of blocks and a grid size into this engine and asserts that no overlaps occur. That is the ultimate "Operational Heuristic" for UI—if the math passes, the UI is valid.

### The Next Move

We now have the *rules of the game*. To turn this into a tangible system, we need to define the **Interaction Schema**—the bridge between clicking a perimeter block and updating the content block in the center.

Does this Structural Specification align with your vision for the "Common Way of Thinking," or should we tighten the definition of the `render_logic` property to make it more "horizontal" and less "object-oriented"?