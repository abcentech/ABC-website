// Test fixture only: binds loopback with an isolated temporary database and a known test credential.
import { createApp } from '../server/app.mjs'
import { hashPassword } from '../server/security.mjs'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
const directory = mkdtempSync(join(tmpdir(), 'ark-browser-admin-'))
const app = createApp({
  dataDir: directory,
  origin: 'http://127.0.0.1:3002',
  adminHash: hashPassword('test-only-browser-password'),
  production: false,
})
app.server.listen(3002, '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, async () => {
    await app.close()
    rmSync(directory, { recursive: true, force: true })
    process.exit(0)
  })
