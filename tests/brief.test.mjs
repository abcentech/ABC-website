import { test } from 'node:test'
import assert from 'node:assert/strict'
import { emptyBrief, createBriefMessage, stepError } from '../src/projectBrief.ts'
const slugs = ['website-development', 'custom-software']
const values = {
  ...emptyBrief,
  service: 'website-development',
  description: 'We need a clear, accessible corporate website for our organization.',
  budget: '$5k–$15k',
  name: 'Ada Example',
  organization: 'Example Organization',
  email: 'ada@example.org',
  country: 'Nigeria',
  consent: true,
}
test('brief gates every step on meaningful, valid context', () => {
  assert.ok(stepError(0, { ...emptyBrief }, slugs))
  assert.ok(stepError(0, { ...values, service: 'unknown-service' }, slugs))
  assert.equal(stepError(0, { ...values, service: 'not-sure' }, slugs), '')
  assert.ok(stepError(1, { ...values, description: ' '.repeat(40) }, slugs))
  assert.ok(stepError(1, { ...values, budget: 'Unapproved range' }, slugs))
  assert.ok(stepError(2, { ...values, email: 'not-an-email' }, slugs))
  assert.ok(stepError(2, { ...values, name: ' ' }, slugs))
  assert.ok(stepError(2, { ...values, consent: false }, slugs))
  for (let i = 0; i < 3; i++) assert.equal(stepError(i, values, slugs), '')
})
test('outbound brief keeps international input, scope and contact details without implying a submission', () => {
  const message = createBriefMessage(
    { ...values, name: '  Adé Example  ', country: 'Côte d’Ivoire', start: '2026-11-20' },
    'Website development',
  )
  for (const text of [
    'Adé Example',
    'Côte d’Ivoire',
    '2026-11-20',
    '$5k–$15k',
    'ada@example.org',
    'Website development',
    values.description,
  ])
    assert.ok(message.includes(text))
  assert.ok(!message.includes('consent:'))
  assert.ok(!message.includes('submitted successfully'))
  assert.ok(createBriefMessage(values, 'Website development').includes('Flexible / to discuss'))
})
