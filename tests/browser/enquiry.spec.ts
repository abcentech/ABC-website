import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
async function next(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
}
async function audit(page: import('@playwright/test').Page) {
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  )
}
for (const theme of ['light', 'dark'] as const)
  test(`guided enquiry is accessible through every step in ${theme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
    await page.goto('/services/website-development')
    await page.getByRole('button', { name: 'Essential only' }).click()
    await page.getByRole('link', { name: 'Discuss website development', exact: true }).click()
    await expect(page).toHaveURL(/start-project\?service=website-development$/)
    await expect(page.getByRole('radio', { name: /^Website development/ })).toBeChecked()
    await audit(page)
    await next(page)
    await expect(page.getByRole('heading', { name: 'What would better look like?' })).toBeFocused()
    await page
      .getByLabel('What problem')
      .fill(
        'We want to replace disconnected spreadsheets with a portal that makes our daily work easier.',
      )
    await page.getByRole('radio', { name: '$15k–$30k', exact: true }).check()
    await page.getByLabel('Desired project start date').fill('2026-11-20')
    await audit(page)
    await next(page)
    await page.getByLabel('Full name').fill('Sam Example')
    await page.getByLabel('Organization').fill('Example Company')
    await page.getByLabel('Work email').fill('sam@example.org')
    await page.getByLabel('Country').fill('Switzerland')
    await next(page)
    await expect(page.getByRole('heading', { name: 'Who are we building with?' })).toBeVisible()
    await page.getByRole('checkbox').check()
    await audit(page)
    await next(page)
    await expect(page.locator('.review-card')).toContainText('Website development')
    await expect(page.locator('.review-contact')).toContainText('Sam Example')
    await audit(page)
    const text = new URL(
      (await page.getByRole('link', { name: 'Continue to WhatsApp' }).getAttribute('href'))!,
    ).searchParams.get('text')!
    expect(text).toContain('sam@example.org')
    expect(text).toContain('2026-11-20')
    expect(text).toContain('$15k–$30k')
    await page.getByRole('button', { name: 'Edit scope & timing' }).click()
    await expect(page.getByLabel('What problem')).toHaveValue(/disconnected spreadsheets/)
    await page.getByRole('radio', { name: 'Not sure', exact: true }).check()
    await next(page)
    await expect(page.getByLabel('Full name')).toHaveValue('Sam Example')
    await next(page)
    expect(
      new URL(
        (await page.getByRole('link', { name: 'Continue to WhatsApp' }).getAttribute('href'))!,
      ).searchParams.get('text'),
    ).toContain('Budget: Not sure')
    await page.screenshot({
      path: `docs/screenshots/enquiry-review-${theme}.png`,
      fullPage: true,
      animations: 'disabled',
    })
  })
test('whitespace is rejected, keyboard choices work, and answers are not stored in browser storage', async ({
  page,
}) => {
  const posted: string[] = []
  page.on('request', (r) => {
    if (r.method() === 'POST') posted.push(r.postData() || '')
  })
  await page.goto('/start-project?service=unknown')
  await page.getByRole('button', { name: 'Essential only' }).click()
  await page.getByRole('radio', { name: /^Website development/ }).focus()
  await page.keyboard.press('Space')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio', { name: /^Custom software/ })).toBeChecked()
  await next(page)
  await page.getByLabel('What problem').fill(' '.repeat(40))
  await page.getByRole('radio', { name: 'Not sure', exact: true }).check()
  await next(page)
  await expect(page.getByRole('alert')).toContainText('at least 30 characters')
  await page
    .getByLabel('What problem')
    .fill('We need to bring project approvals and reporting into one shared system.')
  await next(page)
  await page.getByLabel('Full name').fill('Private Test Name')
  await page.getByLabel('Organization').fill('Private Test Organization')
  await page.getByLabel('Work email').fill('private@example.org')
  await page.getByLabel('Country').fill('Nigeria')
  await page.getByRole('checkbox').check()
  await next(page)
  const saved = await page.evaluate(() =>
    JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }),
  )
  expect(saved).not.toContain('Private Test')
  expect(saved).not.toContain('private@example.org')
  expect(posted.join('')).not.toContain('Private Test')
  await page.getByRole('button', { name: 'Return to Your project' }).click()
  await expect(page.getByRole('radio', { name: /^Custom software/ })).toBeChecked()
  await page.reload()
  await next(page)
  await expect(page.getByRole('heading', { name: 'What can we help you build?' })).toBeVisible()
})
test('copy has a successful state and an honest fallback when clipboard access is denied', async ({
  page,
}) => {
  await page.goto('/start-project?service=website-development')
  await next(page)
  await page
    .getByLabel('What problem')
    .fill('We need a new website that helps customers understand our offering and contact us.')
  await page.getByRole('radio', { name: 'Not sure', exact: true }).check()
  await next(page)
  await page.getByLabel('Full name').fill('Copy Test')
  await page.getByLabel('Organization').fill('Example Org')
  await page.getByLabel('Work email').fill('copy@example.org')
  await page.getByLabel('Country').fill('Nigeria')
  await page.getByRole('checkbox').check()
  await next(page)
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          Reflect.set(window, 'copiedBrief', text)
        },
      },
    }),
  )
  await page.getByRole('button', { name: 'Copy brief instead' }).click()
  await expect(page.getByRole('status')).toContainText('Brief copied')
  expect(await page.evaluate(() => Reflect.get(window, 'copiedBrief'))).toContain('Copy Test')
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied')
        },
      },
    }),
  )
  await page.getByRole('button', { name: 'Copy brief instead' }).click()
  await expect(page.getByRole('status')).toContainText('Copy is unavailable')
  await expect(page.locator('.message-details')).toHaveAttribute('open', '')
})
test('desktop and mobile show the first decision promptly and keep the full journey within the viewport width', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme })
    for (const width of [360, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.goto('/start-project')
      if (await page.getByRole('button', { name: 'Essential only' }).count())
        await page.getByRole('button', { name: 'Essential only' }).click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      expect(
        (await page
          .getByRole('radio', { name: /^Website development/ })
          .locator('..')
          .boundingBox())!.y,
      ).toBeLessThan(800)
      if (width === 1440 || width === 390)
        await page.screenshot({
          path: `docs/screenshots/enquiry-${theme}-${width}.png`,
          fullPage: true,
          animations: 'disabled',
        })
      await page.getByRole('radio', { name: /^Website development/ }).check()
      await next(page)
      await page
        .getByLabel('What problem')
        .fill('We need a website and a clearer way for customers to contact our organization.')
      await page.getByRole('radio', { name: '$1k–$5k', exact: true }).check()
      await next(page)
      await page.getByLabel('Full name').fill('Mobile Test')
      await page.getByLabel('Organization').fill('Example Org')
      await page.getByLabel('Work email').fill('mobile@example.org')
      await page.getByLabel('Country').fill('Nigeria')
      await page.getByRole('checkbox').check()
      await next(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
  }
})
