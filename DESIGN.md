---
name: Vibe Coding System
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#bdc7d9'
  on-secondary: '#27313f'
  secondary-container: '#404a59'
  on-secondary-container: '#afb9cb'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d9e3f6'
  secondary-fixed-dim: '#bdc7d9'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4756'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
  canvas: '#0B0F19'
  surface-panel: '#121827'
  surface-active: '#1F2937'
  border-subtle: '#2D3748'
  text-primary: '#F9FAFB'
  text-secondary: '#9CA3AF'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 21px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.02em
  section-header:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 17px
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 15px
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 15px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 240px
  navbar-height: 48px
  gutter: 1rem
  panel-padding: 1.25rem
  compact-gap: 0.5rem
---

## Brand & Style

The brand personality is clinical, precise, and utilitarian, designed specifically for high-velocity "Vibe Coding" where speed and clarity are paramount. The target audience is developers who value high-density information environments that minimize cognitive load. The UI should evoke a sense of focused calm, similar to high-end IDEs or command-line interfaces.

The design style is **Minimalist / Corporate Modern**, leaning heavily into a "Flat UI" paradigm. It eschews decorative elements in favor of functional geometry, crisp 1px borders, and high-contrast typography. The aesthetic mimics industry-standard tools like Linear or Cursor, where the software recedes into the background to prioritize the user's workflow and the AI's output.

## Colors

The system uses a **dark-mode-first deep slate palette**. The foundation is built on levels of gray to establish hierarchy without relying on color.

- **Primary:** A surgical blue (#3B82F6) reserved strictly for tactical actions, active focus rings, and primary execution buttons.
- **Backgrounds:** A layered system starting from the absolute base Canvas (#0B0F19), progressing to Panel surfaces (#121827), and finally Active/Hover states (#1F2937).
- **Separation:** All structural division is handled by a crisp #2D3748 border rather than drop shadows or varied color blocks.
- **Typography:** Text remains highly legible with an off-white primary (#F9FAFB) and a muted slate (#9CA3AF) for secondary information like timestamps, file paths, and muted logs.

## Typography

Typography is divided into two functional streams: **Inter** for the interface shell and **JetBrains Mono** for all technical and AI-generated content.

- **UI Stream:** Uses Inter with tight tracking (-0.01em to -0.02em) for headers to maintain a compact, "pro" feel. Sizes are kept small to allow for high-density layouts typical of developer tools.
- **Code Stream:** Uses JetBrains Mono for all logic, code snippets, and terminal outputs. This ensures clear character differentiation (e.g., 0 vs O, l vs 1) essential for debugging.
- **Hierarchy:** Contrast is achieved through weight (Semi-Bold for headers) and color (Secondary Slate for captions) rather than significant jumps in font size.

## Layout & Spacing

The layout is a **fixed-sidebar fluid-content grid** optimized for widescreen desktop development. 

- **Structure:** A 3-column layout consisting of a fixed 240px Sidebar (left), a flexible Chat Pane (center), and a flexible Preview/Code Pane (right).
- **Navigation:** A rigid 48px top navigation bar anchors the global search and project controls.
- **Rhythm:** Uses a tight spacing model to maximize on-screen content. Most internal panel padding is set to 20px (1.25rem), while interactive element gaps (buttons in a group, sidebar items) use a compact 8px (0.5rem) rhythm.
- **Responsive Behavior:** Below 1024px, the sidebar collapses into a drawer, and the split view transitions into a tabbed interface to maintain legibility of code blocks.

## Elevation & Depth

This system utilizes a **Flat / Tonal Layering** approach. Visual hierarchy is established through surface color shifts and 1px borders rather than shadows.

- **Surfaces:** Depth is suggested by lightness; the further "back" an element is, the darker the hex code (#0B0F19). Foreground elements like the chat input or active tabs use #1F2937.
- **Borders:** A consistent 1px solid border (#2D3748) is the primary method of separation between panes, sidebar items, and header sections.
- **Shadows:** Explicitly reserved for **Command Palettes** and floating menus only. These should use a deep, diffused shadow: `0 10px 25px -5px rgba(0, 0, 0, 0.5)`.
- **Focus:** Active states are signaled by a 1px border highlight using the primary accent blue, rather than an outer glow.

## Shapes

The shape language is **Sharp and Technical**. The design system favors a "Squircle-lite" aesthetic that feels modern but retains a disciplined, professional edge.

- **Standard Elements:** Buttons, input fields, and tags use a consistent 6px radius.
- **Container Elements:** Larger structural panels, such as the preview frame or chat container, use an 8px radius to provide a subtle visual "softness" to the larger layout blocks.
- **Interaction:** Hover states should maintain these radii exactly; do not use "pill" shapes for buttons unless specifically indicating a status badge.

## Components

- **Buttons:** Primary buttons use a solid blue background (#3B82F6) with white text. Secondary buttons use a ghost style with #2D3748 borders and #F9FAFB text. Corner radius: 6px.
- **Input Fields:** Background: #1F2937; Border: #2D3748. On focus, the border shifts to #3B82F6. Use JetBrains Mono for the prompt input text.
- **Chips / Badges:** Small, low-contrast capsules used for file types or Git branches. Background: #1F2937; Text: #9CA3AF; 6px radius.
- **Cards / Panels:** Use #121827 as the base surface with a 1px #2D3748 border and 8px radius. No shadows.
- **Chat Blocks:** Messages should be treated as clean text blocks. AI responses use a slightly different background tint or a left-border accent to distinguish from user prompts.
- **Status Indicators:** Use a simple 8px circle. 
    - *Idle:* #9CA3AF.
    - *Thinking:* #3B82F6 with a slow pulse animation.
    - *Executing:* Subtle 2px linear progress bar at the very top of the active pane.