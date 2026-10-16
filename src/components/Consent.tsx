import { consentValue } from '../analytics'
import { useSyncExternalStore } from 'react'
const subscribe = (callback: () => void) => {
  window.addEventListener('ark-consent', callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener('ark-consent', callback)
    window.removeEventListener('storage', callback)
  }
}

function choose(value: string) {
  try {
    localStorage.setItem('ark-analytics', value)
  } catch {
    /* Browser storage may be disabled; analytics stays off. */
  }
  window.dispatchEvent(new Event('ark-consent'))
}
export function Consent() {
  const value = useSyncExternalStore(subscribe, consentValue, () => 'unset')
  return (
    <>
      {value === 'unset' && (
        <aside className="consent" aria-label="Optional analytics preferences">
          <p>
            <b>Your privacy, your choice.</b> We use no advertising cookies. May we count anonymous
            CTA interactions to improve this site? <a href="/privacy#analytics">Details</a>
          </p>
          <div>
            <button onClick={() => choose('declined')}>Essential only</button>
            <button onClick={() => choose('accepted')}>Allow analytics</button>
          </div>
        </aside>
      )}
      <button className="privacy-settings" onClick={() => choose('unset')}>
        Privacy settings
      </button>
    </>
  )
}
