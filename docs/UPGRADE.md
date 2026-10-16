# Website audit and implementation plan

## Existing architecture (16 October 2026)

- React 19, TypeScript 5.9 and Vite 7, using npm's committed lockfile.
- One active page in `src/App.tsx`; unused older components remain in `src/components`. No router, server, CMS, persistent forms, automated tests or analytics integration.
- GitHub Actions builds static files and deploys `dist` to GitHub Pages on pushes to main. `public/CNAME` preserves arkbuilders.com.ng. No production deployment is part of this change.
- Existing visual identity: navy/slate, amber, Inter/system sans, square A monogram and ARK BUILDERS wordmark. No separate approved logo artwork was found. Preserve this existing mark and original assets.
- Current active contact channels: toni@arkbuilders.com.ng, +234 806 651 2844, WhatsApp. Older unused components contain different contact details; retain the active site's channels.
- Existing client image assets are not evidence of delivery scope or disclosure permission. Do not expand claims or publish unsupported client lists.
- Existing title/description, domain, original OG asset and useful anchors should be preserved or improved. Static hosting needs real generated HTML routes for direct links and SEO.
- No CMS or credential bindings found in the repository or relevant runtime variable names. Google Fonts is blocked in the current runtime; use local system fonts to avoid a rendering dependency.

## Plan and phase boundaries

1. Phase 1: shared editorial design system, accessible navigation, homepage and six outcome-focused service pages. Add contact and project briefing pages plus a structured, browser-local WhatsApp project brief with native validation and an explicit review/send handoff. The user selected WhatsApp instead of email/CRM submission; no website uploads or simulated submissions.
2. Phase 2: work overview, BASE and Church Times pages with explicit evidence boundaries, industry overview, procurement capability page and downloadable capability PDF. No unsupported project outcomes, technologies, certifications or client testimonials.
3. Phase 3: protected content/lead administration, page-specific static HTML and metadata, sitemap/robots/schema, consent-controlled first-party conversion counts, privacy disclosures, automated API/browser/accessibility checks, staging screenshots and deployment documentation.

## Decisions

Keep React/Vite and static GitHub Pages compatibility. Generate every public route at build time. A separate Node.js 24 service can run beside the static site via a same-origin reverse proxy, or serve the complete site on a staging/new host. This is additive: do not silently change production DNS or existing Pages deployment.

Use a small structured-content CMS because no existing CMS exists. Administrators use server-side password verification and expiring HttpOnly sessions, can edit validated content and review leads, and trigger a rebuild to publish content. Content publication requires editorial approval; edits are never silently pushed to production. No fabricated team profiles or testimonials are seeded.

## External prerequisites and editorial approvals

- BASE: supplied brief supports only the high-level software contribution. Detailed scope, stack, proposal features, screenshots, metrics and disclosure approval remain pending. Proposed features are explicitly marked as historical proposal topics, not delivered functionality.
- Church Times: in development. All preview screens are labelled concept illustrations; no claim of a completed launch.
- InvestNaira and other engagements: not published without evidence and permission.
- Corporate registration, tax details, team profiles, testimonials and certifications: withheld pending approval.
- User chose WhatsApp for enquiries. No email provider or form-processing credentials are required. Supporting documents are shared directly in WhatsApp. The optional administration/aggregate analytics service requires a secure admin password hash, public site origin, persistent storage and backup policy. The enquiry register is maintained manually by authorized staff.
- Privacy text is an implementation draft requiring company approval of retention, lawful basis and contact details before production activation.
- No live hosting credentials or public staging destination are configured. Validate a production-mode staging instance locally and document external staging acceptance separately.

## Acceptance evidence

See `docs/VALIDATION.md` and `docs/DEPLOYMENT.md` for commands, test results, screenshot paths, remaining approvals and operational steps. Do not equate local production-mode staging with a deployed public staging site.
