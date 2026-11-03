---
name: Alfath — Flat/Bold Portfolio
description: A typography-led portfolio where saturated color blocks frame practical web work.
colors:
  ink: "#121212"
  paper: "#FFFFFF"
  cobalt: "#2440FF"
  signal: "#FF5B26"
  sunflower: "#FFC53D"
  inkMuted: "oklch(38% 0 0)"
  paperMuted: "oklch(82% 0 0)"
  paperLine: "oklch(78% 0 0)"
typography:
  display:
    fontFamily: "Clash Display, Arial Black, sans-serif"
    fontSize: "clamp(3.5rem, 11vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Switzer, Arial, sans-serif"
    fontSize: "clamp(1rem, 1.4vw, 1.125rem)"
    fontWeight: 450
    lineHeight: 1.55
  label:
    fontFamily: "Fragment Mono, Courier New, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  control: "999px"
  inset: "8px"
  row: "10px"
  panel: "12px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "48px"
  xl: "clamp(72px, 10vw, 144px)"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.sunflower}"
    textColor: "{colors.ink}"
  project-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 5vw, 64px)"
---

# Design System: Alfath — Flat/Bold Portfolio

## Overview

**Creative North Star: "A Kinetic Screenprint"**

The system should feel like a crisply registered screenprint brought to life: decisive blocks of cobalt, signal orange, ink, white, and one small sunflower highlight; blunt typography; and movement that has a clear start and stop. A recruiter scanning on a laptop in ordinary office light should encounter high contrast, quick orientation, and one memorable change of axis.

This is not a sci-fi dashboard, a paper dossier, or a generic SaaS landing page. It is a single-page narrative with optional project and credential-detail overlays. The hero carries the main choreography while the remaining sections are stable, readable, and intentionally quiet.

**Key Characteristics:**

- Full-width flat color fields with no gradients or decorative shadows.
- Large display type constrained to a 6rem ceiling and balanced at every viewport.
- A 4:5 paper portrait plate with a signal-orange offset layer in the hero.
- One compact asymmetric project mosaic that fits within a desktop viewport and collapses in reading order on smaller screens.
- Plain first-person copy that introduces the person before the proof.

## Colors

The palette uses a committed full-color strategy: each section owns one solid field, while sunflower remains a rare functional highlight.

### Primary

- **Electric Cobalt:** The hero, contact field, and primary brand signal.

### Secondary

- **Signal Orange:** The project mosaic, active interactions, and high-energy transitions.

### Tertiary

- **Sunflower Marker:** Tags, status markers, and small emphasis only; never a full section.

### Neutral

- **Registration Ink:** Primary copy, borders, and dark-section fields.
- **Clean Paper:** Base field and inverse text.

### Named Rules

**The One-Field Rule.** Every section uses exactly one solid background; structure comes from contrast and type scale.

**The Sunflower Ration.** Sunflower marks information in small doses and never competes with cobalt or signal orange.

## Typography

**Display Font:** Clash Display (with Arial Black fallback)  
**Body Font:** Switzer (with Arial fallback)  
**Label/Mono Font:** Fragment Mono (with Courier New fallback)

**Character:** Clash Display supplies wide, poster-like impact while Switzer stays neutral and readable. Fragment Mono appears only where metadata is useful; it is not shorthand for a developer aesthetic.

### Hierarchy

- **Display** (600, `clamp(3.5rem, 11vw, 6rem)`, 0.88): Hero and project names only, with letter spacing no tighter than -0.035em.
- **Headline** (600, `clamp(2.4rem, 6vw, 5rem)`, 0.95): Major section statements.
- **Title** (600, `clamp(1.5rem, 3vw, 2.5rem)`, 1): Timeline and supporting project titles.
- **Body** (450, `clamp(1rem, 1.4vw, 1.125rem)`, 1.55): Supporting copy capped at 68 characters per line.
- **Label** (400, 0.75rem, 0.04em): Navigation, tags, case numbers, and timestamps; uppercase is limited to short labels.

### Named Rules

**The Wide-Jump Rule.** Commit to clear scale changes instead of filling the hierarchy with indistinct middle sizes.

## Elevation

This system is flat. It uses no drop shadows, glass layers, or gradient depth. Section color, solid 1–2px borders, cropping, and asymmetric scale create hierarchy.

### Named Rules

**The Flat Means Flat Rule.** If an element needs a soft shadow to separate from its field, fix the color, spacing, or border instead.

## Components

### Buttons

- **Shape:** Full-pill controls reserved for actions (999px radius).
- **Primary:** Signal orange on ink or cobalt fields with compact label typography and 14px × 22px padding.
- **Hover / Focus:** Swap to sunflower, translate by at most 2px, and show a 3px high-contrast outline on keyboard focus.
- **Ghost:** Transparent with a solid current-color border; never paired with a shadow.

### Chips

- **Style:** Rounded skill tags use a dark outlined face over a group-colored base for languages, databases, and tools.
- **State:** The face lifts five pixels with less than one degree of rotation, revealing the colored lower indent. The whole tag follows with a smaller lift and a smooth exponential ease. Reduced-motion users receive the final state without travel.

### Hero Portrait

- **Shape:** A 4:5 paper frame with a 12px corner radius, ink border, and offset signal-orange plate.
- **Empty state:** The AP monogram keeps the frame intentional until a casual portrait is supplied.
- **Photo state:** Replace the monogram area with a cover-fit portrait while preserving the frame, caption, and responsive sizing.

### Hero Message

The first-person introduction belongs directly beneath the display headline rather than in the upper metadata row. It aligns with the headline’s offset rhythm, stays under 46 characters per line, and uses sunflower weight emphasis only on “Informatics Engineering graduate.” On mobile it returns to the left edge and remains part of the same text block.

### Cards / Containers

- **Corner Style:** Compact rounding only (12px maximum).
- **Background:** One palette token per container.
- **Shadow Strategy:** None.
- **Border:** Solid ink borders where an edge needs definition.
- **Internal Padding:** Fluid from 24px to 64px.

### Navigation

Desktop navigation begins as one compact floating command bar centered 16px below the viewport edge. Its ink shell uses a dark one-pixel edge, subtle underlight, and a 12px radius. The AP mark and five section links share one horizontal grid. Each link pairs its label with the same line icon used in the right-side rail. One signal-orange inset travels between links with a short liquid stretch as the viewed section changes.

A four-pixel page-progress track is independent of the navigation and remains fixed at the absolute top on every viewport. Its sunflower fill scales horizontally with document progress and keeps a one-pixel ink edge for definition over every section color.

The horizontal shell remains fully visible throughout the hero. When the hero’s bottom edge crosses the viewport top, one ScrollTrigger-controlled timeline sends the command bar upward while a fixed right-edge icon rail rises into place with a 180ms overlap. Reversing across the same boundary reverses the transition. The rail stays visible for the rest of the page and uses the same active section state, rendered as a circular orange marker that stretches vertically between icons before settling.

Below 768px the desktop command bar and icon rail are replaced by one matching floating shell that contains the AP mark and menu control. It follows the same scroll-direction visibility rule. Opening the menu locks page scroll, keeps the shell visible, moves focus to the first icon-and-label link, traps keyboard focus within the menu, and supports Escape with focus restoration. The full-screen list uses compact rounded rows with hairline borders and the same signal-orange active state.

### Project Mosaic

On desktop, one signal-orange viewport contains a 12-column mosaic. The lead project spans seven columns and two rows, two compact projects stack beside it, and three short tiles complete the lower band. Only the lead tile shows its description and tags because every tile opens a details modal. The section briefly pins while the panels travel from six diagonal starting positions into the final level mosaic. Tablet uses two columns with the lead tile spanning both, and mobile becomes a compact single-column list without pinning.

### Credential Documents

Education and credential evidence appears as bordered rows rather than a card grid. Selecting a row first opens a concise details modal with issuer, date, serial or verification method, and context. The degree is details-only and does not expose a PDF action. Credential PDF viewers are a deliberate second step and always include back, close, and new-tab controls. Public copies of identity-bearing credential documents must redact sensitive personal fields while preserving useful details.

### Motion System

- The hero owns the signature entrance: navigation, supporting copy, headline words, portrait plate, and footer arrive as one short GSAP timeline.
- Hero content separates into opposing typographic and portrait layers as the reader leaves the opening viewport.
- About traces its timeline from top to bottom while story stops, copy, and facts lock into place.
- Skills behaves like an assembling system: its calibration field drifts, introductions arrive from the left, and tool bands settle from the right.
- Work is the single desktop-only pinned centerpiece. Six project panels assemble into the mosaic over 140% of one viewport; tablet and mobile receive the same sequence without pinning and with shorter travel.
- Education reads like a document ledger: the rule draws, education sheets hinge into place, and credential rows are indexed with diagonal wipes.
- Contact is the closing convergence: the two headline lines arrive from opposite directions, straighten, then hand off to the actions and footer rule.
- Navigation and in-page links use a deliberate 1.6-second Lenis scroll with a sine ease-in/ease-out and a fixed-header offset. Reduced mode jumps directly to destinations and replaces spatial scenes with opacity-led reveals.
- The navigation shell and right rail share one hero-boundary timeline. Their entrances overlap so navigation is always represented. Both active insets travel between measured section-link positions over 640ms with a liquid midpoint; reduced mode keeps a short crossfade without vertical travel. The independent top progress line follows document position without layout work.
- Project content, credential rows, and compact controls retain restrained hover feedback on layers separate from scroll-owned transforms.
- Native project and document dialogs use slow, toon-inspired GSAP timelines: a restrained squash-and-settle entrance, staggered content, and a soft exit. Switching between document details and the PDF viewer is animated as a state transition.
- Each section owns one top-level scrub timeline; Work owns the only pin. Animations use transforms, opacity, small text masks, measured stagger, and scoped cleanup. ScrollTrigger refreshes once fonts settle.
- The authored full-motion experience is always active and the navigation does not expose a Full/System/Reduced control.

## Do's and Don'ts

### Do:

- **Do** use exactly one of paper, ink, cobalt, or signal orange as each section background.
- **Do** lead with the Online Gambling Ad Blocker as the strongest evidence.
- **Do** keep body copy under 68 characters per line and body text at or above 4.5:1 contrast.
- **Do** make reduced-motion behavior a structural fallback, not merely a slower animation.
- **Do** show credential metadata before loading its PDF and use redacted public copies where needed.

### Don't:

- **Don't** use sci-fi dashboards, neon developer terminals, or generic SaaS interfaces.
- **Don't** use paper, dossier, scrapbook, or faux-editorial portfolio treatments.
- **Don't** use gradients, soft shadows, glassmorphism, or decorative grid backgrounds.
- **Don't** leave project tiles tilted after assembly or pin any section other than the short Work centerpiece.
- **Don't** repeat tiny uppercase eyebrows or numbered markers as generic section scaffolding.
- **Don't** use side-stripe borders, gradient text, or cards rounded beyond 16px.
