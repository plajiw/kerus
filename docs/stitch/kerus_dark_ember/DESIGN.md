# Design System Strategy: The Luminescent Executive

## 1. Overview & Creative North Star

### Creative North Star: "The Obsidian Architect"
Management tools often suffer from "data-dense fatigue"—a sea of gray boxes and rigid lines that drain user energy. This design system rejects the clinical spreadsheet aesthetic in favor of **The Obsidian Architect**. This vision treats the interface as a premium, dark-glass workspace where data isn't just displayed; it is curated. 

By leveraging high-contrast editorial typography (Manrope) against a deep, layered charcoal canvas, we create an environment of "Quiet Authority." We break the traditional grid through **Intentional Asymmetry**: using varying card widths and breathing room (whitespace) to guide the eye toward "Create with AI" actions, ensuring the interface feels like a custom-tailored executive suite rather than a generic template.

---

## 2. Colors & Surface Philosophy

The palette is anchored in `#0e0e0e` (Surface), providing a true-black foundation that allows our vibrant orange (`#ff9f4a`) to vibrate with purpose.

### The "No-Line" Rule
**Borders are a relic of the past.** To maintain a high-end feel, designers are prohibited from using 1px solid strokes to define sections. Instead, boundaries must be defined by **Background Shifting**.
*   **Navigation Rail:** Use `surface-container-low`.
*   **Main Workspace:** Use `surface`.
*   **Informative Cards:** Use `surface-container-high`.
The eye should perceive a change in "depth," not a structural "wire."

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials.
1.  **Base Layer:** `surface` (#0e0e0e)
2.  **Sectioning:** `surface-container-low` (#131313)
3.  **Floating Elements (Cards):** `surface-container-high` (#20201f)
4.  **Interactive Popovers:** `surface-bright` (#2c2c2c)

### The "Glass & Gradient" Rule
For premium "Create with AI" moments, utilize **Glassmorphism**. Apply `surface_variant` at 60% opacity with a `24px` backdrop-blur. To give our vibrant orange "soul," never use it flat in large areas. Apply a subtle linear gradient: `primary` (#ff9f4a) to `primary_container` (#fd8b00) at a 135-degree angle.

---

## 3. Typography: Editorial Authority

We use a dual-font system to balance character with readability.

*   **Display & Headlines (Manrope):** Large, bold, and authoritative. These are the "landmarks" of the page. The wide apertures of Manrope convey modernity and openness.
*   **Body & Labels (Inter):** The workhorse. Inter’s tall x-height ensures that even complex data in tables remains legible at `body-sm` (0.75rem).

**Hierarchy Principle:** Use `on_surface_variant` (#adaaaa) for metadata (dates, item counts) to create a visual "recession," allowing the `title-md` primary information to command focus.

---

## 4. Elevation & Depth

### The Layering Principle
Forget drop shadows for every element. Depth is achieved via **Tonal Stacking**. An orange primary button sitting on a `surface-container-highest` card provides enough contrast to imply elevation without a single pixel of shadow.

### Ambient Shadows
When a component must "float" (e.g., a Toolset Bar or a Modal), use a tinted shadow:
*   **Blur:** 40px - 60px.
*   **Color:** `surface_container_lowest` (#000000) at 40% opacity.
*   **Spread:** -5px (to keep the shadow tight and professional, avoiding "muddy" edges).

### The "Ghost Border" Fallback
If accessibility requires a container definition (like a search input), use a **Ghost Border**: `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Toolset Bar (The AI Anchor)
The standardized bar for actions like "Create with AI" should be treated as a "Global Utility." 
*   **Background:** `surface_container_highest` (#262626).
*   **Radius:** `xl` (0.75rem).
*   **Primary Action:** High-contrast `primary` background with `on_primary_fixed` (#180800) text.
*   **AI Sparkle:** Use a subtle `tertiary` (#ffe393) glow effect behind the icon to denote intelligence.

### Informative Cards
*   **Structure:** No dividers. Use `8` (2rem) padding scale.
*   **Icons:** Contained in a `secondary_container` (#474747) soft-square with `md` (0.375rem) roundedness.
*   **Content:** Pair a `title-lg` value with a `label-md` descriptor.

### Data Tables & Lists
*   **No Lines:** Forbid horizontal dividers. Use `surface-container-low` on hover states to define rows.
*   **Multi-Select:** Checkboxes must use `primary` when active, but `outline` at 30% when inactive to keep the table clean.
*   **Filter Chips:** Use `secondary_container` with `full` (9999px) radius. When active, transition to `primary_container` with `on_primary_container` text.

### Interactive Inputs
*   **State:** On focus, the "Ghost Border" transitions from 15% opacity to 100% `primary` (#ff9f4a). 
*   **Error:** Use `error` (#ff7351) text, but keep the input background `surface_container_highest` to avoid a "stop-light" effect.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `24` (6rem) spacing for major section breaks to allow the "Obsidian" background to breathe.
*   **Do** use `8-12px` (`lg` to `xl` scale) for all container corners to soften the brutalist dark mode.
*   **Do** use "surface-shifting" to indicate hierarchy—the more important the information, the lighter the surface container.

### Don't:
*   **Don't** use pure white (#ffffff) for long-form body text; use `secondary` (#e4e2e1) to reduce eye strain in dark mode.
*   **Don't** ever use a 1px solid border to separate list items. Use vertical rhythm (the Spacing Scale).
*   **Don't** use standard "drop shadows" on cards; let the color tiers do the heavy lifting.