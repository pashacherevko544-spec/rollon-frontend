import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import WelcomeModal from './WelcomeModal'
import { API, setToken } from '../utils/api'

const BG     = '#0f212e'
const CARD   = '#1a2c38'
const CARD2  = '#213743'
const BORDER = '#2d4a5a'
const GREEN  = '#00d4aa'
const BLUE   = '#2F7BED'
const SUB    = '#8a9bb0'
const RED    = '#ef4444'

interface Props { open: boolean; onClose: () => void; initialMode?: 'login' | 'register'; onSuccess?: () => void }

export default function AuthModal({ open, onClose, initialMode = 'login', onSuccess }: Props) {
  const [mode, setMode]         = useState<'login' | 'register'>(initialMode)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [username, setUsername] = useState('')
  const [promo, setPromo]       = useState('')
  const [showPromo, setShowPromo] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [agree, setAgree]       = useState(true)
  const [error, setError]       = useState('')
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [welcomeIsNew, setWelcomeIsNew] = useState(false)
  const nav = useNavigate()

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (mode === 'register' && password !== confirm) {
      setError('Паролі не збігаються'); return
    }
    if (password.length < 8) {
      setError('Мінімум 8 символів'); return
    }
    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const body: Record<string, string> = { email, password }
      if (mode === 'register') { body.username = username; if (promo) body.promo = promo }

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Помилка входу'); return }

      if (data.token) {
        setToken(data.token)
        localStorage.setItem('rollon_token', data.token)
      }
    } catch {
      // Backend not available yet — continue anyway (demo)
    }

    setWelcomeIsNew(mode === 'register')
    onClose()
    onSuccess?.()
    setWelcomeOpen(true)
  }

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      {showPass
        ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke={SUB} strokeWidth="1.8" strokeLinecap="round"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke={SUB} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={SUB} strokeWidth="1.8"/></>
      }
    </svg>
  )

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 14px 13px 42px', borderRadius: 10,
    background: CARD2, border: `1px solid ${BORDER}`,
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }
  const iconWrap: React.CSSProperties = {
    position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
    color: SUB, pointerEvents: 'none', display: 'flex',
  }

  return (
    <>
      {/* Push header behind modal */}
      <style>{`header { z-index: 1 !important; }`}</style>

      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1100 }} />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '92%', maxWidth: 440,
        maxHeight: 'calc(100vh - 32px)',
        background: BG, borderRadius: 20,
        border: `1px solid ${BORDER}`,
        zIndex: 1101,
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
      }}>

        {/* Top accent line */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GREEN}, ${BLUE})` }} />

        <div style={{ padding: '24px 24px 28px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* Лого */}
              <span style={{ fontWeight: 900, fontSize: 20, color: '#fff', letterSpacing: 2, textTransform: 'uppercase' }}>
                R<span style={{ color: BLUE }}>◆</span>LLON
              </span>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`,
              background: CARD, color: SUB, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>

          {/* Mode tabs */}
          <div style={{ display: 'flex', background: CARD, borderRadius: 10, padding: 3, marginBottom: 24, border: `1px solid ${BORDER}` }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError('') }} style={{
                flex: 1, padding: '9px', borderRadius: 7,
                background: mode === m ? GREEN : 'none',
                border: 'none',
                color: mode === m ? '#0f212e' : SUB,
                fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
              }}>
                {m === 'login' ? 'Вхід' : 'Реєстрація'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>

            {/* Username (register only) */}
            {mode === 'register' && (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <span style={iconWrap}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/></svg></span>
                <input value={username} onChange={e => setUsername(e.target.value)}
                  style={inputStyle} placeholder="Нікнейм" required={mode === 'register'} />
              </div>
            )}

            {/* Email */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={iconWrap}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                style={inputStyle} placeholder="Email" required />
            </div>

            {/* Password */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <span style={iconWrap}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span>
              <input value={password} onChange={e => setPassword(e.target.value)}
                type={showPass ? 'text' : 'password'}
                style={{ ...inputStyle, paddingRight: 42 }}
                placeholder={mode === 'login' ? 'Пароль' : 'Пароль (мін. 8 символів)'} required />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}><EyeIcon /></button>
            </div>

            {/* Confirm password (register) */}
            {mode === 'register' && (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <span style={iconWrap}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></span>
                <input value={confirm} onChange={e => setConfirm(e.target.value)}
                  type={showPass ? 'text' : 'password'}
                  style={inputStyle} placeholder="Повторіть пароль" required={mode === 'register'} />
              </div>
            )}

            {/* Forgot password (login) */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <button type="button" style={{ background: 'none', border: 'none', color: BLUE, fontSize: 12, cursor: 'pointer' }}>
                  Забули пароль?
                </button>
              </div>
            )}

            {/* Promo code (register) */}
            {mode === 'register' && (
              <div style={{ marginBottom: 14 }}>
                {!showPromo ? (
                  <button type="button" onClick={() => setShowPromo(true)} style={{
                    background: 'none', border: 'none', color: GREEN, fontSize: 13, cursor: 'pointer', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Додати промокод
                  </button>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrap}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="7" cy="7" r="1.5" fill="currentColor"/></svg></span>
                    <input value={promo} onChange={e => setPromo(e.target.value)}
                      style={inputStyle} placeholder="Промокод" />
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ background: `${RED}18`, border: `1px solid ${RED}40`, borderRadius: 8, padding: '9px 12px', marginBottom: 14, color: RED, fontSize: 13 }}>
                {error}
              </div>
            )}

            {/* Agree (register) */}
            {mode === 'register' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 18 }}>
                <div onClick={() => setAgree(a => !a)} style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                  background: agree ? GREEN : 'none',
                  border: `2px solid ${agree ? GREEN : BORDER}`,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {agree && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#0f212e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{ fontSize: 12, color: SUB, lineHeight: 1.5 }}>
                  Натискаючи "Зареєструватись", я погоджуюсь з{' '}
                  <button type="button" style={{ background: 'none', border: 'none', color: BLUE, fontSize: 12, cursor: 'pointer', padding: 0 }}>
                    умовами використання
                  </button>
                </span>
              </div>
            )}

            {/* Submit */}
            <button type="submit" style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: `linear-gradient(135deg, ${GREEN}, #00b894)`,
              border: 'none', color: '#0f212e', fontWeight: 800, fontSize: 15,
              cursor: 'pointer', marginBottom: 20,
              boxShadow: `0 4px 20px ${GREEN}44`,
            }}>
              {mode === 'login' ? 'Увійти' : 'Зареєструватись'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 12, color: SUB }}>або</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            {/* Telegram */}
            <button onClick={() => { onClose(); nav('/') }} style={{
              width: 48, height: 48, borderRadius: 12,
              background: '#229ED920', border: `1px solid #229ED940`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'transform .15s',
            }} title="Telegram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#229ED9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#229ED9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {/* Google */}
            <button style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${CARD}`, border: `1px solid ${BORDER}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} title="Google">
              <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            </button>

          </div>

          {/* Switch mode */}
          <div style={{ textAlign: 'center', fontSize: 13, color: SUB }}>
            {mode === 'login' ? 'Немає акаунту? ' : 'Вже є акаунт? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }} style={{
              background: 'none', border: 'none', color: BLUE, fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}>
              {mode === 'login' ? 'Зареєструватись' : 'Увійти'}
            </button>
          </div>

        </div>
      </div>

      <WelcomeModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        username={username || email.split('@')[0]}
        isNew={welcomeIsNew}
      />
    </>
  )
}
