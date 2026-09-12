# Stage 5 — Wedding Events Deep Inspection

## A. Section dimensions
- **Background Color:** Light Cream / Ivory (`#FAF7F2` or `#F9F6F0`). Note: It is not dark green.
- **Section Height:** Auto/Dynamic (depends on the stacked height of the cards).
- **Section Spacing:** APPROXIMATE `100px` to `120px` top and bottom padding.

## B. Typography
- **Subheading (Eyebrow):** "CELEBRATING TOGETHER"
  - Font family: `Jost` or similar sans-serif.
  - Font size: APPROXIMATE `11px` to `12px`.
  - Color: Muted Gold (`#B89758` or `#D2B471`).
  - Letter spacing: Wide (`0.2em`).
- **Main Heading:** "Wedding Events"
  - Font family: `Cormorant Garamond` (or similar classic serif).
  - Font size: APPROXIMATE `41.6px` to `48px`.
  - Weight: `400` (Regular).
  - Color: Dark Forest / Emerald Green (`#1C3D2E` or `#0B3D2E`).
  - Letter spacing: Normal/`0`.
- **Decorative elements:** A subtle horizontal golden line with a central diamond/oval emblem directly beneath the main heading.

## C. Timeline measurements
- **Timeline structure:** A central vertical line running down the middle of the container.
- **Timeline line width:** `1px` or `2px`.
- **Timeline line color:** Muted Gold.
- **Timeline position:** Absolute center (`left: 50%`, `transform: translateX(-50%)`).
- **Timeline dots/circles:** At each event step, there is a central node: a small square/diamond with a gold star icon (`★`) inside.
- **Dot dimensions:** APPROXIMATE `24px x 24px` to `30px x 30px`.
- **Dot colors:** Gold outline with a subtle golden glow/shadow.

## D. Card measurements
- **Number of event cards:** 4
  1. Mangni (10 DEC)
  2. Mehendi (11 DEC)
  3. Nikah (12 DEC)
  4. Walima (12 DEC)
- **Event card width:** APPROXIMATE `360px` to `420px`.
- **Event card height:** Auto (scales based on content).
- **Card background:** Light off-white/cream with subtle drop-shadow elevation.
- **Card border:** Thin golden outline (`1px solid rgba(210, 180, 113, 0.4)`).
- **Card border thickness:** `1px`.
- **Card radius:** APPROXIMATE `4px` or sharp `0px`.
- **Card padding:** APPROXIMATE `24px` to `32px`.
- **Decorative Corners:** L-shaped golden brackets (`┌` and `┘`) at the top-left and bottom-right corners.
- **Card position relative to timeline:** Set back slightly from the center line.
- **Left/right alternating structure:**
  - Card 01: Left
  - Card 02: Right
  - Card 03: Left
  - Card 04: Right
- **All gaps between cards:** APPROXIMATE `60px` to `80px` vertical spacing/overlap.

## E. Icon & Content Details
- **Top Badge:** Small circled number badge (`01`, `02`) in gold followed by the uppercase date/time string (`10 DECEMBER · 6:00 PM`).
- **Event title typography:** Large dark green serif text (e.g., "Mangni").
- **Urdu text:** Golden calligraphic script placed next to the English name.
- **Subtitle:** Italicized serif describing the event (e.g., *Engagement*).
- **Venue / Supporting text:** Small clean sans-serif font at the bottom.

## F. Desktop layout
- The central timeline divides the screen at 50%. Cards alternate left and right, occupying roughly 40%-45% of the width on their respective sides.

## G. Mobile layout
- **APPROXIMATE:** On narrow mobile screens, the alternating layout typically collapses. The central timeline shifts to the far left (e.g., `left: 20px`), and all cards stack on the right side, expanding to full available width.

## H. Animation sequence
- **Trigger:** Triggered when the section enters the viewport (ScrollTrigger).
- **Play Behavior:** Plays once (`once: true`) and does not reverse.
- **Sequence Observed:**
  1. Section enters viewport.
  2. Main heading and subheading fade + slide up.
  3. The vertical timeline line begins to draw downward (scaleY grows from top to bottom).
  4. As the line reaches the vertical position of an event, the corresponding central diamond node fades in.
  5. The event card fades and slides into position (fade + transform up/in).
  6. This repeats sequentially for Card 01, Card 02, Card 03, and Card 04.

## I. Animation timing
- **Line growth:** Continuous draw-down synced with scroll or with a set duration (APPROXIMATE `1.5s` to `2s`).
- **Card animation:** Fade + translate (opacity 0 -> 1, y: 30 -> 0).
- **Duration:** APPROXIMATE `0.8s` to `1s` per card.
- **Stagger delay:** APPROXIMATE `0.3s` to `0.4s` between each card appearance.
- **Easing style:** `power2.out` or `power3.out`.

## J. Scroll trigger behavior
- The animation begins when the top of the section reaches approximately `75%` to `80%` of the viewport height.

## K. Final settled state
- All elements remain fully visible (opacity `1`, transform `0`). The section does not flicker, and cards maintain their alternating left/right positions.
