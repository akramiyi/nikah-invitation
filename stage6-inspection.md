# Stage 6 — Countdown Section Inspection

## A. Background
- **Color:** Exact match to the Hero/Envelope dark green section (approx. `#0B3D2E`).
- **Texture/Pattern:** Solid dark green background, overlaid with subtle, softly glowing, randomly scattered small gold/yellow particle stars (similar to the animated stars in the Hero Section).
- **Height:** Approximate 100vh or large enough to cover the viewport when centered.
- **Spacing:** Substantial top and bottom padding (approx. 80px - 120px) keeping the countdown box vertically centered.

## B. Decorative Elements
1. **Top Crescent:** A small gold crescent moon (`#D2B471`) located at the top center, just above the "Until Our Nikah" text.
2. **Background Stars:** Small glowing particle stars scattered across the dark green background. They appear to be gently animated (twinkling/drifting), similar to the hero section.
3. **Corner Box Stars:** Four small, 4-pointed gold stars located exactly on the four corners of the main countdown border box.

## C. Typography
1. **Eyebrow Text:** `Until Our Nikah`
   - **Font:** `Cormorant Garamond` (Serif, Italic).
   - **Size:** Medium (approx. 24px - 28px).
   - **Color:** Gold (`#D2B471`).
2. **Subheading Text:** `COUNT DOWN`
   - **Font:** `Jost` or similar Sans-serif, Uppercase.
   - **Size:** Small (approx. 12px - 14px).
   - **Letter Spacing:** Very wide (approx. `4px` or `0.3em`).
   - **Color:** Gold (`#D2B471`).
3. **Bottom Note Text:** `Until our Nikah on Saturday, December 12, 2026 at 4:00 PM.`
   - **Font:** `Jost` (Sans-serif).
   - **Size:** Very small (approx. 12px).
   - **Color:** Light cream / White.
4. **Bottom Decorative Text:** `إن شاء الله` (Insha'Allah)
   - **Font:** Arabic script (`Amiri` or similar).
   - **Size:** Medium-small.
   - **Color:** Gold (`#D2B471`).

## D. Countdown Structure
The countdown is displayed as a single, wide, centered, bordered horizontal rectangle containing 4 units:
`DAYS` | `HOURS` | `MIN` | `SEC`

For each unit:
- **Number Font:** `Cormorant Garamond` (Serif).
- **Number Size:** Large (approx. 48px - 56px).
- **Number Color:** Light cream / Gold.
- **Label Text:** `DAYS`, `HOURS`, `MIN`, `SEC`
- **Label Font:** `Jost` (Sans-serif, Uppercase).
- **Label Size:** Small (approx. 10px - 12px).
- **Label Spacing:** Wide letter spacing.
- **Label Color:** Gold.
- **Alignment:** Stacked vertically (Number on top, Label below), perfectly centered within their column.

## E. Dividers
- **Outer Frame:** A thin gold rectangular border (`1px` solid, `#D2B471`) wraps all 4 countdown units.
- **Vertical Separators:** 3 thin, vertical gold lines (`1px` width) separate the 4 units (`DAYS | HOURS | MIN | SEC`). They span most of the height of the outer frame, with small padding at top and bottom.
- **No horizontal dividers** exist inside the box.

## F. Animation Sequence
Based on the visual language of the site and previous sections:
1. As the dark green background enters the viewport, the particle stars are already active (continuous background animation).
2. The Top Crescent, "Until Our Nikah", and "COUNT DOWN" fade in and slide up (`y: 20` -> `0`, `opacity: 0` -> `1`).
3. The main bordered countdown box (with corner stars) fades in.
4. The vertical dividers fade in.
5. The numbers and labels (DAYS, HOURS, MIN, SEC) fade in and slide up with a stagger effect (`stagger: 0.1s`).
6. Finally, the bottom text ("Until our Nikah on...") and the Arabic text fade in.

## G. Timing (Approximate)
- **Duration:** Elements fade in over `0.8s - 1.0s`.
- **Delay:** Sequence starts shortly after the section enters the viewport (approx. `0.2s` delay).
- **Stagger:** Inner text elements stagger at approx. `0.1s - 0.2s`.
- **Easing:** `power2.out` or similar smooth deceleration.

## H. ScrollTrigger Behavior
- **Start:** Triggered when the section top reaches approximately `75%` or `80%` of the viewport (`start: 'top 75%'`).
- **Once:** The entry animation plays exactly once (`once: true`). It does not reverse when scrolling back up.
- **Content:** Remains fully visible after the animation completes.

## I. Live Countdown Behavior
- **Type:** REAL LIVE COUNTDOWN.
- **Evidence:** The seconds digit is actively changing in the video (e.g., from `21` to `20` while the frame advances).
- **Target Date:** As listed in the bottom text: `Saturday, December 12, 2026 at 4:00 PM`.

## J. Final State
After all animations:
- The section sits prominently with a dark green background.
- At top center: Gold crescent, "Until Our Nikah", "COUNT DOWN".
- Center: A wide gold-bordered rectangle housing 4 live-updating numbers separated by 3 vertical gold lines. Small gold stars adorn the 4 corners of the border.
- Bottom center: "Until our Nikah on Saturday, December 12, 2026 at 4:00 PM." followed by "إن شاء الله".

## K. Desktop
- **Layout:** The 4 countdown units sit side-by-side horizontally in a single row. The box is wide and elegant.
- **Spacing:** Ample padding around the countdown box and between the text sections.

## L. Mobile (Approximate/Extrapolated)
- Given the horizontal nature of the 4 units, on mobile, the box will likely either:
  - Shrink the text sizes significantly to fit 4 across.
  - Or wrap into a 2x2 grid (DAYS HOURS over MIN SEC) with appropriate border adjustments. (Based on common responsive patterns for this design, a smaller font size retaining the 1x4 row or a 2x2 grid is standard).
