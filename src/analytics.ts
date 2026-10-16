export function consentValue() {
  try {
    return localStorage.getItem('ark-analytics') || 'unset'
  } catch {
    return 'unavailable'
  }
}
