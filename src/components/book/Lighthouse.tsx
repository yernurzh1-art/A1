import { useId } from 'react'

/** Lighthouse on rocks (SVG). `lit` adds a glowing window and a light beam. */
export function Lighthouse({ lit = false, beam = false, className }: { lit?: boolean; beam?: boolean; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const beamId = `lh-beam${uid}`
  const glowId = `lh-glow${uid}`
  return (
    <svg viewBox="0 0 200 300" className={className} aria-hidden>
      <defs>
        <linearGradient id={beamId} x1="0" x2="1">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {beam && (
        <g className="animate-[spin_9s_linear_infinite]" style={{ transformOrigin: '100px 62px' }}>
          <polygon points="100,62 300,20 300,104" fill={`url(#${beamId})`} />
          <polygon points="100,62 -100,20 -100,104" fill={`url(#${beamId})`} opacity="0.5" />
        </g>
      )}
      {lit && <circle cx="100" cy="62" r="46" fill={`url(#${glowId})`} />}
      {/* rocks */}
      <path d="M10 300 L30 250 L60 262 L80 240 L120 244 L150 236 L175 258 L195 300 Z" fill="#1e1b3a" />
      {/* tower */}
      <path d="M78 245 L86 92 L114 92 L122 245 Z" fill="#f8fafc" />
      <path d="M80.8 200 L119.2 200 L120.4 222 L79.6 222 Z" fill="#ef4444" />
      <path d="M83.2 150 L116.8 150 L118 170 L82 170 Z" fill="#ef4444" />
      <path d="M85.4 108 L114.6 108 L115.4 124 L84.6 124 Z" fill="#ef4444" />
      <rect x="95" y="226" width="10" height="19" rx="4" fill="#1e3a8a" />
      {/* lamp room */}
      <rect x="82" y="84" width="36" height="8" rx="2" fill="#334155" />
      <rect x="88" y="52" width="24" height="32" rx="3" fill={lit ? '#fde047' : '#64748b'} />
      <path d="M84 52 L100 36 L116 52 Z" fill="#334155" />
      <circle cx="100" cy="33" r="3" fill="#334155" />
      <rect x="96" y="180" width="8" height="10" rx="2" fill={lit ? '#fde047' : '#94a3b8'} />
    </svg>
  )
}
