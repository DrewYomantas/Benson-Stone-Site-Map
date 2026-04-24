const ITEMS = [
  { color: 'rgba(139,90,43,0.85)', border: '#c4a882', label: 'Building' },
  { color: 'rgba(30,80,30,0.80)', border: '#5a9e5a', label: 'Yard' },
  { color: 'rgba(20,70,110,0.85)', border: '#5aabde', label: 'Entrance / Site' },
  { color: 'rgba(180,30,30,0.90)', border: '#ff6060', label: 'Door' },
]

const STATUS_ITEMS = [
  { dot: '#3a8c5c', label: 'Verified' },
  { dot: '#c9a84c', label: 'Partially Verified' },
  { dot: '#7a8899', label: 'Unverified' },
  { dot: '#c0522a', label: 'Needs Review' },
]

export function Legend() {
  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2 pointer-events-none">
      <div
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(26,26,26,0.85)', borderRadius: 10, border: '1px solid rgba(196,168,130,0.15)', padding: '10px 12px' }}
      >
        <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
          Location type
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ITEMS.map(({ color, border, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 13, background: color, border: `1px solid ${border}`, borderRadius: 3, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#a09880' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{ backdropFilter: 'blur(8px)', background: 'rgba(26,26,26,0.85)', borderRadius: 10, border: '1px solid rgba(196,168,130,0.15)', padding: '10px 12px' }}
      >
        <p style={{ fontSize: 9, fontFamily: 'DM Mono, monospace', color: '#6b5f4a', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
          Verification status
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {STATUS_ITEMS.map(({ dot, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontFamily: 'DM Mono, monospace', color: '#a09880' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
