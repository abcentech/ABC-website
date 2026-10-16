# Editorial experience refinement

Implemented on `feat/editorial-experience`, based on deployed commit `bc4c340`. This iteration has not been published to the production domain.

## What changed and why

The previous enquiry page repeated its introduction before presenting a long form. Repeated page compositions and small supporting text weakened the visual hierarchy. This pass changes the journey and composition, rather than adding more decorative effects.

- **Project enquiry:** a dedicated four-step journey — service, scope/timing, contact details, review. Native keyboard-operable choices, visible progress, validation, focus management and preserved answers when moving back. Service and case-study links carry the relevant service into the brief. Visitors can edit individual sections before sending.
- **WhatsApp handoff:** visitors inspect the message before opening WhatsApp. Copy and email alternatives are available; denied clipboard permission reveals selectable message text. There is no automatic submission or false success state. Personal details stay in React memory until the visitor explicitly uses a handoff; they are not saved in browser storage or sent to an enquiry API. No attachment upload is implied.
- **Enquiry composition:** the form starts beside a concise introduction on desktop. Tablet and mobile layouts bring the first decision near the fold. A compact footer keeps attention on the task. Contact has its own layout with working brief, WhatsApp, email and telephone links.
- **Visual system:** warm paper and deep navy themes, larger supporting copy, restrained gold detail and licensed self-hosted Instrument Serif italic alongside Manrope. The existing logo and original generated sculptural artwork remain. Headline spacing and responsive line breaks are adjusted.
- **Homepage:** a stronger typographic opening, staggered selected-project composition, visible project statuses, differentiated capability sections and clearer supporting copy.
- **Case studies:** sticky section navigation on large screens and service-specific next steps. Concept previews, development status and delivery verification boundaries remain explicit.
- **Transitions:** existing reduced-motion-aware page and theme transitions, press states and hover/focus feedback are retained. Form stages have controlled entry and focus; radios have full-card hit surfaces. No cursor replacement, scroll hijacking or compulsory animation.
- **Delivery:** the theme boot script receives a content-based version in prerendered HTML so cached production scripts cannot preserve an outdated theme palette. Existing static hosting, URLs, canonicals, security policy and optional server integration are retained.

All 17 existing public routes remain. Homepage, contact and start-project have new compositions; service/case-study CTA destinations and shared typography/theme styles are improved across the other pages. No backend deployment or infrastructure mutation is included.

## Review the actual result

- [Previous enquiry page](screenshots/enquiry-before.png)
- [New enquiry — desktop, light](screenshots/enquiry-light-1440.png)
- [New enquiry — desktop, dark](screenshots/enquiry-dark-1440.png)
- [New enquiry — mobile, light](screenshots/enquiry-light-390.png)
- [New enquiry — mobile, dark](screenshots/enquiry-dark-390.png)
- [Editable review stage](screenshots/enquiry-review-light.png)
- [Homepage opening — light](screenshots/editorial-home-hero-light.png)
- [Homepage opening — dark](screenshots/editorial-home-hero-dark.png)
- [Recorded enquiry and appearance walkthrough](previews/editorial-enquiry.webm)

Screenshots and recording use synthetic example details. No message was sent. The recording shows the real locally served production build, not an animation mockup.

## Validation

Lint, TypeScript checking, production build and 13 unit/API/security checks pass. All 52 browser checks pass, including all public routes in both themes, every enquiry stage with axe WCAG 2.2 AA-oriented checks, keyboard radio selection, validation, review edits, contextual service selection, privacy, clipboard success/denial, admin controls and internal links. The complete enquiry is exercised at 360, 390, 768, 1024 and 1440 pixels in both themes. Automated accessibility checks do not establish complete WCAG conformance.

The tablet check initially found the first choice too far down the page; the layout was tightened. A native radio hit-area issue was corrected by giving the actual input the full card surface, preserving keyboard behavior. Neither assertion was weakened.

The final local production-build mobile lab measurement was LCP/FCP 1,412 ms, CLS 0, 162,978 transferred resource bytes and zero external rendering requests, recorded in [performance.json](performance.json): 390×844, 4× CPU slowdown, 1.6 Mbps download and 150 ms latency. It is a lab observation, not field Core Web Vitals, a global ranking or an INP measurement. Real-device WhatsApp sending and real-user performance remain external verification steps.

## What still requires real material

A strong visual presentation can support credibility, but it cannot substitute for evidence. The next material improvement needs approved product screenshots, confirmed delivered scope and outcomes for BASE/Coldtivate, approved Church Times progress visuals, and authorized client testimony if available. No proposal features, fabricated metrics or testimonials were promoted to proof. Corporate procurement facts still require verification before publication.

Instrument Serif italic is distributed under the SIL Open Font License; the local license is `public/fonts/InstrumentSerif-OFL.txt`. The original generated artwork remains a brand illustration, not evidence of client delivery.

## Local review and publication

Run `npm ci`, `npm run build`, then `npm run server` for a production-build review. The public WhatsApp journey needs no backend credentials. See [DEPLOYMENT.md](DEPLOYMENT.md) for the optional backend.

This branch is reviewable without changing the live site. Pushing or merging it to `main` triggers the existing GitHub Pages production workflow and requires explicit approval.
