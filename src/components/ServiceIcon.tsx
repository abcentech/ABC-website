export function ServiceIcon({ kind }: { kind: string }) {
  return (
    <svg
      className="service-icon"
      width="26"
      height="26"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'website-development' ? (
        <>
          <rect x="4" y="5" width="24" height="22" rx="2" />
          <path d="M4 11h24M8 8h1m3 0h1M8 16h7v7H8zm11 0h5m-5 4h5m-5 3h3" />
        </>
      ) : kind === 'custom-software' ? (
        <>
          <path d="m16 3 12 7-12 7L4 10l12-7Zm-12 14 12 7 12-7M4 23l12 7 12-7" />
          <path d="M16 17v7" />
        </>
      ) : kind === 'mobile-app-development' ? (
        <>
          <rect x="9" y="3" width="14" height="26" rx="3" />
          <path d="M13 6h6m-4 19h2M9 10h14" />
        </>
      ) : kind === 'ai-automation' ? (
        <>
          <path d="M17 3v6m0 14v6M3 16h6m14 0h6M7 6l4 4m12 12 4 4M7 26l4-4m12-12 4-4" />
          <path d="m17 9 7 7-7 7-7-7 7-7Z" />
        </>
      ) : kind === 'technology-consulting' ? (
        <>
          <circle cx="16" cy="16" r="12" />
          <path d="m21 11-3 7-7 3 3-7 7-3Zm-5-8v3m0 20v3M3 16h3m20 0h3" />
        </>
      ) : (
        <>
          <rect x="5" y="5" width="22" height="22" rx="2" />
          <path d="M5 13h22M5 21h22M10 9h6m-6 8h6m5-8h1m-1 8h1m-12 8h12" />
        </>
      )}
    </svg>
  )
}
