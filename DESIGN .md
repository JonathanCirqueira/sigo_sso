# Design System Strategy: The Architectural Monolith

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Architectural Monolith**. 

Moving away from the cluttered, "boxed-in" feel of traditional corporate portals, this system treats the user interface as a physical space carved from light and stone. It is a high-end editorial take on the "Single Sign-On" experience, prioritizing focus, security, and quiet authority. By leveraging the `Inter` typeface and a slate-heavy palette, we achieve a look that isn't just "minimalist"—it’s intentional. 

We break the "template" look through **intentional white space** and **tonal layering**. Instead of defining edges with lines, we define them with light and depth, creating a signature aesthetic that feels bespoke and premium.

---

## 2. Colors: Tonal Architecture
The palette is rooted in the "Slate" and "Zinc" families, utilizing the Material Design convention for semantic clarity.

### The "No-Line" Rule
**Designers are prohibited from using 1px solid borders for sectioning.** 
Standard UI relies on lines to tell the eye where one thing ends and another begins. This system relies on **Surface Shifts**. To separate a sidebar from a main content area, do not draw a line; instead, place a `surface-container-low` section against a `surface` background.

### Surface Hierarchy & Nesting
Use the `surface-container` tiers to create a "stacked paper" effect:
- **Base Layer:** `surface` (#f7f9fb) – The desk.
- **Section Layer:** `surface-container-low` (#f0f4f7) – The mat.
- **Interaction Layer:** `surface-container-lowest` (#ffffff) – The active sheet (typically used for Cards or Inputs).

### The "Glass & Gradient" Rule
To elevate the "Corporate" look into "High-End," use **Glassmorphism** for floating overlays (like Modals or Dropdowns). 
- Use a background of `surface_container_lowest` at 80% opacity with a `backdrop-blur` of 12px.
- **Signature Texture:** For primary CTAs, apply a subtle linear gradient from `primary` (#5f5e61) to `primary_dim` (#535255). This prevents buttons from looking "flat" and adds a metallic, premium sheen.

---

## 3. Typography: The Editorial Grid
Typography is the primary vehicle for the brand’s authority. We use `Inter` for its neutral, Swiss-inspired clarity.

*   **Display (lg/md/sm):** Reserved for "Hero" moments in the login flow. Use `display-md` (2.75rem) for "Welcome Back" prompts to create a bold, editorial focal point.
*   **Headline & Title:** Use `headline-sm` (1.5rem) for card headers. The tight tracking and slightly reduced line height give it a "News" authority.
*   **Body:** `body-md` (0.875rem) is our workhorse. Ensure a line height of 1.5 to maintain readability in dense corporate documentation.
*   **Labels:** `label-md` (0.75rem) should always be in `on_surface_variant` (#566166) to create a clear hierarchy between metadata and primary content.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "presence."

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card sitting on a `surface-container-low` background creates a natural, soft lift.
*   **Ambient Shadows:** If an element must float (e.g., a Profile Avatar menu), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(42, 52, 57, 0.06);`. The shadow color is derived from `on_surface`, not pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use a **Ghost Border**. Apply `outline_variant` (#a9b4b9) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use `surface_variant` at 40% opacity with a high blur for tooltips and hover-state overlays to keep the interface feeling airy.

---

## 5. Components: Refined Primitives

### Buttons
- **Primary:** Gradient from `primary` to `primary_dim`. Text in `on_primary`. Radius set to `md` (0.375rem).
- **Secondary:** Surface shift approach. Background: `secondary_container`; Text: `on_secondary_container`. No border.
- **Tertiary:** Ghost style. No background or border. Use `title-sm` typography for a professional, understated look.

### Input Fields
- **Default State:** Background `surface_container_lowest`. Ghost Border (15% opacity `outline_variant`). 
- **Focus State:** Increase border opacity to 100% `primary` and add a 2px outer glow of `primary_fixed_dim` at 30% opacity.

### Cards
- **Construction:** Use `surface_container_lowest` for the card body. 
- **Strict Rule:** Forbid divider lines between Header, Body, and Footer. Use vertical white space (e.g., `32px` padding) to define sections.

### Avatars
- Always use the `xl` (0.75rem) or `full` (9999px) roundedness. 
- Use a `surface_variant` background for initials to maintain the soft-gray corporate aesthetic.

### Additional Signature Component: The "Contextual Breadcrumb"
Instead of standard breadcrumbs, use a "Title-sm" label paired with a "Body-sm" description to give users a sense of place within the SSO hierarchy without adding visual clutter.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use whitespace as a structural element. If a design feels crowded, increase the padding, don't add a line.
*   **DO** use `surface_container_high` for hover states on list items.
*   **DO** ensure dark mode transitions use the same tonal layering principles, shifting the `surface` tokens to their dark counterparts.

### Don't:
*   **DON'T** use high-contrast borders (e.g., solid black or slate-900) for anything other than active input focus.
*   **DON'T** use pure black (#000000) for text. Use `on_surface` (#2a3439) to maintain a soft, high-end optical balance.
*   **DON'T** use standard "Drop Shadows." If it looks like a 2010 web app, the blur value isn't high enough.