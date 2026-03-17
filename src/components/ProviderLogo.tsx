// Styled provider logos — inline SVG/CSS, no external dependency

type Props = { provider: string; size?: number }

const PROVIDER_ICONS: Record<string, (c: string, s: number) => JSX.Element> = {
  bgaming:    (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="3" stroke={c} strokeWidth="1.8"/><circle cx="8" cy="12" r="1.5" fill={c}/><circle cx="12" cy="12" r="1.5" fill={c}/><circle cx="16" cy="12" r="1.5" fill={c}/></svg>,
  bng:        (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill={c} opacity="0.8"/><line x1="12" y1="3" x2="12" y2="9" stroke={c} strokeWidth="1.5"/><line x1="12" y1="15" x2="12" y2="21" stroke={c} strokeWidth="1.5"/><line x1="3" y1="12" x2="9" y2="12" stroke={c} strokeWidth="1.5"/><line x1="15" y1="12" x2="21" y2="12" stroke={c} strokeWidth="1.5"/></svg>,
  platipus:   (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3C8 3 5 6 5 9c0 2 1 4 3 5l-2 4h12l-2-4c2-1 3-3 3-5 0-3-3-6-7-6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="10" cy="9" r="1" fill={c}/><circle cx="14" cy="9" r="1" fill={c}/></svg>,
  turbogames: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M13 2L4.5 13.5H11L9 22L20 10H13.5L13 2z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  gamzix:     (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke={c} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill={c} opacity="0.7"/></svg>,
  xstudios:   (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 4l16 16M20 4L4 20" stroke={c} strokeWidth="2.5" strokeLinecap="round"/></svg>,
  spinocchio: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/><path d="M12 8v4l3 3" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="1.5" fill={c}/></svg>,
  betora:     (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  aviatrix:   (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 16l-7-5-1 6-4-3-4 2 2-4-3-4 6 1L15 3l1 7 5 6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  novomatic:  (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="3" y="9" width="18" height="13" rx="1.5" stroke={c} strokeWidth="1.8"/><path d="M9 22V12h6v10" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M3 9l9-7 9 7" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

const CONFIGS: Record<string, { label: string; bg: string; color: string; accent: string }> = {
  bgaming:    { label: 'BGaming',     bg: '#0d2e1a', color: '#00E676', accent: '#00ff88' },
  bng:        { label: 'BNG',         bg: '#0d1f2e', color: '#1475e1', accent: '#2F7BED' },
  platipus:   { label: 'Platipus',    bg: '#1a0d2e', color: '#A855F7', accent: '#c084fc' },
  turbogames: { label: 'Turbo',       bg: '#2e1a0d', color: '#FF6B35', accent: '#ff8c5a' },
  gamzix:     { label: 'Gamzix',      bg: '#1a0d2e', color: '#8B5CF6', accent: '#a78bfa' },
  xstudios:   { label: 'XStudios',    bg: '#0d1a2e', color: '#3B82F6', accent: '#60a5fa' },
  spinocchio: { label: 'Spinocchio',  bg: '#2e1a0d', color: '#F59E0B', accent: '#fbbf24' },
  betora:     { label: 'Betora',      bg: '#2e0d1a', color: '#EC4899', accent: '#f472b6' },
  aviatrix:   { label: 'Aviatrix',    bg: '#2e0d0d', color: '#EF4444', accent: '#f87171' },
  novomatic:  { label: 'Novomatic',   bg: '#0d0d2e', color: '#6366F1', accent: '#818cf8' },
}

export default function ProviderLogo({ provider, size = 100 }: Props) {
  const cfg = CONFIGS[provider] || {
    label: provider.charAt(0).toUpperCase() + provider.slice(1),
    bg: '#213743', color: '#00d4aa', accent: '#00ffcc', icon: '🎰',
  }

  const h = Math.round(size * 0.6)

  return (
    <div style={{
      width: size, height: h,
      background: `linear-gradient(135deg, ${cfg.bg}, #1a2c38)`,
      border: `1px solid ${cfg.color}50`,
      borderRadius: 10,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 4,
      position: 'relative', overflow: 'hidden',
      flexShrink: 0,
    }}>
      {/* Glow effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 40%, ${cfg.color}20 0%, transparent 70%)`,
      }} />
      {/* Bottom accent bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
      }} />
      {/* Icon */}
      <div style={{ zIndex: 1 }}>{(PROVIDER_ICONS[provider] || PROVIDER_ICONS['betora'])(cfg.color, Math.round(size * 0.28))}</div>
      {/* Label */}
      <div style={{
        fontSize: size * 0.13, fontWeight: 800,
        color: cfg.color, letterSpacing: 0.5,
        zIndex: 1, textAlign: 'center', lineHeight: 1,
      }}>
        {cfg.label.toUpperCase()}
      </div>
    </div>
  )
}
