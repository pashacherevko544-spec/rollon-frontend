import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'
const BLUE  = '#2F7BED'
const SUB   = '#8a9bb0'

// Countdown hook
function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    const iv = setInterval(() => setLeft(p => Math.max(0, p - 1)), 1000)
    return () => clearInterval(iv)
  }, [])
  const d = Math.floor(left / 86400)
  const h = Math.floor((left % 86400) / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return `${String(d).padStart(2,'0')}:${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

const WELCOME_SVGS = [
  (c: string) => <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="10" width="18" height="11" rx="2" stroke={c} strokeWidth="1.8"/><rect x="2" y="7" width="20" height="4" rx="1" stroke={c} strokeWidth="1.8"/><line x1="12" y1="7" x2="12" y2="21" stroke={c} strokeWidth="1.8"/><path d="M12 7s-1-4 2.5-4S17 7 12 7z" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M12 7s1-4-2.5-4S7 7 12 7z" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  (c: string) => <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/><path d="M8 12l3 3 5-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  (c: string) => <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  (c: string) => <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M2 8l4 8h12l4-8-6 3-4-6-4 6-6-3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><line x1="6" y1="16" x2="18" y2="16" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="7" y1="19" x2="17" y2="19" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
]

const WELCOME_BONUSES = [
  { deposit: '1-й депозит', bonus: '+100%', fs: '70 FS',  gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', shadow: '#f59e0b', locked: false, iconColor: '#fff' },
  { deposit: '2-й депозит', bonus: '+120%', fs: '100 FS', gradient: 'linear-gradient(135deg, #e056a0, #8b5cf6)', shadow: '#e056a0', locked: true,  iconColor: '#fff' },
  { deposit: '3-й депозит', bonus: '+130%', fs: '150 FS', gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', shadow: '#8b5cf6', locked: true,  iconColor: '#fff' },
  { deposit: '4-й депозит', bonus: '+150%', fs: '180 FS', gradient: 'linear-gradient(135deg, #2F7BED, #06b6d4)', shadow: '#2F7BED', locked: true,  iconColor: '#fff' },
]

const PROMO_ICONS: Record<string, (c: string) => JSX.Element> = {
  cashback: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h10a4 4 0 0 1 0 8H3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 4l-3 3 3 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="15" r="1.2" fill={c}/><circle cx="13" cy="15" r="1.2" fill={c}/></svg>,
  freespin: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/><line x1="12" y1="3" x2="12" y2="9" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="21" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="3" y1="12" x2="9" y2="12" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="15" y1="12" x2="21" y2="12" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  vip:      (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 8l4 8h12l4-8-6 3-4-6-4 6-6-3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><line x1="6" y1="16" x2="18" y2="16" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="7" y1="19" x2="17" y2="19" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  referral: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke={c} strokeWidth="1.8"/><circle cx="17" cy="11" r="2.5" stroke={c} strokeWidth="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 13.5c1.9.5 3 2.2 3 4.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
}

const PROMO_BONUSES = [
  {
    title: 'Кешбек 10%',
    desc: 'Повертаємо 10% від програних коштів щотижня',
    gradient: 'linear-gradient(135deg, #00d4aa22, #00d4aa08)',
    border: '#00d4aa33',
    accent: GREEN,
    iconKey: 'cashback',
    tag: 'ЩОТИЖЕНЬ',
  },
  {
    title: 'Фріспіни за реєстрацію',
    desc: '50 безкоштовних спінів для нових гравців',
    gradient: 'linear-gradient(135deg, #f59e0b22, #f59e0b08)',
    border: '#f59e0b33',
    accent: '#f59e0b',
    iconKey: 'freespin',
    tag: 'НОВАЧКАМ',
  },
  {
    title: 'VIP Програма',
    desc: 'Ексклюзивні бонуси та персональний менеджер',
    gradient: 'linear-gradient(135deg, #8b5cf622, #8b5cf608)',
    border: '#8b5cf633',
    accent: '#8b5cf6',
    iconKey: 'vip',
    tag: 'VIP',
  },
  {
    title: 'Реферальна програма',
    desc: '+5% від кожного депозиту вашого друга',
    gradient: 'linear-gradient(135deg, #2F7BED22, #2F7BED08)',
    border: '#2F7BED33',
    accent: BLUE,
    iconKey: 'referral',
    tag: 'РЕФЕРАЛ',
  },
]

function WelcomeCard({ b, index }: { b: typeof WELCOME_BONUSES[0]; index: number }) {
  const nav = useNavigate()
  const timer = useCountdown(29 * 86400 + 23 * 3600 + 36 * 60 + 7 + index * 1000)

  return (
    <div style={{
      flexShrink: 0, width: 220,
      borderRadius: 18, overflow: 'hidden',
      background: b.gradient,
      boxShadow: `0 8px 32px ${b.shadow}44`,
      position: 'relative',
      cursor: b.locked ? 'default' : 'pointer',
      transition: 'transform .15s',
    }}
    onMouseEnter={e => !b.locked && ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)')}
    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1)')}
    onClick={() => !b.locked && nav('/deposit')}
    >
      {/* Decorative circle */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', bottom: -10, left: -10, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />

      <div style={{ padding: '20px 18px 18px', position: 'relative' }}>
        {/* SVG icon */}
        <div style={{ marginBottom: 12, opacity: b.locked ? 0.6 : 1 }}>{WELCOME_SVGS[index]?.('rgba(255,255,255,0.9)')}</div>

        {/* Deposit label */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5, marginBottom: 6 }}>{b.deposit}</div>

        {/* Bonus amount */}
        <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{b.bonus}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 14 }}>{b.fs}</div>

        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 14 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontFamily: 'monospace' }}>{timer}</span>
        </div>

        {/* Button */}
        <button style={{
          width: '100%', padding: '10px', borderRadius: 10,
          background: b.locked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)',
          border: 'none', cursor: b.locked ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontWeight: 800, fontSize: 13,
          color: b.locked ? 'rgba(255,255,255,0.6)' : '#0f212e',
          backdropFilter: 'blur(4px)',
        }}>
          {b.locked && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
          {b.locked ? 'Недоступно' : 'Отримати'}
        </button>
      </div>
    </div>
  )
}

export default function Bonuses() {
  const nav = useNavigate()
  const { user } = useUser()

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 12v10H4V12" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7H2v5h20V7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V7" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Бонуси</h1>
        </div>
        <p style={{ fontSize: 13, color: SUB, margin: 0 }}>Заробляй більше з нашими акціями та пропозиціями</p>
      </div>

      {/* Welcome bonuses */}
      <div style={{ padding: '0 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Вітальні бонуси</div>
            <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>Бонуси до 500% на депозити</div>
          </div>
          <span style={{ background: `${GREEN}22`, border: `1px solid ${GREEN}44`, borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700, color: GREEN }}>4 бонуси</span>
        </div>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 12, padding: '0 16px 20px', scrollbarWidth: 'none' }}>
        {WELCOME_BONUSES.map((b, i) => <WelcomeCard key={i} b={b} index={i} />)}
      </div>

      {/* Promo bonuses */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#fff', marginBottom: 14 }}>Доступні бонуси</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PROMO_BONUSES.map((b, i) => (
            <div key={i} onClick={() => nav(i === 3 ? '/referral' : '/deposit')} style={{
              background: b.gradient, border: `1px solid ${b.border}`,
              borderRadius: 16, padding: '18px 16px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'transform .15s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateX(4px)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateX(0)'}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${b.accent}22`, border: `1px solid ${b.accent}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {PROMO_ICONS[b.iconKey]?.(b.accent)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{b.title}</span>
                  <span style={{ background: `${b.accent}33`, border: `1px solid ${b.accent}55`, borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 800, color: b.accent }}>{b.tag}</span>
                </div>
                <div style={{ fontSize: 12, color: SUB, lineHeight: 1.4 }}>{b.desc}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="9,18 15,12 9,6" stroke={SUB} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — if not logged in */}
      {!user && (
        <div style={{ margin: '20px 16px 0', padding: '20px', borderRadius: 16, background: `linear-gradient(135deg, ${BLUE}22, ${GREEN}11)`, border: `1px solid ${BLUE}33`, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Зареєструйтесь щоб отримати бонуси</div>
          <div style={{ fontSize: 13, color: SUB, marginBottom: 16 }}>Отримай +100% на перший депозит</div>
          <button onClick={() => nav('/')} style={{ background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', borderRadius: 12, padding: '12px 32px', color: '#0f212e', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            Зареєструватись
          </button>
        </div>
      )}

      {/* Site footer info */}
      <div style={{ margin: '8px 16px 0', padding: '20px', background: '#1a2c38', border: '1px solid #2d4a5a', borderRadius: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>R<span style={{ color: '#2F7BED' }}>◆</span>LLON</div>
          <div style={{ fontSize: 13, color: '#8a9bb0', lineHeight: 1.6, maxWidth: 480 }}>Rollon — ліцензована онлайн платформа для азартних ігор. Ми пропонуємо найкращі слоти, live казино, ставки та predict markets. Відповідальна гра — наш пріоритет.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 20, marginBottom: 20 }}>
          {[
            { title: 'Казино', links: ['Слоти', 'Live Casino', 'Rollon Games', 'Провайдери'] },
            { title: 'Інформація', links: ['Про нас', 'Умови та правила', 'Конфіденційність', 'Відповідальна гра'] },
            { title: 'Акаунт', links: ['Реєстрація', 'Депозит', 'Виведення', 'Профіль'] },
            { title: 'Партнерам', links: ['Реферальна програма', 'Партнерська угода', 'Виплати', 'Контакти'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: 0.5, marginBottom: 10 }}>{col.title.toUpperCase()}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 12, color: '#557086', marginBottom: 6, cursor: 'pointer', transition: 'color .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#00d4aa'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = '#557086'}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 0 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ fontSize: 11, color: '#557086' }}>© 2025 Rollon. Всі права захищені. 18+</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #557086', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#557086' }}>18+</div>
            <div style={{ fontSize: 11, color: '#557086', display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" stroke="#557086" strokeWidth="1.6" strokeLinejoin="round"/></svg>
              Відповідальна гра
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
