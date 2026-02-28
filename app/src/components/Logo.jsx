export default function Logo({ size = 36, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="152" height="152" rx="40" fill="#426F80"/>
      <rect x="4" y="4" width="152" height="152" rx="40" fill="url(#logoGlow)"/>
      <rect x="20" y="100" width="36" height="36" rx="10" fill="#BA5B47"/>
      <rect x="20" y="100" width="36" height="18" rx="10" fill="rgba(255,255,255,0.08)"/>
      <rect x="62" y="64" width="36" height="36" rx="10" fill="#D38C46"/>
      <rect x="62" y="64" width="36" height="18" rx="10" fill="rgba(255,255,255,0.08)"/>
      <rect x="104" y="24" width="40" height="40" rx="11" fill="#FAF3EB"/>
      <rect x="119" y="31" width="10" height="26" rx="2.5" fill="#426F80"/>
      <rect x="111" y="39" width="26" height="10" rx="2.5" fill="#426F80"/>
      <line x1="38" y1="100" x2="124" y2="24" stroke="#A1B9C5" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" strokeDasharray="5,4"/>
      <path d="M20 132 L40 132 L48 118 L56 142 L64 126 L74 132 L100 132" stroke="#A1B9C5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
      <defs>
        <radialGradient id="logoGlow" cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
      </defs>
    </svg>
  )
}
