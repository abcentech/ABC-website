import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
test('administrator can manage content drafts and private enquiry records', async ({ page }) => {
  await page.goto('http://127.0.0.1:3002/admin')
  await page.getByLabel('Administrator password').fill('test-only-browser-password')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Save content draft' })).toBeVisible()
  await page.getByRole('button', { name: 'Faqs', exact: true }).click()
  const editor = page.getByLabel('faqs content')
  const original = await editor.inputValue()
  await editor.fill(
    '[{"question":"How do we start?","answer":"Discuss your requirements in WhatsApp."}]',
  )
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Save content draft' }).click()
  await expect(page.getByRole('status')).toContainText('Draft saved')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export saved content' }).click()
  expect((await download).suggestedFilename()).toBe('ark-content.json')
  await editor.fill(original)
  await page.getByRole('button', { name: 'Save content draft' }).click()
  await page.getByRole('button', { name: 'Leads', exact: true }).click()
  await page.getByLabel('Name', { exact: true }).fill('Example Contact')
  await page.getByLabel('Organization', { exact: true }).fill('Example Company')
  await page.getByLabel('Email (optional)').fill('contact@example.org')
  await page
    .getByLabel('Follow-up notes')
    .fill('Permission confirmed for a discussion about a publishing website.')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Add enquiry' }).click()
  await expect(
    page.getByRole('cell', {
      name: 'Example Contact Example Company contact@example.org',
      exact: true,
    }),
  ).toBeVisible()
  await page.getByRole('combobox', { name: 'Status for Example Contact' }).selectOption('Proposal')
  await expect(page.getByRole('status')).toContainText('Status updated')
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(audit.violations).toEqual([])
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete Example Contact' }).click()
  await expect(page.getByText('No recorded enquiries.')).toBeVisible()
  await page.getByRole('button', { name: 'Report', exact: true }).click()
  await expect(page.getByText('Enquiry record added')).toBeVisible()
  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible()
})
