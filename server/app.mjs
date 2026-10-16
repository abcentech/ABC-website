import { createServer } from 'node:http'
import { DatabaseSync } from 'node:sqlite'
import { mkdirSync, readFileSync, statSync } from 'node:fs'
import { resolve, extname, sep } from 'node:path'
import { randomBytes } from 'node:crypto'
import { contentSchema, eventSchema, leadSchema } from './schema.mjs'
import { digest, token, verifyPassword } from './security.mjs'

const MAX_BODY = 600_000
const SESSION_MS = 8 * 60 * 60 * 1000
export function createApp(options = {}) {
  const production = options.production ?? process.env.NODE_ENV === 'production'
  const origin = options.origin || process.env.PUBLIC_ORIGIN || 'http://127.0.0.1:3001'
  if (new URL(origin).origin !== origin)
    throw new Error('PUBLIC_ORIGIN must be an origin without a path or trailing slash')
  if (production && !origin.startsWith('https://'))
    throw new Error('Production requires an HTTPS PUBLIC_ORIGIN')
  const dataDir = resolve(options.dataDir || process.env.DATA_DIR || '/workspace/ark-builders-data')
  mkdirSync(dataDir, { recursive: true, mode: 0o700 })
  const db = new DatabaseSync(resolve(dataDir, 'ark.sqlite'))
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
    CREATE TABLE IF NOT EXISTS content(id INTEGER PRIMARY KEY CHECK(id=1), json TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS leads(id TEXT PRIMARY KEY, data TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS events(day TEXT NOT NULL, event TEXT NOT NULL, path TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(day,event,path));
    CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY, action TEXT NOT NULL, created TEXT NOT NULL);`)
  if (!db.prepare('SELECT id FROM content WHERE id=1').get()) {
    const seed = contentSchema.parse(
      JSON.parse(readFileSync(new URL('../src/content/site.json', import.meta.url), 'utf8')),
    )
    db.prepare('INSERT INTO content(id,json) VALUES(1,?)').run(JSON.stringify(seed))
  }
  const hash = options.adminHash ?? process.env.ADMIN_PASSWORD_HASH ?? ''
  if (hash && !/^scrypt:[a-f0-9]{48}:[a-f0-9]{128}$/.test(hash))
    throw new Error('Invalid ADMIN_PASSWORD_HASH format')
  const staticDir = resolve(options.staticDir || process.env.STATIC_DIR || 'dist')
  const limiterSalt = randomBytes(32).toString('hex')
  let sweepAt = 0
  function limited(req, kind, max, windowMs) {
    const now = Date.now()
    if (now > sweepAt) {
      db.prepare('DELETE FROM limits WHERE expires < ?').run(now)
      db.prepare('DELETE FROM sessions WHERE expires < ?').run(now)
      sweepAt = now + 60_000
    }
    // X-Forwarded-For is intentionally ignored: bind behind a trusted proxy and rate-limit there too.
    const key = `${kind}:${digest(limiterSalt + req.socket.remoteAddress)}`
    const existing = db.prepare('SELECT count,expires FROM limits WHERE key=?').get(key)
    if (existing && existing.expires > now && existing.count >= max) return true
    db.prepare(
      'INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<=? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<=? THEN excluded.expires ELSE expires END',
    ).run(key, now + windowMs, now, now)
    return false
  }
  function audit(action) {
    db.prepare('INSERT INTO audit(action,created) VALUES(?,?)').run(
      action,
      new Date().toISOString(),
    )
  }
  function session(req) {
    const id = /(?:^|;\s*)ark_session=([a-f0-9]{64})(?:;|$)/.exec(req.headers.cookie || '')?.[1]
    return id
      ? db.prepare('SELECT * FROM sessions WHERE id=? AND expires>?').get(digest(id), Date.now())
      : null
  }
  function respond(res, status, payload) {
    res.writeHead(status, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })
    res.end(JSON.stringify(payload))
  }
  async function body(req) {
    if (!req.headers['content-type']?.startsWith('application/json'))
      throw Object.assign(new Error('Use application/json'), { status: 415 })
    let size = 0
    const chunks = []
    for await (const chunk of req) {
      size += chunk.length
      if (size > MAX_BODY) throw Object.assign(new Error('Request too large'), { status: 413 })
      chunks.push(chunk)
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch {
      throw Object.assign(new Error('Invalid JSON'), { status: 400 })
    }
  }
  const server = createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
    )
    if (production) res.setHeader('Strict-Transport-Security', 'max-age=31536000')
    let url
    try {
      url = new URL(req.url, origin)
    } catch {
      return respond(res, 400, { error: 'Invalid URL' })
    }
    const path = url.pathname
    try {
      if (path === '/api/health' && req.method === 'GET')
        return respond(res, 200, {
          status: 'ok',
          administration: Boolean(hash),
          enquiryChannel: 'whatsapp',
        })
      if (path.startsWith('/api/')) {
        res.setHeader('X-Robots-Tag', 'noindex')
        if (req.method !== 'GET' && req.headers.origin !== origin)
          return respond(res, 403, { error: 'Origin not allowed' })
        if (path === '/api/events' && req.method === 'POST') {
          if (limited(req, 'events', 60, 60_000))
            return respond(res, 429, { error: 'Rate limit exceeded' })
          const result = eventSchema.safeParse(await body(req))
          if (!result.success) return respond(res, 400, { error: 'Invalid event' })
          db.prepare(
            'INSERT INTO events(day,event,path,count) VALUES(?,?,?,1) ON CONFLICT(day,event,path) DO UPDATE SET count=count+1',
          ).run(new Date().toISOString().slice(0, 10), result.data.event, result.data.path)
          return respond(res, 202, { counted: true })
        }
        if (!path.startsWith('/api/admin/')) return respond(res, 404, { error: 'Not found' })
        if (!hash)
          return respond(res, 503, {
            error:
              'Administration is not enabled on this host. Configure a secure administrator password hash.',
          })
        if (path === '/api/admin/login' && req.method === 'POST') {
          if (limited(req, 'login', 5, 15 * 60_000)) {
            res.setHeader('Retry-After', '900')
            return respond(res, 429, { error: 'Too many attempts. Try again in 15 minutes.' })
          }
          const input = await body(req)
          if (!verifyPassword(input.password, hash))
            return respond(res, 401, { error: 'Invalid sign-in details' })
          const id = token(),
            csrf = token()
          db.prepare('INSERT INTO sessions(id,csrf,expires) VALUES(?,?,?)').run(
            digest(id),
            csrf,
            Date.now() + SESSION_MS,
          )
          res.setHeader(
            'Set-Cookie',
            `ark_session=${id}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=28800${production ? '; Secure' : ''}`,
          )
          audit('Administrator signed in')
          return respond(res, 200, { csrf })
        }
        const active = session(req)
        if (!active) return respond(res, 401, { error: 'Sign in to continue' })
        if (req.method !== 'GET' && req.headers['x-csrf-token'] !== active.csrf)
          return respond(res, 403, { error: 'Invalid security token. Sign in again.' })
        if (path === '/api/admin/session' && req.method === 'GET')
          return respond(res, 200, { csrf: active.csrf })
        if (path === '/api/admin/logout' && req.method === 'POST') {
          db.prepare('DELETE FROM sessions WHERE id=?').run(active.id)
          res.setHeader(
            'Set-Cookie',
            `ark_session=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${production ? '; Secure' : ''}`,
          )
          return respond(res, 200, { ok: true })
        }
        if (path === '/api/admin/content' && req.method === 'GET') {
          const row = db.prepare('SELECT json,revision FROM content WHERE id=1').get()
          return respond(res, 200, { content: JSON.parse(row.json), revision: row.revision })
        }
        if (path === '/api/admin/content' && req.method === 'PUT') {
          const input = await body(req)
          const parsed = contentSchema.safeParse(input.content)
          if (!parsed.success)
            return respond(res, 400, {
              error: 'Content validation failed',
              details: parsed.error.issues
                .map((i) => `${i.path.join('.')}: ${i.message}`)
                .slice(0, 10),
            })
          // Do not permit edits to drift into layouts that the current templates cannot render.
          if (!input.approved)
            return respond(res, 400, {
              error: 'Confirm factual accuracy and permission to publish',
            })
          const update = db
            .prepare('UPDATE content SET json=?,revision=revision+1 WHERE id=1 AND revision=?')
            .run(JSON.stringify(parsed.data), input.revision)
          if (!update.changes)
            return respond(res, 409, {
              error: 'Content changed in another session. Reload before editing.',
            })
          audit('Content draft updated; publication requires export and rebuild')
          return respond(res, 200, { revision: input.revision + 1, saved: true })
        }
        if (path === '/api/admin/leads' && req.method === 'GET')
          return respond(res, 200, {
            leads: db
              .prepare('SELECT * FROM leads ORDER BY updated DESC LIMIT 500')
              .all()
              .map((row) => ({
                id: row.id,
                ...JSON.parse(row.data),
                created: row.created,
                updated: row.updated,
              })),
          })
        if (path === '/api/admin/leads' && req.method === 'POST') {
          const result = leadSchema.safeParse(await body(req))
          if (!result.success)
            return respond(res, 400, {
              error:
                'Provide a name, organization, valid email (or blank), notes, status and permission confirmation.',
            })
          const id = token(),
            now = new Date().toISOString()
          db.prepare('INSERT INTO leads VALUES(?,?,?,?)').run(
            id,
            JSON.stringify(result.data),
            now,
            now,
          )
          audit('Enquiry record added')
          return respond(res, 201, { id })
        }
        const leadPath = /^\/api\/admin\/leads\/([a-f0-9]{64})$/.exec(path)
        if (leadPath && req.method === 'PATCH') {
          const input = await body(req)
          if (!['New', 'Qualifying', 'Proposal', 'Won', 'Closed'].includes(input.status))
            return respond(res, 400, { error: 'Invalid status' })
          const row = db.prepare('SELECT data FROM leads WHERE id=?').get(leadPath[1])
          if (!row) return respond(res, 404, { error: 'Record not found' })
          const data = { ...JSON.parse(row.data), status: input.status }
          db.prepare('UPDATE leads SET data=?,updated=? WHERE id=?').run(
            JSON.stringify(data),
            new Date().toISOString(),
            leadPath[1],
          )
          audit('Enquiry status updated')
          return respond(res, 200, { saved: true })
        }
        if (leadPath && req.method === 'DELETE') {
          const result = db.prepare('DELETE FROM leads WHERE id=?').run(leadPath[1])
          audit('Enquiry deletion requested')
          return respond(
            res,
            result.changes ? 200 : 404,
            result.changes ? { deleted: true } : { error: 'Record not found' },
          )
        }
        if (path === '/api/admin/report' && req.method === 'GET')
          return respond(res, 200, {
            events: db.prepare('SELECT * FROM events ORDER BY day DESC LIMIT 500').all(),
            audit: db.prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 100').all(),
          })
        return respond(res, 404, { error: 'Not found' })
      }
      if (!['GET', 'HEAD'].includes(req.method))
        return respond(res, 405, { error: 'Method not allowed' })
      if (path.length > 1 && path.endsWith('/')) {
        res.writeHead(308, { Location: path.slice(0, -1) + url.search })
        return res.end()
      }
      let decoded
      try {
        decoded = decodeURIComponent(path)
      } catch {
        return respond(res, 400, { error: 'Invalid path' })
      }
      if (
        decoded.includes('\0') ||
        decoded.split('/').some((p) => p.startsWith('.')) ||
        decoded.includes('\\')
      )
        return respond(res, 404, { error: 'Not found' })
      let file = resolve(staticDir, `.${decoded}`)
      if (file !== staticDir && !file.startsWith(staticDir + sep))
        return respond(res, 404, { error: 'Not found' })
      let status = 200
      try {
        if (statSync(file).isDirectory()) file = resolve(file, 'index.html')
        if (!statSync(file).isFile()) throw new Error('Not a file')
      } catch {
        file = resolve(staticDir, '404.html')
        status = 404
      }
      let data
      try {
        data = readFileSync(file)
      } catch {
        return respond(res, 503, { error: 'Website build unavailable. Run npm run build.' })
      }
      const extension = extname(file)
      if (extension === '.html') {
        // JSON-LD is inert data; hash it explicitly for strict CSP compatibility.
        const hashes = [
          ...data.toString().matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
        ]
          .map((m) => `'sha256-${Buffer.from(digest(m[1]), 'hex').toString('base64')}'`)
          .join(' ')
        res.setHeader(
          'Content-Security-Policy',
          `default-src 'self'; script-src 'self' ${hashes}; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
        )
      }
      const mime = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.xml': 'application/xml; charset=utf-8',
        '.txt': 'text/plain; charset=utf-8',
        '.woff2': 'font/woff2',
        '.webp': 'image/webp',
      }
      const accept = req.headers['accept-encoding'] || ''
      for (const [encoding, suffix] of [
        ['br', '.br'],
        ['gzip', '.gz'],
      ]) {
        if (
          !accept
            .split(',')
            .some(
              (value) =>
                value.trim().split(';')[0] === encoding && !/;\s*q=0(?:\.0*)?$/.test(value.trim()),
            )
        )
          continue
        try {
          data = readFileSync(file + suffix)
          res.setHeader('Content-Encoding', encoding)
          break
        } catch {
          /* Fall back to the original representation. */
        }
      }
      res.setHeader('Vary', 'Accept-Encoding')
      res.writeHead(status, {
        'Content-Type': mime[extension] || 'application/octet-stream',
        'Cache-Control': path.startsWith('/assets/')
          ? 'public, max-age=31536000, immutable'
          : extension === '.html'
            ? 'no-cache'
            : 'public, max-age=3600',
        'Content-Length': data.length,
      })
      res.end(req.method === 'HEAD' ? undefined : data)
    } catch (error) {
      // Never expose request bodies, credentials, database content or internal paths.
      const status = Number(error.status) || 500
      respond(res, status, {
        error: status === 500 ? 'The request could not be completed. Please retry.' : error.message,
      })
    }
  })
  server.requestTimeout = 15_000
  server.headersTimeout = 10_000
  return {
    server,
    db,
    close: () =>
      new Promise((resolveClose) =>
        server.close(() => {
          db.close()
          resolveClose()
        }),
      ),
  }
}
