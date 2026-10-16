import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import content from '../../src/content/site.json' with { type: 'json' }
const pages = [
  '/',
  '/services',
  ...content.services.map((s) => `/services/${s.slug}`),
  '/work',
  ...content.projects.map((p) => `/work/${p.slug}`),
  '/industries',
  '/capabilities',
  '/contact',
  '/start-project',
  '/insights',
  '/privacy',
]
for (const path of pages)
  test(`dark theme accessibility: ${path}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(path)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([])
    expect(errors).toEqual([])
  })
test('theme follows system, remembers manual selection across pages, and supports keyboard choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Appearance', exact: true }).click()
  await page.getByRole('radio', { name: 'Light', exact: true }).check()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.getByRole('radio', { name: 'Light', exact: true }).focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeChecked()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Appearance', exact: true })).toBeFocused()
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('ark-theme'))).toBe('dark')
  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('button', { name: 'Appearance', exact: true }).click()
  await page.getByRole('radio', { name: 'System', exact: true }).check()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})
test('saved theme applies before React loads, and blocked storage has a working fallback', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('ark-theme', 'dark'))
  await page.route('**/assets/*.js', (route) => route.abort())
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.locator('body').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    'rgb(9, 19, 33)',
  )
})
test('theme works without browser storage and dismisses outside its panel', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked', 'SecurityError')
      },
    }),
  )
  await page.goto('/')
  await page.getByRole('button', { name: 'Appearance', exact: true }).click()
  await page.getByRole('radio', { name: 'Dark', exact: true }).check()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.getByRole('heading', { level: 1 }).click()
  await expect(page.getByRole('radio', { name: 'Dark', exact: true })).toBeHidden()
})
test('interactive states, native page transitions and reduced-motion preference remain functional', async ({
  page,
}) => {
  await page.goto('/services/website-development')
  const button = page.locator('.page-hero .button')
  await button.hover()
  expect(await button.evaluate((el) => getComputedStyle(el).transitionDuration)).not.toBe('0s')
  await page.mouse.down()
  await expect(button).toHaveAttribute('data-pressed', 'true')
  await page.mouse.up()
  await expect(page).toHaveURL(/\/start-project$/)
  await page.goto('/services/website-development')
  const summary = page.locator('.faq-list summary').first()
  await summary.click()
  await expect(page.locator('.faq-list details').first()).toHaveAttribute('open', '')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.faq-list details').first()).not.toHaveAttribute('open')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(await button.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe('0s')
  await page.goto('/')
  expect(
    await page.locator('.trace-light').evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none')
  await page.getByRole('link', { name: 'Explore Our Work', exact: true }).click()
  await expect(page).toHaveURL(/\/work$/)
})
test('both themes stay responsive and provide desktop/mobile previews', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme })
    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.goto('/')
    if (await page.getByRole('button', { name: 'Essential only' }).count())
      await page.getByRole('button', { name: 'Essential only' }).click()
    await page.screenshot({
      path: `docs/screenshots/premium-${theme}-desktop.png`,
      fullPage: true,
      animations: 'disabled',
    })
    await page.screenshot({
      path: `docs/screenshots/premium-${theme}-hero.png`,
      animations: 'disabled',
    })
    for (const width of [360, 390, 768, 1024]) {
      await page.setViewportSize({ width, height: 844 })
      for (const path of ['/', '/start-project', '/services/website-development']) {
        await page.goto(path)
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        )
      }
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.screenshot({
      path: `docs/screenshots/premium-${theme}-mobile.png`,
      fullPage: true,
      animations: 'disabled',
    })
    await page.getByRole('button', { name: 'Appearance', exact: true }).click()
    const mobileAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      mobileAudit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([])
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Menu', exact: true }).click()
    await expect(page.getByRole('link', { name: 'Services', exact: true })).toBeVisible()
    await page.keyboard.press('Escape')
  }
})
