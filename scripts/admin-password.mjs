import { hashPassword } from '../server/security.mjs'
if (process.stdin.isTTY) {
  console.error(
    'Pipe a password of at least 14 characters over stdin. Do not put credentials in command arguments or shell history.',
  )
  process.exit(1)
}
let input = ''
for await (const chunk of process.stdin) {
  input += chunk
  if (input.length > 501) throw new Error('Password too long')
}
process.stdout.write(`${hashPassword(input.replace(/\r?\n$/, ''))}\n`)
