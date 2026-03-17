import { useNavigate } from 'react-router-dom'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'
const BLUE  = '#2F7BED'

interface Props {
  open: boolean
  onClose: () => void
  username?: string
  isNew?: boolean
}

export default function WelcomeModal({ open, onClose, username, isNew = false }: Props) {
  const nav = useNavigate()

  if (!open) return null

  return (
    <>
      <style>{`
        header { z-index: 1 !important; }
        @keyframes popIn {
          from { opacity: 0; transform: translate(-50%, -48%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1100 }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '92%', maxWidth: 400,
        background: BG,
        borderRadius: 20,
        border: `1px solid ${BORDER}`,
        zIndex: 1101,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        animation: 'popIn .25s ease',
      }}>

        {/* Top gradient */}
        <div style={{ height: 120, background: 'linear-gradient(135deg, #0d2d3f, #1a3a4a)', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `${GREEN}18`, border: `1px solid ${GREEN}30` }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: `${BLUE}18`, border: `1px solid ${BLUE}30` }} />

          {/* Avatar + greeting */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: CARD, border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke={GREEN} strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
                {isNew ? '🎉 Ласкаво просимо!' : `З поверненням!`}
              </div>
              {username && <div style={{ fontSize: 13, color: GREEN, fontWeight: 600, marginTop: 2 }}>{username}</div>}
            </div>
          </div>

          {/* Close */}
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.08)', border: `1px solid ${BORDER}`, color: '#8a9bb0', width: 28, height: 28, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 20px 24px' }}>

          {isNew ? (
            <>
              {/* Бонус для нових */}
              <div style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.05))', border: `1px solid ${GREEN}30`, borderRadius: 12, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${GREEN}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20 12v10H4V12" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 7H2v5h20V7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 22V7" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>Бонус на перший депозит</div>
                  <div style={{ fontSize: 12, color: '#8a9bb0', marginTop: 2 }}>+100% до $500 для нових гравців</div>
                </div>
              </div>

              <div style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 18, lineHeight: 1.5, textAlign: 'center' }}>
                Поповни рахунок і отримай <span style={{ color: GREEN, fontWeight: 700 }}>подвійний бонус</span> на старт 🚀
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: '#8a9bb0', marginBottom: 18, lineHeight: 1.5, textAlign: 'center' }}>
              Радий бачити тебе знову! Твій баланс чекає.<br/>Вдалої гри 🎰
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { onClose(); nav('/deposit') }} style={{
              padding: '13px', borderRadius: 12,
              background: `linear-gradient(135deg, ${GREEN}, #00b894)`,
              border: 'none', color: '#0f212e', fontWeight: 800, fontSize: 14,
              cursor: 'pointer', boxShadow: `0 4px 16px ${GREEN}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21V8M5 10l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="21" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              {isNew ? 'Поповнити та отримати бонус' : 'Поповнити рахунок'}
            </button>

            <button onClick={() => { onClose(); nav('/slots') }} style={{
              padding: '13px', borderRadius: 12,
              background: CARD, border: `1px solid ${BORDER}`,
              color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#8a9bb0" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" stroke="#8a9bb0" strokeWidth="1.5"/><line x1="12" y1="2" x2="12" y2="8" stroke="#8a9bb0" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="16" x2="12" y2="22" stroke="#8a9bb0" strokeWidth="1.8" strokeLinecap="round"/><line x1="2" y1="12" x2="8" y2="12" stroke="#8a9bb0" strokeWidth="1.8" strokeLinecap="round"/><line x1="16" y1="12" x2="22" y2="12" stroke="#8a9bb0" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Грати в слоти
            </button>

            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#557086', fontSize: 12, cursor: 'pointer', padding: 4 }}>
              Закрити
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
