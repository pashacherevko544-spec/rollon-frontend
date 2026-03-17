import { useState } from 'react'
import AuthModal from '../components/AuthModal'
import { useUser } from '../hooks/useUser'
import { useNavigate } from 'react-router-dom'

const BG     = '#0a1628'
const CARD   = '#0f1f35'
const BORDER = '#1a3050'
const GREEN  = '#00d4aa'
const BLUE   = '#2F7BED'
const PURPLE = '#a855f7'
const GOLD   = '#f59e0b'

const GAMES = [
  { name: 'Aviator',      icon: '✈️', color: '#ef4444', players: '2.4k' },
  { name: 'Mines',        icon: '💣', color: '#f59e0b', players: '1.8k' },
  { name: 'Plinko',       icon: '🎯', color: '#3b82f6', players: '1.2k' },
  { name: 'Crash',        icon: '📈', color: GREEN,     players: '3.1k' },
  { name: 'Dice',         icon: '🎲', color: PURPLE,    players: '0.9k' },
  { name: 'Limbo',        icon: '🌀', color: '#06b6d4', players: '0.7k' },
]

const PROVIDERS = ['BGaming', 'Platipus', 'BNG', 'Gamzix', 'XStudios', 'Turbo Games']

const WINS = [
  { user: 'Dima***', game: 'Aviator',  amount: '$4,250', mult: '21.4x' },
  { user: 'Alex***', game: 'Mines',    amount: '$1,870', mult: '9.3x'  },
  { user: 'Kate***', game: 'Crash',    amount: '$3,100', mult: '15.5x' },
  { user: 'Ivan***', game: 'Plinko',   amount: '$890',   mult: '4.5x'  },
  { user: 'Serg***', game: 'Limbo',    amount: '$6,400', mult: '32x'   },
  { user: 'Oles***', game: 'Dice',     amount: '$2,200', mult: '11x'   },
]

const FEATURES = [
  { icon: '⚡', title: 'Миттєві виплати',    desc: 'Виведення протягом 5 хвилин на будь-який гаманець' },
  { icon: '🔒', title: 'Безпека 100%',       desc: 'SSL шифрування, 2FA, повний захист акаунту' },
  { icon: '🎁', title: 'Бонус при вході',    desc: '100% бонус на перший депозит до $500' },
  { icon: '🏆', title: 'VIP програма',       desc: 'Ексклюзивні привілеї, кешбек до 15%, особистий менеджер' },
  { icon: '📱', title: 'Telegram бот',       desc: 'Грай прямо в Telegram — без встановлення додатків' },
  { icon: '💎', title: 'Rollon Originals',   desc: 'Ексклюзивні ігри власної розробки з найкращими шансами' },
]

const STATS = [
  { value: '2,400+', label: 'Активних гравців' },
  { value: '$1.2M',  label: 'Виплачено виграшів' },
  { value: '500+',   label: 'Ігор на платформі' },
  { value: '24/7',   label: 'Підтримка' },
]

export default function Landing() {
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'register'>('register')
  const { refreshUser } = useUser()
  const nav = useNavigate()

  const openReg   = () => { setAuthMode('register'); setAuthOpen(true) }
  const openLogin = () => { setAuthMode('login');    setAuthOpen(true) }

  return (
    <div style={{ minHeight: '100vh', background: BG, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── HEADER ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,22,40,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BORDER}`, padding: '0 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', height: 60, gap: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 22, letterSpacing: 2, color: '#fff', flex: 1 }}>
            R<span style={{ color: BLUE }}>◆</span>LLON
          </div>
          <nav style={{ display: 'flex', gap: 24, fontSize: 14, color: '#8a9bb0' }}>
            {[
              { label: 'Ігри',       path: '/unautherisation/games'    },
              { label: 'Бонуси',     path: null                        },
              { label: 'VIP',        path: '/unautherisation/vip'      },
              { label: 'Партнерам',  path: '/unautherisation/referrals'},
            ].map(l => (
              <span key={l.label} onClick={() => l.path && nav(l.path)} style={{ cursor: 'pointer', transition: 'color .15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#8a9bb0'}
              >{l.label}</span>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={openLogin} style={{ padding: '8px 18px', borderRadius: 10, background: 'none', border: `1px solid ${BORDER}`, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Увійти
            </button>
            <button onClick={openReg} style={{ padding: '8px 18px', borderRadius: 10, background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', color: '#0a1628', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
              Реєстрація
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 20px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: `${GREEN}18`, border: `1px solid ${GREEN}44`, borderRadius: 20, padding: '6px 16px', fontSize: 12, color: GREEN, fontWeight: 700, marginBottom: 24, letterSpacing: 1 }}>
          🎰 НАЙКРАЩЕ ОНЛАЙН КАЗИНО 2026
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: -1 }}>
          Грай. Вигравай.<br />
          <span style={{ background: `linear-gradient(135deg, ${GREEN}, ${BLUE})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Отримуй реальні гроші.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: '#8a9bb0', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Rollon Casino — платформа з 500+ іграми, миттєвими виплатами і щедрими бонусами. Твій виграш вже чекає.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <button onClick={openReg} style={{ padding: '15px 36px', borderRadius: 14, background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', color: '#0a1628', fontSize: 16, fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 30px ${GREEN}44` }}>
            🎁 Почати з бонусом
          </button>
          <button onClick={() => nav('/unautherisation/games')} style={{ padding: '15px 36px', borderRadius: 14, background: 'none', border: `1px solid ${BORDER}`, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            Переглянути ігри →
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: GREEN, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#557086' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE WINS ── */}
      <section style={{ background: `linear-gradient(180deg, transparent, ${CARD}88)`, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: '24px 20px', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#557086', fontWeight: 700, letterSpacing: 1, marginBottom: 14, textTransform: 'uppercase' }}>🔴 Live виграші</div>
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {WINS.map((w, i) => (
              <div key={i} style={{ flexShrink: 0, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 16px', minWidth: 180 }}>
                <div style={{ fontSize: 12, color: '#557086', marginBottom: 4 }}>{w.user} · {w.game}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: GREEN }}>{w.amount}</div>
                <div style={{ fontSize: 11, color: GOLD, marginTop: 2 }}>× {w.mult}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORIGINALS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${BLUE}18`, border: `1px solid ${BLUE}44`, borderRadius: 20, padding: '6px 16px', fontSize: 12, color: BLUE, fontWeight: 700, marginBottom: 16 }}>
            <svg width="12" height="12" viewBox="0 0 14 14"><polygon points="7,1 13,7 7,13 1,7" fill="currentColor"/></svg>
            ROLLON ORIGINALS
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 12px' }}>Ексклюзивні ігри</h2>
          <p style={{ color: '#557086', fontSize: 15 }}>Тільки на Rollon — ігри власної розробки з найвищим RTP</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          {GAMES.map(g => (
            <div key={g.name} onClick={openReg} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'transform .15s, border-color .15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = g.color + '88' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = BORDER }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{g.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{g.name}</div>
              <div style={{ fontSize: 11, color: '#557086' }}>👥 {g.players} онлайн</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BONUS BANNER ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ background: `linear-gradient(135deg, ${GREEN}22, ${BLUE}18)`, border: `1px solid ${GREEN}44`, borderRadius: 20, padding: '40px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: GREEN, fontWeight: 700, marginBottom: 8 }}>🎁 БОНУС ДЛЯ НОВИХ ГРАВЦІВ</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 8px' }}>100% до <span style={{ color: GREEN }}>$500</span></h2>
            <p style={{ color: '#8a9bb0', fontSize: 14, margin: 0 }}>На перший депозит + 50 безкоштовних обертань</p>
          </div>
          <button onClick={openReg} style={{ padding: '16px 36px', borderRadius: 14, background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', color: '#0a1628', fontSize: 16, fontWeight: 900, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: `0 8px 30px ${GREEN}44` }}>
            Отримати бонус
          </button>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 40 }}>Чому обирають Rollon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '22px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#557086', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROVIDERS ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#557086', fontWeight: 700, letterSpacing: 1, marginBottom: 24, textTransform: 'uppercase' }}>Провайдери</div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {PROVIDERS.map(p => (
            <div key={p} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, color: '#8a9bb0' }}>{p}</div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: `linear-gradient(180deg, transparent, ${BLUE}18)`, borderTop: `1px solid ${BORDER}`, padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Готовий виграти?</h2>
        <p style={{ color: '#8a9bb0', fontSize: 16, marginBottom: 32 }}>Реєстрація займає 30 секунд. Бонус нараховується одразу.</p>
        <button onClick={openReg} style={{ padding: '16px 48px', borderRadius: 14, background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', color: '#0a1628', fontSize: 18, fontWeight: 900, cursor: 'pointer', boxShadow: `0 8px 30px ${GREEN}44` }}>
          Зареєструватись безкоштовно →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '32px 20px', textAlign: 'center' }}>
        <div style={{ fontWeight: 900, fontSize: 20, letterSpacing: 2, marginBottom: 16 }}>R<span style={{ color: BLUE }}>◆</span>LLON</div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', fontSize: 13, color: '#557086', flexWrap: 'wrap', marginBottom: 20 }}>
          {['Про нас', 'Умови', 'Конфіденційність', 'Відповідальна гра', 'Підтримка'].map(l => (
            <span key={l} style={{ cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#3a5060' }}>© 2026 Rollon Casino. 18+ Грайте відповідально.</div>
      </footer>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
        onSuccess={() => { refreshUser?.(); setAuthOpen(false); nav('/') }}
      />
    </div>
  )
}
