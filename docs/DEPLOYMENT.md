# Development, content and deployment

## Runtime and local development

Use Node.js 24 (validated on 24.19.0) and npm. The existing React/Vite checkout is retained. Each cloud task is isolated; use this checkout without creating another worktree unless requested.

```sh
cd /workspace/ABC-website
npm ci
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

WhatsApp enquiries work without a backend, credentials or uploaded files. The form prepares the visitor's brief locally; the visitor reviews and sends it in WhatsApp. A website cannot verify that the WhatsApp message was sent, automatically acknowledge it, or import that conversation without a separately approved WhatsApp Business API integration. No such integration or automatic message is claimed here. Email and telephone links remain available.

For optional administration and aggregate analytics, run `npm run server` in a second terminal. Vite proxies `/api` to port 3001. When using the API through Vite, set `PUBLIC_ORIGIN` to the browser's exact Vite origin, e.g. `http://127.0.0.1:5173`; the origin must match the browser request and have no trailing slash. Do not allow arbitrary origins.

## Production-like local staging

```sh
npm run build
PUBLIC_ORIGIN=http://127.0.0.1:3001 DATA_DIR=/workspace/ark-builders-staging npm run server
```

This serves the built public pages and optional API together, with direct links, 404 responses, CSP, private API responses, security headers and precompressed assets. HTTP is appropriate only for this loopback check. This is not a public staging deployment or production DNS change. Verify `/api/health`, every public route, the PDF, keyboard navigation, the project brief and mobile layouts. `npm run preview` is an additional static-only preview; it does not provide CMS or analytics endpoints.

A public staging hostname, hosting credentials and TLS termination have not been supplied. Deploy to an approved staging host and repeat the acceptance checks there before production approval. Keep staging out of search using access controls and an `X-Robots-Tag: noindex` header. Build staging with its own `SITE_ORIGIN` so canonical URLs and the sitemap point to the staging hostname; rebuild with the production domain only for the approved production artifact.

## Retain GitHub Pages

All public pages are prerendered to `dist/<route>/index.html`. Existing GitHub Pages hosting, `public/CNAME`, domain, contact channels and original assets are retained. Root-relative assets work for this custom-domain site, including nested pages. The current Pages workflow still runs on pushes to main. **Merging this branch into main can trigger production deployment: obtain explicit approval first.** No merge, push, workflow dispatch, DNS change or production deployment was performed in this task.

GitHub Pages can host the complete public WhatsApp website and PDF. It cannot run the optional administration/analytics service. To enable that service while retaining Pages, use an approved gateway that routes same-origin `/api/*` requests to the Node service and the rest to Pages. Alternatively host the complete site with the Node service. A cross-origin API has deliberately not been enabled.

## Optional administration service

There was no existing CMS. This change provides a small, structured-content administration interface at `/admin` with server-side validation and a private SQLite enquiry register. It requires:

- Node.js 24 with built-in SQLite support (currently emits an experimental API warning).
- `ADMIN_PASSWORD_HASH`: generate a salted scrypt hash with `npm run admin:password`, supplying a strong password via stdin from a secure prompt or password manager. Never put it in shell command arguments/history. There is no default password. Provision the hash and password through approved secure settings, never Git.
- `PUBLIC_ORIGIN`: the exact HTTPS public origin in production.
- `NODE_ENV=production`: enables Secure session cookies and requires HTTPS origin configuration. TLS terminates at a trusted reverse proxy. Bind the Node listener to a private interface and restrict direct access.
- `DATA_DIR`: private persistent storage outside the public checkout/web root, writable only by the service account. Directory creation uses mode 0700. Protect the host, backups and database volume; provision encrypted storage where required. Never serve this directory or copy it into static assets.

Sessions are random, hashed in the database, HttpOnly, SameSite=Strict and expire after eight hours. Writes require a matching origin and per-session CSRF token. Login attempts are bounded. Treat this initial CMS as a single trusted administrator role; do not share credentials with unrelated staff. Use a gateway with individual identity/MFA before broadening access. App-level rate limits ignore forwarded IP headers; apply per-client limits at the trusted gateway as well.

Never publish `.env.local`, the data directory, database files, private lead notes, session data or password hashes. Changing the password hash does not invalidate existing sessions automatically: clear the sessions table during an authorized rotation and restart the service. Use the administrative Delete action to remove an enquiry. The audit log records actions, not enquiry contents.

## Content editing and publishing

1. Sign in at `/admin`. Select Projects, Services, Industries, Team, Insights, FAQs or Testimonials. All content is plain text, not executable HTML. The JSON editor validates against `server/schema.mjs` and rejects duplicate slugs and broken references. Empty team/testimonial/insight collections remain unpublished.
2. Keep factual claims attributable. Confirm client permission, factual accuracy and confidentiality before saving a draft. Draft saves use optimistic revision checks to prevent overwriting another editor's changes.
3. Export saved content to `ark-content.json`. Private lead records are never part of the export. The content editor is a draft workflow: saving does not change the currently published pages.
4. Validate and build an approved export outside the source file:

```sh
CONTENT_FILE=/absolute/path/ark-content.json SITE_ORIGIN=https://approved-staging.example npm run build
```

The build validates the export, prerenders content, generates new insight/project/service routes, sitemap entries, social cards and the PDF. Review the staging artifact. To make this content the repository's future default, separately review and commit it to `src/content/site.json`. Otherwise keep the approved content export available to the build pipeline. Rebuilding without `CONTENT_FILE` intentionally uses the committed seed, not the CMS database. 5. Publish only after approval using the chosen hosting workflow. No build command in this repository deploys production by itself.

Project records contain public story sections, status, disclosure note, CTA and a visual choice. `cold-chain` and `publishing` visuals are expressly labelled concepts; `none` uses a neutral project card. Approved screenshots can be added in a separate reviewed media change; the CMS intentionally has no file upload surface. Team, testimonials and insight entries should only be added after approval. FAQ/service/industry content can be maintained in the same editor.

## Enquiry handling and privacy

The visitor sends their brief directly in WhatsApp. Supporting files are shared in the chat, never uploaded to this site. Staff can record a permitted conversation manually in the enquiry register, change its pipeline status, and delete it. The register is not an automatic CRM sync. Reply and acknowledgement happen in the WhatsApp conversation. No email provider credential is needed.

Optional first-party analytics records only event name, route, day and aggregate count after affirmative consent. It measures CTA/WhatsApp handoffs, not completed messages. The preference is local browser storage. Declining/revoking it stops event requests. The API rejects arbitrary event names and extra fields. Review the privacy notice, retention arrangements and third-party WhatsApp terms with the company before enabling administration in production.

## Operations

Use an approved supervisor to restart the Node service and a TLS reverse proxy to serve the public origin. Set reasonable request-size and request-rate limits at the gateway. The application bounds JSON bodies at 600 KB and headers/request timeouts at 10/15 seconds. No public file-upload endpoint exists.

Back up SQLite using SQLite's online backup API or a consistent database backup tool, including a tested restore procedure; do not copy only the main database while WAL writes are active. Restrict backup access and apply the same approved retention policy to backups and live records. No automatic retention schedule is invented here: Ark Builders must set the policy and operational owner.

Static assets are fingerprinted and cached immutably. Other assets use a short cache lifetime, HTML revalidates, and API responses use no-store. Precompressed Brotli and gzip files are generated during the build and served when supported. Preserve security headers at the reverse proxy. Local automated tests do not establish field Core Web Vitals or replace a deployed staging review.

## Verification commands

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

Playwright uses `/usr/bin/chromium` when available, otherwise its installed Chromium. On a new CI host run `npx playwright install --with-deps chromium`. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can specify an approved local browser path. Tests run against built files and isolated test databases; known test credentials exist only in the loopback-only test fixture. Generated reports go to ignored folders. Review screenshots in `docs/screenshots/`.
