import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import { api } from '../utils/api'
import AuthModal from '../components/AuthModal'

const BG     = '#0f212e'
const CARD   = '#1a2c38'
const CARD2  = '#213743'
const BORDER = '#2d4a5a'
const GREEN  = '#00d4aa'
const BLUE   = '#2F7BED'
const SUB    = '#8a9bb0'

export default function Referral() {
  const navigate = useNavigate()
  const { user, loading: authLoading, refreshUser } = useUser()

  const [info, setInfo]     = useState<any>(null)
  const [fetching, setFetch] = useState(false)
  const [copied, setCopied]  = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login'|'register'>('register')

  useEffect(() => {
    if (authLoading || !user) return
    setFetch(true)
    const timer = setTimeout(() => setFetch(false), 3000)
    api.referralInfo()
      .then(data => { setInfo(data); setFetch(false) })
      .catch(() => setFetch(false))
      .finally(() => clearTimeout(timer))
  }, [authLoading, user?.id])

  const fallbackCode = user ? btoa(String(user.id)).replace(/[^A-Z0-9]/gi, '').slice(0, 6).toUpperCase() : '——'
  const link    = info?.referral_link || `https://t.me/pablovich_bot?start=${fallbackCode}`
  const code    = info?.referral_code || fallbackCode
  const earned  = info?.total_earned ?? 0
  const count   = info?.total_referrals ?? 0
  const refs    = info?.referrals ?? []

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {
      const el = document.createElement('textarea')
      el.value = link
      document.body.appendChild(el); el.select(); document.execCommand('copy')
      document.body.removeChild(el)
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = () => {
    const text = `Грай у Rollon Casino і виграй! Реєструйся за моїм посиланням:`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  // ── Not logged in ──
  if (!authLoading && !user) {
    return (
      <>
      <div style={{ minHeight: '100vh', background: BG, padding: '24px 16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: SUB, fontSize: 22, cursor: 'pointer', padding: 0, marginBottom: 16 }}>‹</button>

        <div style={{ background: `linear-gradient(135deg, ${GREEN}18, ${BLUE}10)`, border: `1px solid ${GREEN}33`, borderRadius: 20, padding: 28, textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: `${GREEN}20`, border: `2px solid ${GREEN}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke={GREEN} strokeWidth="1.8"/><circle cx="17" cy="11" r="2.5" stroke={GREEN} strokeWidth="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 14c1.9.5 3 2.2 3 4.5" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Партнерська програма</div>
          <div style={{ fontSize: 14, color: SUB, lineHeight: 1.6, marginBottom: 22 }}>
            Запрошуй друзів і отримуй <span style={{ color: GREEN, fontWeight: 800 }}>5% від кожного їх депозиту</span> назавжди
          </div>
          <button onClick={() => { setAuthMode('register'); setAuthOpen(true) }} style={{ background: GREEN, border: 'none', borderRadius: 12, padding: '12px 28px', color: '#0f212e', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            Увійти та отримати посилання
          </button>
        </div>

        {[
          { n: '1', title: 'Зареєструйся', desc: 'Створи акаунт в Rollon Casino' },
          { n: '2', title: 'Поділись посиланням', desc: 'Надішли своє реферальне посилання друзям' },
          { n: '3', title: 'Заробляй пасивно', desc: '5% від кожного депозиту твого друга — назавжди' },
        ].map(s => (
          <div key={s.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: `${BLUE}22`, border: `1px solid ${BLUE}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: BLUE, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: SUB, marginTop: 3 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} onSuccess={() => { refreshUser?.(); setAuthOpen(false) }} />
      </>
    )
  }

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${BORDER}`, borderTopColor: GREEN, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── Logged in ──
  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 80 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 16px 12px', borderBottom: `1px solid ${BORDER}` }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: SUB, fontSize: 22, cursor: 'pointer', padding: 0 }}>‹</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke={GREEN} strokeWidth="1.8"/><circle cx="17" cy="11" r="2.5" stroke={GREEN} strokeWidth="1.8"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/><path d="M17 14c1.9.5 3 2.2 3 4.5" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/></svg>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Партнерська програма</span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Зароблено', value: `$${earned.toFixed(2)}`, color: GREEN },
            { label: 'Рефералів', value: count, color: BLUE },
            { label: 'Комісія', value: '5%', color: '#a855f7' },
          ].map(s => (
            <div key={s.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: SUB, marginTop: 4, fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: SUB, letterSpacing: 0.5, marginBottom: 10, textTransform: 'uppercase' }}>Ваше реферальне посилання</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: SUB, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {link}
            </div>
            <button onClick={copy} style={{ background: copied ? GREEN : CARD2, border: `1px solid ${copied ? GREEN : BORDER}`, borderRadius: 10, padding: '10px 14px', color: copied ? '#0f212e' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s' }}>
              {copied ? 'Скопійовано' : 'Копіювати'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1, background: CARD2, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: SUB, marginBottom: 2 }}>Код</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: GREEN, letterSpacing: 2 }}>{code}</div>
            </div>
            <button onClick={share} style={{ flex: 1, background: `linear-gradient(135deg, ${BLUE}, #1a5bbf)`, border: 'none', borderRadius: 10, padding: '10px 14px', color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Поділитись
            </button>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px', marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Як це працює</div>
          {[
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round"/></svg>, text: 'Поділись своїм посиланням з друзями' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={BLUE} strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round"/></svg>, text: 'Друг реєструється та робить депозит' },
            { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#a855f7" strokeWidth="1.8"/><path d="M2 10h20" stroke="#a855f7" strokeWidth="1.8"/></svg>, text: 'Ти отримуєш 5% від кожного його депозиту' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: CARD2, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</div>
              <div style={{ fontSize: 13, color: '#cdd8e0' }}>{s.text}</div>
            </div>
          ))}
        </div>

        {/* Referrals list */}
        {refs.length > 0 && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Ваші реферали ({refs.length})</div>
            {refs.map((r: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, marginBottom: i < refs.length - 1 ? 10 : 0, borderBottom: i < refs.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: CARD2, border: `1px solid ${BORDER}`, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(r.username || r.first_name || 'u')}&backgroundColor=213743`} alt="" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{r.first_name || r.username || 'Гравець'}</div>
                  <div style={{ fontSize: 11, color: SUB }}>{r.total_deposits ? `$${r.total_deposits.toFixed(2)} депозитів` : 'Ще не поповнював'}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: GREEN }}>+${((r.total_deposits || 0) * 0.05).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {refs.length === 0 && !fetching && (
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '28px', textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, margin: '0 auto 12px', display: 'block' }}><circle cx="9" cy="7" r="3" stroke="#fff" strokeWidth="1.5"/><circle cx="17" cy="11" r="2.5" stroke="#fff" strokeWidth="1.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 14, color: SUB }}>Поки немає рефералів</div>
            <div style={{ fontSize: 12, color: BORDER, marginTop: 6 }}>Поділись посиланням — і заробляй!</div>
          </div>
        )}

      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} onSuccess={() => { refreshUser?.(); setAuthOpen(false) }} />
    </div>
  )
}
