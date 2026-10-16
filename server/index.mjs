import { createApp } from './app.mjs'
const app = createApp()
const port = Number(process.env.PORT || 3001)
const host = process.env.HOST || '127.0.0.1'
app.server.listen(port, host, () =>
  console.log(`Ark Builders server listening on ${host}:${port}. Enquiry channel: WhatsApp.`),
)
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, async () => {
    await app.close()
    process.exit(0)
  })
