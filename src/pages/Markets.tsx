import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import AuthModal from '../components/AuthModal'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'
const BLUE  = '#2F7BED'
const RED   = '#ef4444'
const SUB   = '#8a9bb0'

const CATEGORIES = [
  { key: 'all',     label: 'Топ',          icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor"/></svg> },
  { key: 'crypto',  label: 'Крипто',       icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M9 8h4.5a2 2 0 010 4H9v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 12h5a2 2 0 010 4H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="6" x2="11" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="13" y1="6" x2="13" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="16" x2="11" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="13" y1="16" x2="13" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { key: 'politics',label: 'Політика',     icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 12h8M8 8h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { key: 'sports',  label: 'Спорт',        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 2c0 0-3 4-3 10s3 10 3 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M12 2c0 0 3 4 3 10s-3 10-3 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M2.5 9h19M2.5 15h19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { key: 'tech',    label: 'Техно',        icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg> },
  { key: 'world',   label: 'Світ',         icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/><path d="M12 3c0 0-3 4-3 9s3 9 3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M12 3c0 0 3 4 3 9s-3 9-3 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M3 9h18M3 15h18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  { key: 'my',      label: 'Мої ставки',   icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
]

const INITIAL_MARKETS = [
  {
    id: 1, category: 'crypto', tag: 'Крипто · Bitcoin',
    title: 'Bitcoin вище $100k до кінця квітня?',
    icon: 'BTC',
    iconColor: '#f7931a',
    questions: [
      { q: 'Чи досягне BTC $100,000 до 30 квітня?', yes: 3.2, no: 1.12, yesVol: 45, noVol: 55 }
    ],
    volume: '8.4 млн $', bets: 284310,
  },
  {
    id: 2, category: 'crypto', tag: 'Крипто · Ethereum',
    title: 'ETH досягне $5,000 у 2025?',
    icon: 'ETH',
    iconColor: '#627eea',
    questions: [
      { q: 'ETH вище $5,000 до кінця 2025?', yes: 2.8, no: 1.08, yesVol: 38, noVol: 62 }
    ],
    volume: '5.1 млн $', bets: 176400,
  },
  {
    id: 3, category: 'politics', tag: 'Політика · США',
    title: 'Трамп підпише мирний договір Росія-Україна?',
    icon: 'US',
    iconColor: '#3b82f6',
    questions: [
      { q: 'Мирна угода Росія-Україна у 2025?', yes: 4.5, no: 1.03, yesVol: 22, noVol: 78 }
    ],
    volume: '12.3 млн $', bets: 398200,
  },
  {
    id: 4, category: 'tech', tag: 'Техно · OpenAI',
    title: 'OpenAI випустить GPT-5 у 2025?',
    icon: 'AI',
    iconColor: '#10b981',
    questions: [
      { q: 'GPT-5 буде анонсований до липня 2025?', yes: 1.9, no: 1.35, yesVol: 52, noVol: 48 },
      { q: 'GPT-5 буде публічним до кінця 2025?', yes: 1.4, no: 2.1, yesVol: 71, noVol: 29 },
    ],
    volume: '3.8 млн $', bets: 112500,
  },
  {
    id: 5, category: 'sports', tag: 'Спорт · Футбол',
    title: 'Реал Мадрид виграє Лігу Чемпіонів 2025?',
    icon: 'RM',
    iconColor: '#fbbf24',
    questions: [
      { q: 'Реал Мадрид — переможець ЛЧ 2024/25?', yes: 2.1, no: 1.28, yesVol: 48, noVol: 52 }
    ],
    volume: '6.7 млн $', bets: 231000,
  },
  {
    id: 6, category: 'world', tag: 'Світ · Геополітика',
    title: 'Нові санкції проти Росії у 2025?',
    icon: 'EU',
    iconColor: '#8b5cf6',
    questions: [
      { q: 'ЄС введе новий пакет санкцій до червня?', yes: 1.5, no: 1.9, yesVol: 66, noVol: 34 }
    ],
    volume: '2.2 млн $', bets: 89300,
  },
]

type Market = typeof INITIAL_MARKETS[0]

function MarketCard({ market, onBet }: { market: Market; onBet: (id: number, q: string, side: 'yes'|'no') => void }) {
  const [bet, setBet] = useState<{qIdx: number; side: 'yes'|'no'} | null>(null)
  const [amount, setAmount] = useState('10')

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16,
      overflow: 'hidden', transition: 'border-color .15s',
    }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#3d5a6a'}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = BORDER}
    >
      {/* Header */}
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${market.iconColor}22`, border: `1px solid ${market.iconColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 900, color: market.iconColor }}>
          {market.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 3 }}>{market.title}</div>
          <div style={{ fontSize: 11, color: SUB }}>{market.tag}</div>
        </div>
      </div>

      {/* Questions */}
      {market.questions.map((q, qi) => (
        <div key={qi} style={{ padding: '8px 16px', borderTop: `1px solid ${BORDER}44` }}>
          <div style={{ fontSize: 12, color: '#c4cdd6', marginBottom: 8, lineHeight: 1.4 }}>{q.q}</div>

          {/* Bet buttons */}
          {bet?.qIdx === qi ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                value={amount} onChange={e => setAmount(e.target.value)}
                style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 13, outline: 'none' }}
                placeholder="Сума $"
              />
              <button onClick={() => { onBet(market.id, q.q, bet.side); setBet(null) }}
                style={{ background: bet.side === 'yes' ? GREEN : RED, border: 'none', borderRadius: 8, padding: '8px 14px', color: '#0f212e', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                {bet.side === 'yes' ? `Так ×${q.yes}` : `Ні ×${q.no}`}
              </button>
              <button onClick={() => setBet(null)} style={{ background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 10px', color: SUB, fontSize: 12, cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={() => setBet({ qIdx: qi, side: 'yes' })} style={{
                background: `${GREEN}18`, border: `1px solid ${GREEN}44`,
                borderRadius: 10, padding: '9px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = `${GREEN}30`}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = `${GREEN}18`}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>Так</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: GREEN }}>×{q.yes}</span>
              </button>
              <button onClick={() => setBet({ qIdx: qi, side: 'no' })} style={{
                background: `${RED}18`, border: `1px solid ${RED}44`,
                borderRadius: 10, padding: '9px 10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = `${RED}30`}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = `${RED}18`}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: RED }}>Ні</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: RED }}>×{q.no}</span>
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: `${BORDER}`, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${q.yesVol}%`, background: `linear-gradient(90deg, ${GREEN}, ${GREEN}aa)`, borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
            <span style={{ fontSize: 10, color: GREEN }}>{q.yesVol}% Так</span>
            <span style={{ fontSize: 10, color: RED }}>{q.noVol}% Ні</span>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 16, borderTop: `1px solid ${BORDER}44` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="3,17 8,12 12,15 17,8 21,11" stroke={SUB} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 11, color: SUB }}>{market.volume}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={SUB} strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={SUB} strokeWidth="1.5" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 11, color: SUB }}>{market.bets.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

// Create market modal
function CreateMarketModal({ onClose, onCreate }: { onClose: () => void; onCreate: (m: Market) => void }) {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('crypto')
  const [endDate, setEndDate] = useState('')

  const submit = () => {
    if (!title.trim() || !question.trim()) return
    const newMarket: Market = {
      id: Date.now(),
      category,
      tag: `${CATEGORIES.find(c => c.key === category)?.label} · Користувач`,
      title,
      icon: title.slice(0, 2).toUpperCase(),
      iconColor: GREEN,
      questions: [{ q: question, yes: 2.0, no: 1.5, yesVol: 50, noVol: 50 }],
      volume: '0 $',
      bets: 0,
    }
    onCreate(newMarket)
    onClose()
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1100 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20,
        width: 'min(480px, calc(100vw - 32px))', zIndex: 1101,
        padding: '24px', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto',
      }}>
        {/* Top line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})`, borderRadius: 2, marginBottom: 20 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontWeight: 900, fontSize: 18, color: '#fff' }}>Створити ринок</div>
          <button onClick={onClose} style={{ background: CARD2, border: 'none', borderRadius: 8, width: 32, height: 32, color: SUB, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✕</button>
        </div>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: SUB, fontWeight: 600, marginBottom: 6 }}>ЗАГОЛОВОК ПОДІЇ</div>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Наприклад: Bitcoin вище $120k у 2025?"
            style={{ width: '100%', padding: '11px 14px', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </label>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: SUB, fontWeight: 600, marginBottom: 6 }}>ПИТАННЯ ДЛЯ СТАВОК</div>
          <textarea value={question} onChange={e => setQuestion(e.target.value)}
            placeholder="Чи відбудеться X до дати Y?"
            rows={2}
            style={{ width: '100%', padding: '11px 14px', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
        </label>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: SUB, fontWeight: 600, marginBottom: 6 }}>КАТЕГОРІЯ</div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}>
            {CATEGORIES.filter(c => c.key !== 'all' && c.key !== 'my').map(c => (
              <option key={c.key} value={c.key} style={{ background: CARD2 }}>{c.label}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'block', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: SUB, fontWeight: 600, marginBottom: 6 }}>ДАТА ЗАВЕРШЕННЯ</div>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
        </label>

        <div style={{ padding: '12px 14px', background: `${GREEN}11`, border: `1px solid ${GREEN}33`, borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: GREEN, fontWeight: 600, marginBottom: 2 }}>Початкові коефіцієнти</div>
          <div style={{ fontSize: 12, color: SUB }}>Так ×2.0 / Ні ×1.5 — змінюються відповідно до ставок</div>
        </div>

        <button onClick={submit} disabled={!title.trim() || !question.trim()} style={{
          width: '100%', padding: '13px', borderRadius: 12,
          background: title.trim() && question.trim() ? `linear-gradient(135deg, ${GREEN}, #00b894)` : CARD2,
          border: 'none', color: title.trim() && question.trim() ? '#0f212e' : SUB,
          fontWeight: 900, fontSize: 15, cursor: title.trim() && question.trim() ? 'pointer' : 'default',
          transition: 'all .15s',
        }}>
          Опублікувати ринок
        </button>
      </div>
    </>
  )
}

export default function Markets() {
  const { user, refreshUser } = useUser()
  const nav = useNavigate()
  const [cat, setCat] = useState('all')
  const [markets, setMarkets] = useState(INITIAL_MARKETS)
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'register'>('register')

  const openAuth = (mode: 'login'|'register' = 'register') => { setAuthMode(mode); setAuthOpen(true) }

  const filtered = cat === 'all' ? markets : markets.filter(m => m.category === cat)

  const handleBet = (id: number, q: string, side: 'yes'|'no') => {
    if (!user) { openAuth('login'); return }
    setToast(`Ставку прийнято: ${side === 'yes' ? 'Так' : 'Ні'}`)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCreate = (m: typeof INITIAL_MARKETS[0]) => {
    setMarkets(prev => [m, ...prev])
    setToast('Ринок успішно створено!')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 40 }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)',
          background: GREEN, color: '#0f212e', borderRadius: 10, padding: '10px 20px',
          fontWeight: 700, fontSize: 13, zIndex: 2000, boxShadow: '0 4px 20px rgba(0,212,170,0.4)',
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="3,18 8,13 13,16 21,6" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16,6 21,6 21,11" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0 }}>Predict Markets</h1>
          </div>
          <p style={{ fontSize: 13, color: SUB, margin: 0 }}>Ставки на реальні події — крипто, спорт, політика</p>
        </div>
        <button onClick={() => user ? setShowCreate(true) : openAuth('register')} style={{
          background: `linear-gradient(135deg, ${GREEN}, #00b894)`,
          border: 'none', borderRadius: 12, padding: '10px 16px',
          color: '#0f212e', fontWeight: 800, fontSize: 13, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: `0 4px 14px ${GREEN}44`,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Створити
        </button>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '0 16px 14px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 20,
            background: cat === c.key ? GREEN : CARD,
            border: `1px solid ${cat === c.key ? GREEN : BORDER}`,
            color: cat === c.key ? '#0f212e' : SUB,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            transition: 'all .15s',
          }}>
            <span style={{ color: cat === c.key ? '#0f212e' : SUB }}>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, padding: '0 16px 16px' }}>
        {[
          { label: 'Активних ринків', value: markets.length, color: GREEN },
          { label: 'Загальний обсяг', value: '38.5 млн $', color: BLUE },
          { label: 'Всього ставок', value: '1.3 млн', color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 12px' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 10, color: SUB, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
        {filtered.map(m => (
          <MarketCard key={m.id} market={m} onBet={handleBet} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: SUB }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ marginBottom: 12, opacity: 0.3 }}><polyline points="3,17 8,12 12,15 17,8 21,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Ставок ще немає</div>
          <div style={{ fontSize: 13 }}>Ваших ставок поки що немає</div>
        </div>
      )}

      {showCreate && <CreateMarketModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} onSuccess={() => { refreshUser?.(); setAuthOpen(false) }} />

      {/* Site footer info */}
      <div style={{ margin: '8px 16px 0', padding: '20px', background: '#1a2c38', border: '1px solid #2d4a5a', borderRadius: 16 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8 }}>R<span style={{ color: '#2F7BED' }}>&#9670;</span>LLON</div>
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
