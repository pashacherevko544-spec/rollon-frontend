import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'
const BLUE  = '#2F7BED'
const GOLD  = '#f59e0b'
const SUB   = '#8a9bb0'

const TIER_ICONS: Record<string, (c: string) => JSX.Element> = {
  Bronze:   c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Silver:   c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polygon points="12,3 14.5,9.5 21.5,9.5 16,13.5 18,20 12,16.5 6,20 8,13.5 2.5,9.5 9.5,9.5" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Gold:     c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polygon points="12,3 14.5,9.5 21.5,9.5 16,13.5 18,20 12,16.5 6,20 8,13.5 2.5,9.5 9.5,9.5" fill={c} opacity="0.9" strokeLinejoin="round"/></svg>,
  Platinum: c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 3h12l3 7-9 11L3 10z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M3 10h18M9 3l3 18M15 3l-3 18" stroke={c} strokeWidth="1.2" opacity="0.5"/></svg>,
  Diamond:  c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 3h12l3 7-9 11L3 10z" fill={c} opacity="0.85" strokeLinejoin="round"/><path d="M3 10h18" stroke="#fff" strokeWidth="1" opacity="0.3"/></svg>,
  Elite:    c => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M2 17l2-8 4 4 4-8 4 8 4-4 2 8H2z" fill={c} stroke={c} strokeWidth="0.5" strokeLinejoin="round"/><line x1="2" y1="20" x2="22" y2="20" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>,
}

const TIERS = [
  { name: 'Bronze',   min: 0,       max: 5000,    color: '#cd7f32', bg: '#1e160a', border: '#3a2510', glow: false, cashback: '3%',  withdrawal: '$500',        manager: false },
  { name: 'Silver',   min: 5000,    max: 25000,   color: '#94a3b8', bg: '#141c24', border: '#2a3a4a', glow: false, cashback: '5%',  withdrawal: '$2k',         manager: false },
  { name: 'Gold',     min: 25000,   max: 100000,  color: '#f59e0b', bg: '#1e1800', border: '#4a3c00', glow: false, cashback: '7%',  withdrawal: '$10k',        manager: false },
  { name: 'Platinum', min: 100000,  max: 500000,  color: '#e2e8f0', bg: '#141e2a', border: '#3a4a5a', glow: true,  cashback: '10%', withdrawal: '$50k',        manager: true  },
  { name: 'Diamond',  min: 500000,  max: 2000000, color: '#67e8f9', bg: '#041820', border: '#0e4a5a', glow: true,  cashback: '12%', withdrawal: '$200k',       manager: true  },
  { name: 'Elite',    min: 2000000, max: Infinity, color: '#e879f9', bg: '#1a0828', border: '#5a1570', glow: true,  cashback: '15%', withdrawal: 'Без лімітів', manager: true  },
]

const BENEFITS = [
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill={c} opacity="0.85"/></svg>, title: 'Щотижневий кешбек', desc: 'До 15% від програних коштів повертається щотижня', color: GREEN },
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={c} strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>, title: 'VIP-менеджер 24/7', desc: 'Персональний менеджер доступний будь-якої миті', color: BLUE },
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="1.8"/><path d="M2 10h20" stroke={c} strokeWidth="1.8"/><path d="M7 15h3M14 15h3" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>, title: 'Збільшені ліміти', desc: 'Без обмежень на виведення для топ-рівнів', color: GOLD },
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="2" stroke={c} strokeWidth="1.8"/><path d="M6 12h.01M18 12h.01" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg>, title: 'Ексклюзивні бонуси', desc: 'Спеціальні пропозиції лише для VIP-членів', color: '#a855f7' },
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></svg>, title: 'Пріоритетна підтримка', desc: 'Ваші запити обробляються в першу чергу', color: '#ef4444' },
  { icon: (c: string) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 3l1.5 1.5L21 2" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Запрошення на події', desc: 'Ексклюзивні офлайн та онлайн заходи для VIP', color: '#06b6d4' },
]

const MANAGERS = [
  { name: 'Олексій', role: 'Senior VIP Manager', initials: 'О', color: '#2F7BED' },
  { name: 'Марина',  role: 'VIP Concierge',      initials: 'М', color: '#a855f7' },
  { name: 'Дмитро',  role: 'VIP Relations',      initials: 'Д', color: '#00d4aa' },
]

const FAQ = [
  { q: 'Як стати VIP?', a: 'Ваш рівень підвищується автоматично в залежності від суми поповнень. Зробіть перший депозит і почніть свій шлях до Elite.' },
  { q: 'Коли виплачується кешбек?', a: 'Щотижня в понеділок автоматично зараховується кешбек за попередній тиждень.' },
  { q: 'Чи можна знизитися в рівні?', a: 'Ні. Ваш VIP-рівень зберігається назавжди і тільки підвищується.' },
  { q: 'Як зв\'язатися з VIP-менеджером?', a: 'Через кнопку підтримки в особистому кабінеті або Telegram. Менеджери доступні 24/7.' },
]

export default function VIPClub() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 60 }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '48px 20px 80px', background: 'linear-gradient(135deg, #2d0a3a 0%, #1a0828 40%, #0f212e 100%)' }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, #c026d360, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${GOLD}30, transparent 70%)`, pointerEvents: 'none' }} />
        {/* Subtle grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Bottom fade to page bg */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(to bottom, transparent, ${BG})`, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #c026d330, #9333ea20)', border: '2px solid #c026d360', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px #c026d340' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M2 17l2-8 4 4 4-8 4 8 4-4 2 8H2z" fill="#e879f9" stroke="#e879f9" strokeWidth="0.5" strokeLinejoin="round"/>
                <line x1="2" y1="20" x2="22" y2="20" stroke="#e879f9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, color: '#e879f9', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>ROLLON VIP CLUB</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', margin: '0 0 14px', lineHeight: 1.2 }}>
            Грай більше —<br/><span style={{ background: 'linear-gradient(90deg, #e879f9, #c026d3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>отримуй більше</span>
          </h1>
          <p style={{ fontSize: 14, color: SUB, lineHeight: 1.7, marginBottom: 28, maxWidth: 360, margin: '0 auto 28px' }}>
            Ексклюзивні привілеї, персональний менеджер та безлімітне виведення для наших найцінніших гравців
          </p>

          <button onClick={() => navigate(user ? '/deposit' : '/')} style={{
            background: 'linear-gradient(135deg, #c026d3, #9333ea)',
            border: 'none', borderRadius: 50, padding: '14px 36px',
            color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 8px 28px #c026d350', letterSpacing: 0.3,
          }}>
            {user ? 'Поповнити та підвищити рівень' : 'Стати VIP'}
          </button>
        </div>
      </div>

      {/* ── Current level (auth) ── */}
      {user && (
        <div style={{ margin: '-16px 16px 0', padding: '20px', background: `linear-gradient(135deg, ${GOLD}18, ${CARD})`, border: `1px solid ${GOLD}44`, borderRadius: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${GOLD}30`, border: `2px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{TIER_ICONS['Elite'](GOLD)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, letterSpacing: 1 }}>ВАШ РІВЕНЬ</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Bronze</div>
            </div>
            <button onClick={() => navigate('/deposit')} style={{ background: GOLD, border: 'none', borderRadius: 10, padding: '10px 18px', color: '#0f212e', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
              Поповнити
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: SUB }}>До наступного рівня</span>
              <span style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>$0 / $5,000</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: CARD2 }}>
              <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg, ${GOLD}, #d97706)`, width: '2%' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tiers ── */}
      <div style={{ padding: user ? '24px 16px 0' : '8px 16px 0' }}>
        <div style={{ fontSize: 11, color: SUB, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>VIP Рівні</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {TIERS.map((tier) => (
            <div key={tier.name} style={{
              background: tier.bg,
              border: `1px solid ${tier.border}`,
              borderRadius: 16, padding: '16px 12px',
              position: 'relative', overflow: 'hidden',
              boxShadow: tier.glow ? `0 0 20px ${tier.color}25` : 'none',
            }}>
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${tier.color}80, transparent)` }} />
              {/* Glow orb */}
              {tier.glow && <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${tier.color}30, transparent 70%)`, pointerEvents: 'none' }} />}

              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${tier.color}20`, border: `1px solid ${tier.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>{TIER_ICONS[tier.name](tier.color)}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: tier.color, marginBottom: 2 }}>{tier.name}</div>
              <div style={{ fontSize: 10, color: SUB, marginBottom: 8 }}>від ${tier.min.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#cdd8e0', marginBottom: 3 }}>
                <span style={{ color: tier.color, fontWeight: 800 }}>{tier.cashback}</span> кешбек
              </div>
              <div style={{ fontSize: 11, color: '#cdd8e0', marginBottom: 3 }}>
                Ліміт: <span style={{ color: tier.color, fontWeight: 700 }}>{tier.withdrawal}</span>
              </div>
              {tier.manager && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, background: `${tier.color}18`, borderRadius: 6, padding: '3px 6px', width: 'fit-content' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={tier.color} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={tier.color} strokeWidth="2" strokeLinecap="round"/></svg>
                  <span style={{ fontSize: 9, color: tier.color, fontWeight: 800 }}>Менеджер</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits ── */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ fontSize: 11, color: SUB, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Привілеї VIP</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BENEFITS.map(b => (
            <div key={b.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${b.color}20`, border: `1px solid ${b.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {b.icon(b.color)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 11, color: SUB, lineHeight: 1.5 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── VIP Manager block ── */}
      <div style={{ margin: '8px 16px 0', padding: '20px', borderRadius: 20, background: `linear-gradient(135deg, ${BLUE}25, ${BLUE}10)`, border: `1px solid ${BLUE}44` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>VIP-менеджер</div>
              <div style={{ background: '#ef444425', border: '1px solid #ef444460', borderRadius: 20, padding: '2px 8px', fontSize: 10, color: '#ef4444', fontWeight: 800 }}>24/7</div>
            </div>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.6, marginBottom: 16 }}>
              Персональний менеджер допомагає з нарахуванням бонусів, вирішенням будь-яких питань та супроводжує вас протягом усієї гри
            </div>
            <button onClick={() => navigate('/support')} style={{
              background: BLUE, border: 'none', borderRadius: 12, padding: '11px 22px',
              color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.82 12a19.79 19.79 0 01-3.07-8.67A2 2 0 013.77 1.25h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              Написати менеджеру
            </button>
          </div>
          {/* Manager avatars */}
          <div style={{ display: 'flex', gap: 10 }}>
            {MANAGERS.map(m => (
              <div key={m.name} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${m.color}30`, border: `2px solid ${m.color}70`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: m.color, margin: '0 auto 6px' }}>
                  {m.initials}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                <div style={{ fontSize: 9, color: SUB }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ accordion ── */}
      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', marginBottom: 14 }}>Відповіді на питання</div>
        {FAQ.map((item, i) => (
          <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
            style={{ background: CARD, border: `1px solid ${openFaq === i ? '#c026d360' : BORDER}`, borderRadius: 14, marginBottom: 8, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, paddingRight: 12 }}>{item.q}</div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}>
                <path d="M6 9l6 6 6-6" stroke={openFaq === i ? '#e879f9' : SUB} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {openFaq === i && (
              <div style={{ padding: '0 16px 16px', fontSize: 13, color: SUB, lineHeight: 1.7, borderTop: `1px solid ${BORDER}`, paddingTop: 12, marginTop: -4 }}>
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── CTA bottom ── */}
      <div style={{ margin: '24px 16px 0', padding: '28px 24px', borderRadius: 20, background: `linear-gradient(135deg, ${GOLD}20, #2a1800)`, border: `1px solid ${GOLD}44`, textAlign: 'center' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Готовий стати VIP?</div>
        <div style={{ fontSize: 13, color: SUB, marginBottom: 20 }}>Зроби перший депозит і почни отримувати привілеї вже сьогодні</div>
        <button onClick={() => navigate('/deposit')} style={{
          background: `linear-gradient(135deg, ${GOLD}, #d97706)`,
          border: 'none', borderRadius: 14, padding: '14px 36px',
          color: '#0f212e', fontWeight: 900, fontSize: 15, cursor: 'pointer',
          boxShadow: `0 8px 24px ${GOLD}40`,
        }}>
          Поповнити рахунок
        </button>
      </div>

      <div style={{ height: 32 }} />

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
