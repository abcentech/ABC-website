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
  test(`accessible, direct HTML route: ${path}`, async ({ page, request }) => {
    const response = await request.get(path)
    expect(response.status()).toBe(200)
    const html = await response.text()
    expect(html).toContain('<h1>')
    expect(html).toContain('rel="canonical"')
    expect(html).toContain('property="og:title"')
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(path)
    await expect(page.locator('h1')).toHaveCount(1)
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
    ).toEqual([])
    expect(errors).toEqual([])
  })
test('desktop and mobile layouts, navigation, keyboard and reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Essential only' }).click()
  await page.screenshot({
    path: 'docs/screenshots/home-desktop.png',
    fullPage: true,
    animations: 'disabled',
  })
  await page.reload()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      '/',
      '/start-project',
      '/work/base-coldtivate',
      '/services/website-development',
    ]) {
      await page.goto(path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
  await page.getByRole('link', { name: 'Services', exact: true }).focus()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused()
  await page.screenshot({
    path: 'docs/screenshots/home-mobile.png',
    fullPage: true,
    animations: 'disabled',
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  expect(
    await page
      .locator('.trace-light')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none')
  await page.getByRole('button', { name: 'Menu' }).click()
  await page.getByRole('link', { name: 'Work', exact: true }).click()
  await expect(page).toHaveURL(/\/work$/)
})
test('project brief validates, preserves answers, and hands off without claiming submission', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/start-project')
  await page.getByRole('button', { name: 'Essential only' }).click()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'What can we help you build?' })).toBeVisible()
  await page.getByRole('radio', { name: /^Website development/ }).check()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page
    .getByLabel('What problem')
    .fill(
      'We need an accessible website that explains our services and makes enquiries straightforward.',
    )
  await page.getByRole('radio', { name: '$5k–$15k', exact: true }).check()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await page.getByLabel('Full name').fill('Ada Example')
  await page.getByLabel('Organization', { exact: false }).fill('Example Organization')
  await page.getByLabel('Work email').fill('ada@example.org')
  await page.getByLabel('Country').fill('Nigeria')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'A considered beginning.' })).toBeFocused()
  await expect(page.locator('.review-notice')).toContainText('has not been sent')
  const link = page.getByRole('link', { name: 'Continue to WhatsApp' })
  const url = new URL((await link.getAttribute('href'))!)
  expect(url.hostname).toBe('wa.me')
  expect(url.pathname).toBe('/2348066512844')
  expect(url.searchParams.get('text')).toContain('Ada Example')
  expect(url.searchParams.get('text')).toContain('$5k–$15k')
  await page.screenshot({
    path: 'docs/screenshots/project-brief-mobile.png',
    fullPage: true,
    animations: 'disabled',
  })
  await page.getByRole('button', { name: 'Edit details' }).click()
  await expect(page.getByLabel('Organization', { exact: false })).toHaveValue(
    'Example Organization',
  )
  await page.getByLabel('Organization', { exact: false }).fill('Changed Organization')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  expect(new URL((await link.getAttribute('href'))!).searchParams.get('text')).toContain(
    'Changed Organization',
  )
})
test('cookie choice controls aggregate events, persists and can be revoked', async ({ page }) => {
  let events = 0
  await page.route('**/api/events', (route) => {
    events++
    return route.fulfill({ status: 202, body: '{}' })
  })
  await page.goto('/')
  await page.getByRole('link', { name: 'Start a Project', exact: true }).first().click()
  expect(events).toBe(0)
  await page.getByRole('button', { name: 'Allow analytics' }).click()
  await page
    .getByRole('link', { name: 'Chat on WhatsApp' })
    .evaluate((el) => el.removeAttribute('target'))
  await page.route('https://wa.me/**', (route) => route.abort())
  await page.getByRole('link', { name: 'Chat on WhatsApp' }).click()
  await expect.poll(() => events).toBe(1)
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Allow analytics' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Privacy settings' }).click()
  await page.getByRole('button', { name: 'Essential only' }).click()
  expect(await page.evaluate(() => localStorage.getItem('ark-analytics'))).toBe('declined')
})
test('case studies preserve status, concepts and evidence boundaries', async ({ page }) => {
  await page.goto('/work/base-coldtivate')
  await expect(
    page.getByRole('heading', { name: 'Historical proposal topics — not confirmed deliverables' }),
  ).toBeVisible()
  await expect(page.locator('.concept-label')).toContainText('NOT A PRODUCT SCREENSHOT')
  await page.getByRole('button', { name: 'Essential only' }).click()
  await page.screenshot({
    path: 'docs/screenshots/base-case-study.png',
    fullPage: true,
    animations: 'disabled',
  })
  await page.goto('/work/church-times-nigeria')
  await expect(page.locator('.page-hero .status')).toContainText('In development')
  await expect(
    page.getByRole('heading', { name: 'Proposed features — work in progress' }),
  ).toBeVisible()
  await page.screenshot({
    path: 'docs/screenshots/church-times-case-study.png',
    fullPage: true,
    animations: 'disabled',
  })
})
test('capability PDF, metadata assets, sitemap and truthful unavailable-admin error', async ({
  page,
  request,
}) => {
  const compressed = await request.get('/', { headers: { 'Accept-Encoding': 'br' } })
  expect(compressed.headers()['content-encoding']).toBe('br')
  const pdf = await request.get('/capability-statement.pdf')
  expect(pdf.status()).toBe(200)
  expect(pdf.headers()['content-type']).toBe('application/pdf')
  expect((await pdf.body()).subarray(0, 4).toString()).toBe('%PDF')
  const xml = await (await request.get('/sitemap.xml')).text()
  for (const path of pages)
    expect(xml).toContain(`https://arkbuilders.com.ng${path === '/' ? '/' : path}`)
  expect(xml).not.toContain('/admin')
  await page.goto('/services/custom-software')
  expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(
    'Custom software | Ark Builders',
  )
  const image = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect((await request.get(new URL(image!).pathname)).status()).toBe(200)
  expect((await request.get('/not-a-real-page')).status()).toBe(404)
  await page.goto('/admin')
  await page.getByLabel('Administrator password').fill('test-password-is-not-configured')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert')).toContainText('not enabled')
})
test('all internal links and home anchors resolve', async ({ page, request }) => {
  const checked = new Set<string>()
  for (const path of pages) {
    await page.goto(path)
    const links = await page
      .locator('a[href]')
      .evaluateAll((els) => els.map((el) => el.getAttribute('href')!))
    for (const href of links) {
      if (href.startsWith('#')) {
        expect(await page.locator(href).count()).toBeGreaterThan(0)
        continue
      }
      if (!href.startsWith('/') || checked.has(href)) continue
      checked.add(href)
      expect((await request.get(href)).status(), href).toBe(200)
    }
  }
})
