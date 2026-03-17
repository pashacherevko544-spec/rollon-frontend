import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'

interface Props { open: boolean; onClose: () => void; sidebarWidth?: number }

export default function SupportWidget({ open, onClose, sidebarWidth = 240 }: Props) {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const nav = useNavigate()
  const { user } = useUser()

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  const handleSend = () => {
    const text = message.trim()
    if (!text) return
    setSent(true)
    setMessage('')
    setTimeout(() => {
      onClose()
      nav('/support')
    }, 600)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop (click outside → close) */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1050 }} />

      {/* Widget — з'являється зліва над sidebar */}
      <div style={{
        position: 'fixed',
        bottom: 80,
        left: sidebarWidth + 12,
        width: 300,
        background: CARD,
        borderRadius: 16,
        border: `1px solid ${BORDER}`,
        zIndex: 1051,
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        overflow: 'hidden',
        animation: 'slideInLeft .2s ease',
      }}>
        <style>{`
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-16px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, #1a3a4a, ${CARD2})`, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(0,212,170,0.15)', border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={GREEN} strokeWidth="1.8" strokeLinejoin="round"/><circle cx="9" cy="10" r="1" fill={GREEN}/><circle cx="12" cy="10" r="1" fill={GREEN}/><circle cx="15" cy="10" r="1" fill={GREEN}/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Підтримка ROLLON</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>Онлайн · 24/7</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#557086', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Chat area */}
        <div style={{ padding: '16px 14px 12px', minHeight: 120 }}>
          {/* Bot greeting */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=support-agent-42&backgroundColor=1a2c38"
              alt="support"
              style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 2, border: `1px solid ${GREEN}` }}
            />
            <div style={{ background: BG, borderRadius: '4px 12px 12px 12px', padding: '10px 12px', maxWidth: 210 }}>
              <p style={{ fontSize: 13, color: '#fff', margin: 0, lineHeight: 1.5 }}>
                {user
                  ? `Привіт, ${user.first_name || 'гравцю'}! 👋 Чим можу допомогти?`
                  : 'Привіт! 👋 Опиши своє питання і ми одразу допоможемо.'}
              </p>
            </div>
          </div>

          {/* User message (after send) */}
          {sent && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <div style={{ background: GREEN, borderRadius: '12px 4px 12px 12px', padding: '10px 12px', maxWidth: 200 }}>
                <p style={{ fontSize: 13, color: '#0f212e', margin: 0, fontWeight: 600 }}>Переходжу до чату...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: '0 12px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Написати повідомлення..."
            style={{
              flex: 1, padding: '10px 12px', borderRadius: 10,
              background: BG, border: `1px solid ${BORDER}`,
              color: '#fff', fontSize: 13, outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: message.trim() ? GREEN : CARD2,
              border: 'none', cursor: message.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke={message.trim() ? '#0f212e' : '#557086'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={message.trim() ? '#0f212e' : '#557086'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
