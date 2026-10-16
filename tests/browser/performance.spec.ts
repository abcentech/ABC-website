import { test, expect } from '@playwright/test'
import { writeFile } from 'node:fs/promises'
test('mobile lab rendering stays within LCP and layout stability budgets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0 }
    Object.defineProperty(window, '__arkMetrics', { value: metrics })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime
    }).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number }
        if (!shift.hadRecentInput) metrics.cls += shift.value
      }
    }).observe({ type: 'layout-shift', buffered: true })
  })
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: 1_600_000 / 8,
    uploadThroughput: 750_000 / 8,
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  const metrics = await page.evaluate(() => ({
    ...Reflect.get(window, '__arkMetrics'),
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    transferBytes: performance
      .getEntriesByType('resource')
      .reduce((sum, e) => sum + (e as PerformanceResourceTiming).transferSize, 0),
    externalRequests: performance
      .getEntriesByType('resource')
      .filter((e) => new URL(e.name).origin !== location.origin).length,
  }))
  expect(metrics.lcp).toBeGreaterThan(0)
  expect(metrics.lcp).toBeLessThan(2500)
  expect(metrics.cls).toBeLessThanOrEqual(0.1)
  expect(metrics.externalRequests).toBe(0)
  await writeFile(
    'docs/performance.json',
    JSON.stringify(
      {
        scope: 'Local production-build mobile lab check, not field Core Web Vitals',
        profile: '390x844, 4x CPU slowdown, 1.6 Mbps download, 150 ms latency',
        ...metrics,
      },
      null,
      2,
    ) + '\n',
  )
})
