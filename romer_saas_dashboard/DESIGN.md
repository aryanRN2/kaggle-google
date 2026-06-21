---
name: Cinematic Precision
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c6c5d8'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#8f8fa1'
  outline-variant: '#454655'
  surface-tint: '#bec2ff'
  primary: '#bec2ff'
  on-primary: '#000ba6'
  primary-container: '#7a85ff'
  on-primary-container: '#000992'
  inverse-primary: '#3d4ae0'
  secondary: '#50d8e9'
  on-secondary: '#00363c'
  secondary-container: '#00b1c2'
  on-secondary-container: '#003e44'
  tertiary: '#ffb689'
  on-tertiary: '#512300'
  tertiary-container: '#e0731d'
  on-tertiary-container: '#471e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bec2ff'
  on-primary-fixed: '#000469'
  on-primary-fixed-variant: '#1f2bc8'
  secondary-fixed: '#92f1ff'
  secondary-fixed-dim: '#50d8e9'
  on-secondary-fixed: '#001f23'
  on-secondary-fixed-variant: '#004f57'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#ffb689'
  on-tertiary-fixed: '#311300'
  on-tertiary-fixed-variant: '#743500'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  h1:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '520'
    lineHeight: '1.1'
    letterSpacing: -0.05em
  h2:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '520'
    lineHeight: '1.2'
    letterSpacing: -0.05em
  h3:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '520'
    lineHeight: '1.2'
    letterSpacing: -0.04em
  h4:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '520'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  mono-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1'
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 20px
  margin-safe: 32px
---

## Brand & Style

This design system is engineered for high-stakes business operations, evoking a sense of "quiet command." It leans heavily into a **Modern Minimalist** aesthetic with **Glassmorphism** influences, prioritizing deep focus and visual calmness. The brand personality is authoritative yet understated—think of a high-end physical watch or a premium automotive cockpit.

The emotional response should be one of absolute control and clarity. Surfaces are dark and expansive, allowing data to emerge through thin lines and precise typography. The "quietly futuristic" atmosphere is achieved through low-contrast layers and dense, meticulously aligned UI details that reward close inspection without overwhelming the peripheral vision.

## Colors

The palette is rooted in a "Deep Space" spectrum. The background hierarchy utilizes subtle shifts in hex values rather than heavy shadows to denote structure. 

- **Primary Canvas:** Use `#070708` for the global background and `#080809` for primary content sections.
- **Layering:** Panels (`#101112` through `#191A1C`) should be used to create logical grouping.
- **Accents:** Use accent colors sparingly. They are reserved for status indicators, active states, and data visualization. 
- **Interactive States:** Hover states should generally involve a slight shift in background panel depth rather than a color change, keeping the interface feeling tactile but grounded.

## Typography

Typography is the primary vehicle for the "enterprise-grade" feel. **Manrope** provides a refined, technical geometricity for headings, while **Inter** ensures maximum legibility for dense operational data.

- **Weight Precision:** Headings must strictly use the 520 weight to achieve the custom "optical" balance between Medium and Semibold.
- **Tracking:** Negative letter-spacing on headings is essential to maintain the cinematic, high-density look.
- **Data Display:** For numerical values in dashboards, use `mono-data` (Inter with tabular lining figures) to ensure columns align perfectly in tables and lists.

## Layout & Spacing

This design system employs a **Fluid Grid** with fixed-width gutters to maintain "spacious precision." 

- **Grid:** 12-column layout for desktop. Use a 20px gutter (`gutter`) to allow elements enough "air" to breathe against the dark background.
- **Density:** While the layout is spacious, internal component padding should be tight to reflect a "dense UI" aesthetic. Use `8px` and `12px` for internal element spacing.
- **Rhythm:** All vertical spacing should be multiples of the `4px` base unit. Large section breaks should favor `40px` or `64px` to emphasize the cinematic scale.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines** rather than traditional drop shadows.

- **The Layering Rule:** Higher elevation is represented by lighter hex values (e.g., a modal uses `#191A1C` against a `#080809` background).
- **Dividers:** Use 1px solid lines (`#1B1C1E`) for internal component divisions. Use `#232426` for primary structural borders.
- **Glass Effects:** For floating menus or overlays, apply a `20px` background blur with 80% opacity on the panel color. 
- **Inner Glow:** High-priority cards may use a 1px top-border "shimmer" (10% white) to simulate a light source hitting a physical edge.

## Shapes

The shape language is "Soft-Mechanical." Corners are tight and professional, avoiding the playfulness of large radii.

- **Base Radius:** 4px (`0.25rem`) for inputs, buttons, and small widgets.
- **Container Radius:** 8px for cards and primary panels.
- **Interactive Elements:** Maintain consistent corner radii across all input types to ensure the "precise" brand feel.

## Components

### Buttons
- **Primary:** Background `#5E6BFF`, Text `#F0F1F2`, 4px radius. No gradients.
- **Secondary:** Transparent background, 1px border `#232426`, Text `#F0F1F2`.
- **Ghost:** Transparent background, Text `#9A9DA3`.

### Inputs & Fields
- **Styling:** Background `#101112`, 1px border `#1B1C1E`, 4px radius. 
- **Focus State:** 1px border `#5E6BFF` with a subtle 2px outer glow of the same color at 20% opacity.

### Data Panels (Cards)
- Background `#101112` or `#151617`. Use a 1px header divider (`#1B1C1E`) to separate the title area from the content.

### Status Accents
- Tiny 6px circular indicators using the accent palette (Green for 'Active', Red for 'Critical'). These should be the only "bright" elements on the screen.

### Lists & Tables
- High-density rows (32px or 40px height). 1px bottom border `#1B1C1E`. Hover state uses background `#151617`.

### Additional Elements
- **Segmented Controllers:** Use a "sunken" track (`#070708`) with a "raised" active segment (`#191A1C`).
- **KPI Indicators:** Large Manrope 520 typography with a small sparkline using an accent color.