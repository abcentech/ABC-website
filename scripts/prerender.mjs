import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import sharp from 'sharp'
import { gzipSync, brotliCompressSync, constants } from 'node:zlib'
import { render, routes, pageMeta, defaultContent } from '../.ssr/entry-server.js'
import { contentSchema } from '../server/schema.mjs'
process.env.XDG_CACHE_HOME ||= '/tmp/ark-builders-cache'
await mkdir(process.env.XDG_CACHE_HOME, { recursive: true })
const content = contentSchema.parse(
  process.env.CONTENT_FILE
    ? JSON.parse(await readFile(process.env.CONTENT_FILE, 'utf8'))
    : defaultContent,
)
const origin = (process.env.SITE_ORIGIN || 'https://arkbuilders.com.ng').replace(/\/$/, '')
if (!/^https?:\/\/[a-z0-9.:[\]-]+$/i.test(origin))
  throw new Error('SITE_ORIGIN must be an HTTP(S) origin without a path')
const themeVersion = createHash('sha256')
  .update(await readFile('public/theme-init.js'))
  .digest('hex')
  .slice(0, 12)
const template = (await readFile('dist/index.html', 'utf8')).replace(
  'src="/theme-init.js"',
  `src="/theme-init.js?v=${themeVersion}"`,
)
const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
const json = (value) =>
  JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
const routeList = routes(content)
await mkdir('dist/og', { recursive: true })
for (const path of [...routeList, '/admin', '/404']) {
  const meta = pageMeta(path, content)
  const canonical = `${origin}${path === '/' ? '/' : path}`
  const imagePath = `/og/${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}.png`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'Ark Builders',
        url: `${origin}/`,
        description: 'Consulting, software and hardware for organizations in Nigeria and beyond.',
        email: 'toni@arkbuilders.com.ng',
        telephone: '+2348066512844',
        address: { '@type': 'PostalAddress', addressLocality: 'Lagos', addressCountry: 'NG' },
      },
      {
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: canonical,
        isPartOf: { '@type': 'WebSite', name: 'Ark Builders', url: `${origin}/` },
      },
      ...(path.startsWith('/services/')
        ? [
            {
              '@type': 'Service',
              name: content.services.find((s) => path.endsWith(s.slug)).title,
              provider: { '@id': `${origin}/#organization` },
              url: canonical,
            },
          ]
        : []),
      ...(path !== '/'
        ? [
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: meta.title.replace(' | Ark Builders', ''),
                  item: canonical,
                },
              ],
            },
          ]
        : []),
    ],
  }
  const structured = json(schema)
  const hash = createHash('sha256').update(structured).digest('base64')
  const csp = `default-src 'self'; script-src 'self' 'sha256-${hash}'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'`
  const head = `<meta name="description" content="${escape(meta.description)}" />
    <link rel="canonical" href="${escape(canonical)}" />
    <meta name="robots" content="${meta.noindex ? 'noindex, nofollow' : 'index, follow'}" />
    <meta property="og:type" content="website" /><meta property="og:site_name" content="Ark Builders" />
    <meta property="og:title" content="${escape(meta.title)}" /><meta property="og:description" content="${escape(meta.description)}" />
    <meta property="og:url" content="${escape(canonical)}" /><meta property="og:image" content="${escape(origin + imagePath)}" />
    <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escape(meta.title)}" />
    <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:image" content="${escape(origin + imagePath)}" />
    <meta http-equiv="Content-Security-Policy" content="${escape(csp)}" />
    <script type="application/ld+json">${structured}</script>`
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace('<!--page-head-->', head)
    .replace('<!--app-html-->', render(path, content))
    .replace(
      '<!--page-content-->',
      `<script id="site-content" type="application/json">${json(content)}</script>`,
    )
  const folder = path === '/' || path === '/404' ? 'dist' : resolve('dist', path.slice(1))
  await mkdir(folder, { recursive: true })
  await writeFile(resolve(folder, path === '/404' ? '404.html' : 'index.html'), html)
  const title = meta.title.replace(' | Ark Builders', '')
  const words = title.split(' '),
    lines = ['']
  for (const word of words) {
    const current = lines.length - 1
    if ((lines[current] + ' ' + word).length > 29) lines.push(word)
    else lines[current] = (lines[current] + ' ' + word).trim()
  }
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#101c30"/><circle cx="1120" cy="340" r="340" fill="none" stroke="#f5bf4530"/><circle cx="1120" cy="340" r="260" fill="none" stroke="#f5bf4520"/><rect x="70" y="60" width="55" height="60" fill="#f5bf45"/><text x="98" y="104" text-anchor="middle" font-family="sans-serif" font-size="39" font-weight="bold" fill="#101c30">A</text><text x="145" y="88" font-size="20" font-family="sans-serif" fill="white" letter-spacing="3">ARK BUILDERS</text><text x="145" y="114" font-size="11" font-family="sans-serif" fill="#b4c3d3" letter-spacing="2">CONSULTING · SOFTWARE · HARDWARE</text>${lines
    .slice(0, 4)
    .map(
      (line, i) =>
        `<text x="70" y="${245 + i * 70}" font-size="60" font-family="sans-serif" font-weight="bold" letter-spacing="-2" fill="${i === lines.length - 1 ? '#f5bf45' : 'white'}">${escape(line)}</text>`,
    )
    .join(
      '',
    )}<text x="70" y="570" font-family="sans-serif" font-size="19" fill="#b4c3d3">arkbuilders.com.ng</text></svg>`
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`dist${imagePath}`)
}
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routeList.map((path) => `<url><loc>${escape(origin + (path === '/' ? '/' : path))}</loc></url>`).join('')}</urlset>`,
)
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
)
// Downloadable procurement brief: text only, no unverified corporate or project claims.
const pdf = await PDFDocument.create()
const regular = await pdf.embedFont(StandardFonts.Helvetica)
const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
pdf.setTitle('Ark Builders — Company Capability Statement')
pdf.setAuthor('Ark Builders')
let page, y
const navy = rgb(0.063, 0.11, 0.188),
  amber = rgb(0.96, 0.75, 0.27)
function newPage() {
  page = pdf.addPage([595, 842])
  y = 775
  page.drawRectangle({ x: 0, y: 815, width: 595, height: 27, color: navy })
  page.drawText('ARK BUILDERS / CAPABILITY STATEMENT', {
    x: 45,
    y: 790,
    size: 9,
    font: bold,
    color: navy,
  })
}
function paragraph(text, size = 11, font = regular) {
  const words = text.split(/\s+/)
  let line = ''
  function draw(value) {
    if (y < 65) newPage()
    page.drawText(value, { x: 45, y, size, font, color: navy })
    y -= size * 1.4
  }
  for (const word of words) {
    if (font.widthOfTextAtSize((line + ' ' + word).trim(), size) > 500) {
      draw(line)
      line = word
    } else line = (line + ' ' + word).trim()
  }
  if (line) draw(line)
  y -= 6
}
newPage()
y -= 15
paragraph('Technology that moves businesses forward.', 30, bold)
page.drawRectangle({ x: 45, y: y + 3, width: 65, height: 4, color: amber })
y -= 18
paragraph('Consulting. Software. Hardware.', 14, bold)
paragraph(
  'Ark Builders is a technology company based in Lagos, Nigeria. We welcome enquiries from local and international organizations and connect strategy, software and infrastructure around business needs.',
)
paragraph('What we can help with', 16, bold)
for (const s of content.services) paragraph(`${s.title}: ${s.deliverables.join('; ')}.`, 10)
paragraph('How we work', 16, bold)
paragraph(
  'Discovery and solution architecture; UX/UI design and validation; iterative delivery; scope-appropriate quality assurance and security checks; deployment, documentation and agreed maintenance.',
  10,
)
paragraph('Selected project context', 16, bold)
paragraph(
  'BASE / Coldtivate: software engineering contribution to a digital solution for postharvest management and cooling services. Detailed delivery scope and outcomes await verification.',
  10,
)
paragraph(
  'Church Times Nigeria: digital publishing platform in development. Proposed features and concepts are not completed deliverables.',
  10,
)
paragraph('Procurement and qualification', 16, bold)
paragraph(
  'Project scope, timelines, fees, intellectual property, support and acceptance are agreed for each engagement. Registration, tax documents and references are subject to verification and permission. No certification or performance guarantee is implied.',
  10,
)
paragraph('Start a conversation', 16, bold)
paragraph(
  'toni@arkbuilders.com.ng | +234 806 651 2844\nhttps://arkbuilders.com.ng/start-project',
  11,
)
paragraph('Prepared 16 October 2026. Public capability overview, not a commercial offer.', 8)
await writeFile('dist/capability-statement.pdf', await pdf.save())
console.log(
  `Generated ${routeList.length} public HTML routes, admin/404 pages, social cards, sitemap, robots and capability PDF.`,
)

async function compress(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = resolve(folder, entry.name)
    if (entry.isDirectory()) await compress(file)
    else if (/\.(html|js|css|xml|txt|svg)$/.test(entry.name)) {
      const bytes = await readFile(file)
      await writeFile(
        file + '.br',
        brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }),
      )
      await writeFile(file + '.gz', gzipSync(bytes, { level: 9 }))
    }
  }
}
await compress(resolve('dist'))
