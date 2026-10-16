import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../server/app.mjs'
import { hashPassword, verifyPassword } from '../server/security.mjs'
import { contentSchema } from '../server/schema.mjs'
const origin = 'http://127.0.0.1:3001'
const password = 'test-only-long-passphrase'
let app, base, directory, cookie, csrf
const seed = JSON.parse(readFileSync(new URL('../src/content/site.json', import.meta.url), 'utf8'))
async function request(path, method = 'GET', body, headers = {}) {
  return fetch(base + path, {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', ...headers },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
}
before(async () => {
  directory = mkdtempSync(join(tmpdir(), 'ark-test-'))
  app = createApp({ origin, dataDir: directory, adminHash: hashPassword(password) })
  await new Promise((resolve) => app.server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${app.server.address().port}`
})
after(async () => {
  await app.close()
  rmSync(directory, { recursive: true, force: true })
})
test('password hashes use random salts and reject incorrect passwords', () => {
  const a = hashPassword(password),
    b = hashPassword(password)
  assert.notEqual(a, b)
  assert.equal(verifyPassword(password, a), true)
  assert.equal(verifyPassword('wrong', a), false)
  assert.equal(verifyPassword(password, 'invalid'), false)
  assert.throws(() => hashPassword('short'))
})
test('seed content validates, rejects duplicate slugs and broken references', () => {
  assert.equal(contentSchema.safeParse(seed).success, true)
  const duplicate = structuredClone(seed)
  duplicate.services.push(duplicate.services[0])
  assert.equal(contentSchema.safeParse(duplicate).success, false)
  const broken = structuredClone(seed)
  broken.services[0].related = 'unknown'
  assert.equal(contentSchema.safeParse(broken).success, false)
})
test('health identifies WhatsApp enquiries; unknown public submission endpoint never simulates success', async () => {
  const response = await request('/api/health')
  assert.equal(response.status, 200)
  assert.equal((await response.json()).enquiryChannel, 'whatsapp')
  assert.equal((await request('/api/leads', 'POST', { name: 'Visitor' })).status, 404)
})
test('admin data is private and cross-origin writes are rejected', async () => {
  assert.equal((await request('/api/admin/content')).status, 401)
  assert.equal(
    (
      await request(
        '/api/admin/login',
        'POST',
        { password },
        { Origin: 'https://malicious.example' },
      )
    ).status,
    403,
  )
  assert.equal((await request('/api/admin/login', 'POST', { password: 'wrong' })).status, 401)
})
test('login creates HttpOnly SameSite session, enforces CSRF, and edits validated content with concurrency checks', async () => {
  const response = await request('/api/admin/login', 'POST', { password })
  assert.equal(response.status, 200)
  cookie = response.headers.get('set-cookie').split(';')[0]
  assert.match(response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/)
  csrf = (await response.json()).csrf
  const auth = { Cookie: cookie, 'X-CSRF-Token': csrf }
  const current = await (await request('/api/admin/content', 'GET', undefined, auth)).json()
  assert.equal(current.revision, 1)
  assert.equal(
    (
      await request(
        '/api/admin/content',
        'PUT',
        { content: seed, revision: 1, approved: true },
        { Cookie: cookie },
      )
    ).status,
    403,
  )
  assert.equal(
    (await request('/api/admin/content', 'PUT', { content: {}, revision: 1, approved: true }, auth))
      .status,
    400,
  )
  assert.equal(
    (
      await request(
        '/api/admin/content',
        'PUT',
        { content: seed, revision: 1, approved: false },
        auth,
      )
    ).status,
    400,
  )
  assert.equal(
    (
      await request(
        '/api/admin/content',
        'PUT',
        { content: seed, revision: 1, approved: true },
        auth,
      )
    ).status,
    200,
  )
  assert.equal(
    (
      await request(
        '/api/admin/content',
        'PUT',
        { content: seed, revision: 1, approved: true },
        auth,
      )
    ).status,
    409,
  )
})
test('authorized enquiry register validates, persists, updates and deletes records', async () => {
  const auth = { Cookie: cookie, 'X-CSRF-Token': csrf }
  const lead = {
    name: 'Test Enquirer',
    organization: 'Test Organization',
    email: 'test@example.org',
    notes: 'Permission granted for test follow-up',
    status: 'New',
    consent: true,
  }
  assert.equal(
    (await request('/api/admin/leads', 'POST', { ...lead, consent: false }, auth)).status,
    400,
  )
  const response = await request('/api/admin/leads', 'POST', lead, auth)
  assert.equal(response.status, 201)
  const { id } = await response.json()
  assert.equal(
    (await (await request('/api/admin/leads', 'GET', undefined, auth)).json()).leads[0].name,
    lead.name,
  )
  assert.equal(
    (await request(`/api/admin/leads/${id}`, 'PATCH', { status: 'Proposal' }, auth)).status,
    200,
  )
  assert.equal(
    (await (await request('/api/admin/leads', 'GET', undefined, auth)).json()).leads[0].status,
    'Proposal',
  )
  assert.equal((await request(`/api/admin/leads/${id}`, 'DELETE', undefined, auth)).status, 200)
  assert.equal(
    (await (await request('/api/admin/leads', 'GET', undefined, auth)).json()).leads.length,
    0,
  )
})
test('aggregate analytics rejects arbitrary events and enquiry content', async () => {
  assert.equal(
    (
      await request('/api/events', 'POST', {
        event: 'contact_whatsapp',
        path: '/contact',
        email: 'private@example.org',
      })
    ).status,
    400,
  )
  assert.equal(
    (await request('/api/events', 'POST', { event: 'fake_lead', path: '/' })).status,
    400,
  )
  assert.equal(
    (await request('/api/events', 'POST', { event: 'contact_whatsapp', path: '/contact' })).status,
    202,
  )
  const report = await (
    await request('/api/admin/report', 'GET', undefined, { Cookie: cookie })
  ).json()
  assert.equal(report.events[0].count, 1)
  assert.equal(report.events[0].event, 'contact_whatsapp')
  assert.ok(report.audit.length >= 3)
})
test('JSON content-type, body size and traversal protections', async () => {
  assert.equal(
    (
      await fetch(base + '/api/events', {
        method: 'POST',
        headers: { Origin: origin, 'Content-Type': 'text/plain' },
        body: '{}',
      })
    ).status,
    415,
  )
  assert.equal(
    (await request('/api/events', 'POST', { event: 'contact_whatsapp', path: 'x'.repeat(610000) }))
      .status,
    413,
  )
  assert.equal((await request('/.env.local')).status, 404)
  assert.equal((await request('/%2e%2e%2fserver%2fapp.mjs')).status, 404)
})
test('logout invalidates the server session', async () => {
  assert.equal(
    (await request('/api/admin/logout', 'POST', {}, { Cookie: cookie, 'X-CSRF-Token': csrf }))
      .status,
    200,
  )
  assert.equal(
    (await request('/api/admin/content', 'GET', undefined, { Cookie: cookie })).status,
    401,
  )
})
test('repeated password failures trigger a bounded rate limit', async () => {
  let response
  for (let i = 0; i < 6; i++)
    response = await request('/api/admin/login', 'POST', { password: 'bad' })
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('retry-after'), '900')
})
test('production requires HTTPS and secure session cookies; disabled admin returns 503', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'ark-prod-'))
  assert.throws(() => createApp({ production: true, origin, dataDir: dir }), /HTTPS/)
  const prod = createApp({
    production: true,
    origin: 'https://staging.example.org',
    dataDir: dir,
    adminHash: hashPassword(password),
  })
  await new Promise((resolve) => prod.server.listen(0, '127.0.0.1', resolve))
  const response = await fetch(`http://127.0.0.1:${prod.server.address().port}/api/admin/login`, {
    method: 'POST',
    headers: { Origin: 'https://staging.example.org', 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  assert.equal(response.status, 200)
  assert.match(response.headers.get('set-cookie'), /; Secure/)
  assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000')
  await prod.close()
  rmSync(dir, { recursive: true, force: true })
  const otherDir = mkdtempSync(join(tmpdir(), 'ark-off-'))
  const disabled = createApp({ dataDir: otherDir, adminHash: '' })
  await new Promise((resolve) => disabled.server.listen(0, '127.0.0.1', resolve))
  const blocked = await fetch(
    `http://127.0.0.1:${disabled.server.address().port}/api/admin/content`,
  )
  assert.equal(blocked.status, 503)
  await disabled.close()
  rmSync(otherDir, { recursive: true, force: true })
})
