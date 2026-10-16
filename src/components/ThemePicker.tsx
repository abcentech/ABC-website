import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
type Preference = 'light' | 'dark' | 'system'
function subscribe(callback: () => void) {
  window.addEventListener('ark-theme', callback)
  return () => window.removeEventListener('ark-theme', callback)
}
function snapshot() {
  return document.documentElement.dataset.themePreference || 'system'
}
function ThemeIcon({ kind }: { kind: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'light' ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
        </>
      ) : kind === 'dark' ? (
        <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z" />
      ) : (
        <>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8m-4-4v4" />
        </>
      )}
    </svg>
  )
}
export function ThemePicker() {
  const preference = useSyncExternalStore(subscribe, snapshot, () => 'system')
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggle.current?.focus()
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [open])
  function choose(value: Preference) {
    window.dispatchEvent(new CustomEvent('ark-theme-request', { detail: value }))
  }
  return (
    <div
      className="theme-picker"
      ref={container}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        className="theme-toggle"
        type="button"
        ref={toggle}
        aria-label="Appearance"
        aria-expanded={open}
        aria-controls="theme-options"
        title={`Appearance: ${preference}`}
        onClick={() => setOpen(!open)}
      >
        <ThemeIcon kind={preference} />
        <span className="theme-label">Theme</span>
      </button>
      <div id="theme-options" className="theme-panel" hidden={!open}>
        <fieldset>
          <legend>Appearance</legend>
          {(['light', 'dark', 'system'] as const).map((value) => (
            <label className="theme-option" key={value}>
              <input
                type="radio"
                name="ark-theme-choice"
                value={value}
                checked={preference === value}
                onChange={() => choose(value)}
              />
              <ThemeIcon kind={value} />
              <span>{value[0].toUpperCase() + value.slice(1)}</span>
              <span className="theme-check" aria-hidden="true">
                ✓
              </span>
            </label>
          ))}
        </fieldset>
        <p>System follows your device.</p>
      </div>
    </div>
  )
}
