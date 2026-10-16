# Upgrade delivery and validation

Latest refinement: see [EDITORIAL-EXPERIENCE.md](EDITORIAL-EXPERIENCE.md) for the guided enquiry, revised layouts, current previews and validation. The initial implementation results below are historical. The earlier website and motion iterations were subsequently deployed with user approval; the new editorial branch has not been published.

Initial upgrade prepared on `feat/ark-builders-upgrade`. The subsequent premium interaction and theme iteration is on `feat/premium-motion-dark-mode`; see [PREMIUM-MOTION.md](PREMIUM-MOTION.md) for its 47-browser-check results and previews. No production deployment, push, DNS change or destructive infrastructure operation was performed.

## Delivered

- Preserved React/Vite, the navy/slate-and-amber identity, the existing A monogram/wordmark, active contact channels, original assets and GitHub Pages custom-domain configuration.
- Refined the homepage and added service, work, industry, procurement, contact and privacy journeys. Mobile navigation, keyboard skip link, visible focus, native form labels/validation, semantic headings and reduced-motion support.
- WhatsApp enquiry workflow as requested during implementation: a local project brief with review/send handoff. No claim of an automatic submission, acknowledgement, CRM sync or file upload. Documents are shared in the WhatsApp conversation. The website does not claim to verify a sent WhatsApp message.
- Honest case-study status and labelled concept illustrations. No invented outcome metrics, detailed BASE delivery claims, client quotations, certificates or testimonials.
- Capability page and generated downloadable PDF, page-specific HTML metadata/canonicals/OG cards, XML sitemap, robots, organization/page/service/breadcrumb structured data and a real 404 page.
- Optional Node.js 24 service: protected content drafts and exports; a manual private enquiry register; consent-controlled aggregate CTA counts; hardened same-origin sessions, CSRF/origin checks, input validation and bounded login attempts. No default administrator password.
- Reproducible build and PR validation workflow. Existing Pages deployment trigger is retained; main must not be updated without deployment approval.

## Public page inventory

| Page                        | Route                               |
| --------------------------- | ----------------------------------- |
| Homepage                    | `/`                                 |
| Services overview           | `/services`                         |
| Website development         | `/services/website-development`     |
| Custom software             | `/services/custom-software`         |
| Mobile apps                 | `/services/mobile-app-development`  |
| AI and automation           | `/services/ai-automation`           |
| Technology consulting       | `/services/technology-consulting`   |
| Hardware and infrastructure | `/services/hardware-infrastructure` |
| Work overview               | `/work`                             |
| BASE / Coldtivate           | `/work/base-coldtivate`             |
| Church Times Nigeria        | `/work/church-times-nigeria`        |
| Industry overview           | `/industries`                       |
| Procurement capabilities    | `/capabilities`                     |
| Contact                     | `/contact`                          |
| Project brief               | `/start-project`                    |
| Insights                    | `/insights`                         |
| Privacy and cookies         | `/privacy`                          |

Additional: `/admin` (noindex; configured backend required), generated `404.html`, `/capability-statement.pdf`, `/sitemap.xml`, `/robots.txt`, favicon and individual social images. Insight entries added through approved content exports receive their own `/insights/<slug>` routes at build time. No unapproved articles, team profiles or testimonials are seeded.

## Checks and evidence

- `npm run lint`: passed for TypeScript and server/build/test JavaScript.
- `npm run typecheck`: passed.
- `npm test`: 11 security/API/schema tests passed. Covers password hashing, access controls, CSRF/origin checks, optimistic concurrency, validation, private lead CRUD, event allowlisting, body limits, path traversal, logout, login rate limits and production Secure cookies/HTTPS requirements.
- `npm run build`: passed. Generates 17 public HTML pages, admin and 404, social cards, sitemap/robots and capability PDF. Builds Brotli/gzip versions of text assets. Existing stale Browserslist database warning is nonblocking; no assertions or checks were disabled.
- Browser validation: 25 distinct checks passed across the main suite and targeted corrected admin-test rerun. All 17 public routes passed axe checks tagged WCAG 2 A/AA, 2.1 AA and 2.2 AA. Manual-style automated interactions cover keyboard skip/focus, mobile menu and Escape, reduced motion, responsive widths 360/390/768/1024/1440, brief validation and message composition, consent opt-in/revocation, no JavaScript errors, download/metadata, internal links, status/evidence copy, authenticated CMS edit/export, enquiry creation/status/deletion and logout.
- The first browser run exposed a test focus assumption after a mouse click; corrected by starting keyboard navigation after a page reload. A later admin test used an ambiguous cell locator; corrected to target the full contact cell. The affected tests passed after correction; application checks were not weakened.
- CMS rendering smoke check: approved content fixtures generated insight route metadata, team and testimonial sections; script-like content remained escaped text. Fixtures were not saved as real company content.
- `npm audit --omit=dev --audit-level=high`: passed, zero reported runtime vulnerabilities at execution time. This is not a complete security audit.
- PDF inspected with `pdfinfo` and `pdftotext`: valid A4 text document, no embedded JavaScript. An accessible HTML capability page provides the same procurement context; no claim is made that the untagged PDF is WCAG-certified.
- Production build served through the actual Node static/API server on loopback for staging checks. Public staging deployment, real-device WhatsApp send, external mail/tel application behavior and deployed TLS/gateway configuration remain unverified.

## Performance

See [performance.json](performance.json). Local mobile lab check: 390×844, 4× CPU slowdown, 1.6 Mbps download and 150 ms latency. The latest premium iteration observed LCP/FCP 1,620 ms, CLS 0.040, 130,002 transferred resource bytes and zero external rendering requests. Automated budgets: LCP below 2.5 seconds and CLS at most 0.1. These are local lab measurements, not field Core Web Vitals or an INP claim. Validate real-user performance after staging/production approval.

## Screenshots

- [Homepage — desktop](screenshots/home-desktop.png)
- [Homepage — mobile](screenshots/home-mobile.png)
- [Project brief and WhatsApp handoff](screenshots/project-brief-mobile.png)
- [BASE case study](screenshots/base-case-study.png)
- [Church Times case study](screenshots/church-times-case-study.png)

Screenshots use test-only example contact information and are not customer records.

## Remaining approvals and deployment prerequisites

1. BASE: confirm exact delivered scope, technologies, any outcome metrics, client disclosure and approved screenshots. Current high-level summary follows the supplied brief; proposal features remain explicitly unverified.
2. Church Times: approve public project disclosure and any eventual real screenshots. Status remains In development; preview is a concept.
3. Other projects, corporate/tax information, team profiles and testimonials remain unpublished until verified and approved.
4. Confirm the public contact channels, privacy wording and operational retention owner/policy before enabling hosted administration. Enquiries currently use the existing active site's WhatsApp number.
5. Choose and authorize public staging hosting/TLS and supply administrator configuration securely if CMS/analytics is needed. GitHub Pages alone supports the complete public WhatsApp website but cannot run the optional backend.
6. Review staging and explicitly approve production deployment before any main push/merge or deployment workflow dispatch.

See [DEPLOYMENT.md](DEPLOYMENT.md) for startup, secure configuration, editing/export, publishing and backup instructions. The CMS saves drafts; publication requires an approved export and rebuild. It does not silently change the public site.
