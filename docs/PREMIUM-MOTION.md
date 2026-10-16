# Premium motion, original imagery and dark mode

Implemented on `feat/premium-motion-dark-mode`. These changes have not been pushed to main or deployed to production.

## Design and interaction plan

1. Retain Ark Builders' navy/amber identity and existing public content. Introduce self-hosted Manrope typography, more dimensional surfaces, restrained highlights and an original architectural hero artwork.
2. Give interactive controls consistent hover, keyboard-focus and pressed states. Use 160 ms for direct feedback, around 280 ms for controls and around 480 ms for scene transitions, with a shared easing curve.
3. Use HTML/CSS for button sheen, arrow movement, navigation underlines, card lift, mobile menus, native FAQ opening, form feedback and native cross-document View Transitions. Normal links still work where the View Transitions API is unavailable. Navigation is not intercepted or delayed by JavaScript.
4. Add Light/Dark/System appearance choices, apply the saved theme before React and styles paint, remember the choice locally, and follow OS changes in System mode. The control supports native radio keyboard navigation, Escape, outside click and focus leaving the panel. Storage failures fall back gracefully to a per-page preference.
5. Add original SVG diagrams and short connection animations. Decorative animations complete within 3.5 seconds; nothing spins indefinitely. Small JavaScript hooks coordinate pressed feedback and once-per-entry transforms; content stays visible even without the hook or IntersectionObserver.
6. Validate all public pages in both themes, mobile layout and interactions, reduced motion, no-flash startup, optional storage, and local performance budgets. Keep the existing WhatsApp enquiry and content evidence boundaries.

## References and tool use

The user supplied [morluto/rea](https://github.com/morluto/rea), a reverse-engineering and browser-observation toolkit. Its README and browser-observation documentation were reviewed. REA 6.5.0 was run through its official npm CLI against a dedicated, locally started Chromium profile before and after the change. No global agent configuration, MCP registration or application dependency was added.

See [REA observation summary](artwork/rea-observation.json) for the actual capture IDs, bounded DOM/accessibility observations and limitations. Inspection proves the observed structure, not design quality or complete runtime history. The optional comparison command rejected the supplied passive capture formats; no successful comparison is claimed. Functional validation uses the application's Playwright suite.

Dribbble's homepage rejected automated access with HTTP 403, and no specific shot was supplied. No Dribbble design, screenshot or proprietary source is represented as inspected or copied. The result follows the proposed Ark Builders art direction.

## Artwork and font provenance

- **Architectural hero:** created with the image-generation tool for this task. The prompt requested interlocking midnight-navy metal arches, warm amber edges, a connected golden path, restrained studio light and no words, people, client logos or interface claims. This is brand artwork, not a delivered-project screenshot or a replacement logo.
- Original generated PNG remains in `/workspace/generated_images/exec-ab7ca0b1-5868-4811-878f-4c5f3f0b2d23.png`. Production uses optimized 480 px and 960 px WebP files under `public/art/`, approximately 16 KB and 48 KB respectively. The correct mobile source is selected by a picture element; dimensions and high fetch priority are provided.
- **SVG artwork:** authored directly in `src/components/Visuals.tsx`. Includes hero connection traces, capability glyphs and the three-stage delivery diagram. These remain editable vector paths, use no remote libraries and are labelled accessibly or marked decorative.
- **Typography:** Manrope Latin variable font from `@fontsource-variable/manrope@5.2.8`, retrieved through npm and served locally. The SIL Open Font License is retained at `public/fonts/Manrope-OFL.txt`. A preload avoids an external font-host dependency; system fallbacks remain available.
- BASE and Church Times concepts remain explicitly labelled illustrations. No new client delivery claims or purported product screenshots were added.

## Implementation map

- `public/theme-init.js`: small external, CSP-compatible, pre-paint preference initializer. It listens for explicit choice, storage changes and OS theme changes. Native same-document transitions enhance supported browsers.
- `src/components/ThemePicker.tsx`: accessible theme control in public navigation and administration.
- `src/premium.css`: theme tokens, material styling, interaction states, SVG effects, responsive adjustments, native page/FAQ transitions and reduced-motion overrides.
- `src/index.css`: existing layout retained; neutral colors now reference semantic tokens instead of assuming a light surface.
- `src/useMotion.ts`: reversible pointer/keyboard feedback and optional IntersectionObserver coordination. No custom cursor, scroll interception or navigation interception.
- `src/components/Visuals.tsx`: original generated artwork placement and authored SVGs.
- `server/app.mjs`: adds correct WebP MIME type; existing security headers and CSP remain intact.
- Privacy notice now discloses local appearance preference storage.

## Validation

- Lint, TypeScript checks and production build passed.
- All 11 existing API/security/schema tests passed.
- 47 distinct browser checks passed across the main run and targeted reruns. These cover all 17 public pages in light mode and all 17 in dark mode, authenticated administration, WhatsApp brief handling, native navigation, keyboard/press states, FAQ transitions, theme persistence/OS changes, pre-React theme initialization with the application script blocked, storage-disabled behavior, outside dismissal and reduced motion.
- Axe scans tagged WCAG 2 A/AA, 2.1 AA and 2.2 AA reported no violations across those public pages and the mobile appearance panels in both themes. This is automated evidence, not a WCAG certification or a substitute for assistive-technology review.
- Responsive checks cover 360, 390, 768, 1024 and 1440 px. Testing found that the closed mobile menu needed a column layout to avoid horizontal overflow; this was fixed. It also caught a concept disclosure overlapping artwork at narrow widths; explicit caption backgrounds and stacking now preserve contrast. Affected checks passed after correction.
- Local mobile lab profile: 390×844, 4× CPU slowdown, 1.6 Mbps download, 150 ms latency. Latest LCP/FCP: **1.62 s**; CLS: **0.040**; transferred subresource bytes: **130,002**; external rendering requests: **0**. See [performance.json](performance.json). LCP <2.5 s and CLS ≤0.1 budgets passed. Field Core Web Vitals and deployed performance remain unmeasured.
- Existing project evidence boundaries, contact details, routes, structured content, generated SEO pages and WhatsApp destination are preserved. The backend remains optional and has not been provisioned on GitHub Pages.

## Previews

- [Recorded interaction walkthrough](previews/premium-interactions.webm): actual browser recording of the theme switch, button/card hover, page navigation and FAQ expansion.

- [Light theme — hero](screenshots/premium-light-hero.png)
- [Dark theme — hero](screenshots/premium-dark-hero.png)
- [Light theme — complete desktop page](screenshots/premium-light-desktop.png)
- [Dark theme — complete desktop page](screenshots/premium-dark-desktop.png)
- [Light theme — mobile](screenshots/premium-light-mobile.png)
- [Dark theme — mobile](screenshots/premium-dark-mobile.png)

Production remains on the previously deployed commit. These new visual changes require review and deployment approval before pushing to main, whose existing workflow automatically publishes the site.
