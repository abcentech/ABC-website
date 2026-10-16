import { scryptSync, randomBytes, timingSafeEqual, createHash } from 'node:crypto'
export function hashPassword(password) {
  if (password.length < 14) throw new Error('Use at least 14 characters')
  const salt = randomBytes(24).toString('hex')
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`
}
export function verifyPassword(password, stored) {
  if (
    typeof password !== 'string' ||
    password.length > 500 ||
    !/^scrypt:[a-f0-9]{48}:[a-f0-9]{128}$/.test(stored || '')
  )
    return false
  const [, salt, expected] = stored.split(':')
  const actual = scryptSync(password, salt, 64)
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'))
}
export const digest = (value) => createHash('sha256').update(value).digest('hex')
export const token = () => randomBytes(32).toString('hex')
