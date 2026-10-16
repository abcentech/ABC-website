/* Applied before styles/React to avoid a light flash. No tracking or network requests. */
;(function () {
  const root = document.documentElement
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const choices = ['light', 'dark', 'system']
  const valid = (value) => (choices.includes(value) ? value : 'system')
  function apply(preference) {
    root.dataset.themePreference = preference
    root.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = root.dataset.theme === 'dark' ? '#091321' : '#fafbf9'
    window.dispatchEvent(new Event('ark-theme'))
  }
  let saved = 'system'
  try {
    saved = valid(localStorage.getItem('ark-theme'))
  } catch {
    /* System theme works without storage. */
  }
  apply(saved)
  media.addEventListener('change', () => {
    if (root.dataset.themePreference === 'system') apply('system')
  })
  window.addEventListener('storage', (event) => {
    if (event.key === 'ark-theme' || event.key === null) apply(valid(event.newValue))
  })
  window.addEventListener('ark-theme-request', (event) => {
    const preference = valid(event.detail)
    try {
      localStorage.setItem('ark-theme', preference)
    } catch {
      /* Preference still works for this page. */
    }
    // Native transitions enhance the switch; changing theme never depends on them.
    if (
      document.startViewTransition &&
      document.readyState !== 'loading' &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.startViewTransition(() => apply(preference))
    } else apply(preference)
  })
})()
