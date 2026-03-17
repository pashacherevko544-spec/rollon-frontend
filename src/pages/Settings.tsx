import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../hooks/useUser'

type Section = 'main' | 'security'

export default function Settings() {
  const navigate = useNavigate()
  const { user } = useUser()
  const [section, setSection] = useState<Section>('main')

  // Form state
  const [name, setName] = useState(user?.first_name || '')
  const [dob, setDob] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  // Security
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passMsg, setPassMsg] = useState('')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleChangePass = () => {
    if (!newPass || newPass !== confirmPass) {
      setPassMsg('❌ Паролі не збігаються')
      return
    }
    if (newPass.length < 6) {
      setPassMsg('❌ Мінімум 6 символів')
      return
    }
    setPassMsg('✅ Пароль змінено')
    setOldPass(''); setNewPass(''); setConfirmPass('')
    setTimeout(() => setPassMsg(''), 3000)
  }

  const handleLogout = () => {
    localStorage.removeItem('rollon_token')
    window.location.href = '/'
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: '#0f212e',
    border: '1px solid #2d4a5a', borderRadius: 10, color: '#fff',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, color: '#557086',
    marginBottom: 6, display: 'block', textTransform: 'uppercase' as const,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f212e', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px 8px', borderBottom: '1px solid #1a3344',
      }}>
        <button onClick={() => section === 'security' ? setSection('main') : navigate('/profile')} style={{
          background: 'none', border: 'none', color: '#8a9bb0',
          fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1,
        }}>‹</button>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ display:'inline',verticalAlign:'middle',marginRight:6 }}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/></svg>
          {section === 'security' ? 'Безпека' : 'Налаштування'}
        </span>
      </div>

      {section === 'main' && (
        <>
          {/* Avatar */}
          <div style={{ padding: '20px 16px 0', textAlign: 'center' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              margin: '0 auto 8px', border: '2px solid #2F7BED',
              overflow: 'hidden', background: '#1a3344',
            }}>
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.first_name || 'Player')}&backgroundColor=0f212e`}
                alt="avatar"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div style={{ fontSize: 12, color: '#2F7BED', cursor: 'pointer', fontWeight: 600 }}>
              Змінити фото
            </div>
          </div>

          {/* Personal info */}
          <div style={{ padding: '20px 16px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8a9bb0', marginBottom: 12 }}>
              ОСОБИСТА ІНФОРМАЦІЯ
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Ім'я</label>
                <input
                  style={inputStyle}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ваше ім'я"
                />
              </div>
              <div>
                <label style={labelStyle}>Дата народження</label>
                <input
                  style={inputStyle}
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  placeholder="ДД.ММ.РРРР"
                />
              </div>
              <div>
                <label style={labelStyle}>Номер телефону</label>
                <input
                  style={inputStyle}
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+380 XX XXX XXXX"
                />
              </div>
              <div>
                <label style={labelStyle}>Електронна пошта</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <button onClick={handleSave} style={{
              width: '100%', marginTop: 18, padding: '14px 0',
              background: saved ? '#00d4aa' : 'linear-gradient(135deg, #2F7BED, #1a5fc8)',
              border: 'none', borderRadius: 12,
              color: '#fff', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              {saved ? '✅ Збережено!' : 'Зберегти зміни'}
            </button>
          </div>

          {/* Security & Logout */}
          <div style={{ padding: '24px 16px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8a9bb0', marginBottom: 12 }}>
              БЕЗПЕКА ТА АККАУНТ
            </div>

            <button onClick={() => setSection('security')} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px', background: '#1a3344',
              border: '1px solid #2d4a5a', borderRadius: 10,
              cursor: 'pointer', marginBottom: 10, textAlign: 'left',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#c4cdd6" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#c4cdd6" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="#c4cdd6"/></svg>
              <span style={{ color: '#c4cdd6', fontWeight: 600, fontSize: 14, flex: 1 }}>Пароль</span>
              <span style={{ color: '#557086' }}>›</span>
            </button>

            <button onClick={handleLogout} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px', background: '#1a2030',
              border: '1px solid #3d2020', borderRadius: 10,
              cursor: 'pointer', textAlign: 'left',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="#ed4163" strokeWidth="1.8" strokeLinecap="round"/><polyline points="16,17 21,12 16,7" stroke="#ed4163" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="#ed4163" strokeWidth="1.8" strokeLinecap="round"/></svg>
              <span style={{ color: '#ff6b6b', fontWeight: 600, fontSize: 14, flex: 1 }}>Вийти з акаунту</span>
              <span style={{ color: '#557086' }}>›</span>
            </button>
          </div>
        </>
      )}

      {section === 'security' && (
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8a9bb0', marginBottom: 14 }}>
            ЗМІНА ПАРОЛЯ
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>Поточний пароль</label>
              <input
                style={inputStyle}
                type="password"
                value={oldPass}
                onChange={e => setOldPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={labelStyle}>Новий пароль</label>
              <input
                style={inputStyle}
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label style={labelStyle}>Повторіть новий пароль</label>
              <input
                style={inputStyle}
                type="password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          {passMsg && (
            <div style={{
              marginTop: 14, padding: '10px 14px',
              background: passMsg.startsWith('✅') ? '#0d2e20' : '#2e1010',
              border: `1px solid ${passMsg.startsWith('✅') ? '#00d4aa' : '#ff6b6b'}`,
              borderRadius: 10, fontSize: 13, color: passMsg.startsWith('✅') ? '#00d4aa' : '#ff6b6b',
            }}>
              {passMsg}
            </div>
          )}

          <button onClick={handleChangePass} style={{
            width: '100%', marginTop: 18, padding: '14px 0',
            background: 'linear-gradient(135deg, #2F7BED, #1a5fc8)',
            border: 'none', borderRadius: 12,
            color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}>
            Змінити пароль
          </button>

          <div style={{
            marginTop: 16, padding: '12px 14px',
            background: '#1a2a1a', border: '1px solid #2d4a2d',
            borderRadius: 10, fontSize: 12, color: '#557086', lineHeight: 1.6,
          }}>
            💡 Пароль має містити мінімум 6 символів. Рекомендуємо використовувати комбінацію букв, цифр та символів.
          </div>
        </div>
      )}

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
