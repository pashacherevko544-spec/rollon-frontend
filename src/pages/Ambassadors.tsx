import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BG    = '#0f212e'
const CARD  = '#1a2c38'
const CARD2 = '#213743'
const BORDER = '#2d4a5a'
const GREEN = '#00d4aa'
const BLUE  = '#2F7BED'
const SUB   = '#8a9bb0'

const CATEGORIES = [
  { key: 'all',      label: 'Всі' },
  { key: 'football', label: 'Футболісти' },
  { key: 'blogger',  label: 'Блогери' },
  { key: 'athlete',  label: 'Спортсмени' },
  { key: 'celebrity',label: 'Знаменитості' },
]

const AMBASSADORS = [
  {
    id: 1, category: 'football',
    name: 'Coming Soon',
    role: 'Футболіст',
    tag: 'Футбол',
    color: '#10b981',
    initials: 'FS',
    followers: '—',
    desc: 'Ми домовляємось з топовими гравцями. Слідкуй за оновленнями!',
    social: [],
  },
  {
    id: 2, category: 'blogger',
    name: 'Coming Soon',
    role: 'YouTube / TikTok',
    tag: 'Блогер',
    color: '#ef4444',
    initials: 'CS',
    followers: '—',
    desc: 'Найпопулярніші блогери незабаром приєднаються до Rollon.',
    social: [],
  },
  {
    id: 3, category: 'athlete',
    name: 'Coming Soon',
    role: 'Спортсмен',
    tag: 'Спорт',
    color: BLUE,
    initials: 'CS',
    followers: '—',
    desc: 'МMA, бокс, тенніс — найкращі спортсмени обирають Rollon.',
    social: [],
  },
  {
    id: 4, category: 'celebrity',
    name: 'Coming Soon',
    role: 'Знаменитість',
    tag: 'Шоубіз',
    color: '#f59e0b',
    initials: 'CS',
    followers: '—',
    desc: 'Музиканти, актори та медіаперсони. Незабаром.',
    social: [],
  },
]

export default function Ambassadors() {
  const nav = useNavigate()
  const [cat, setCat] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formSent, setFormSent] = useState(false)

  const filtered = cat === 'all' ? AMBASSADORS : AMBASSADORS.filter(a => a.category === cat)

  return (
    <div style={{ minHeight: '100vh', background: BG, paddingBottom: 48 }}>

      {/* Hero banner */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f212e 0%, #1a2c38 50%, #0f212e 100%)',
        padding: '40px 20px 36px', textAlign: 'center',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: `${GREEN}0a`, border: `1px solid ${GREEN}22` }} />
        <div style={{ position: 'absolute', bottom: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: `${BLUE}0a`, border: `1px solid ${BLUE}22` }} />

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${GREEN}18`, border: `1px solid ${GREEN}33`, borderRadius: 20, padding: '5px 14px', marginBottom: 14 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill={GREEN} opacity="0.8"/></svg>
            <span style={{ fontSize: 11, fontWeight: 800, color: GREEN, letterSpacing: 0.5 }}>ОФІЦІЙНІ АМБАСАДОРИ</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            Зірки обирають<br/><span style={{ color: GREEN }}>Rollon</span>
          </h1>
          <p style={{ fontSize: 14, color: SUB, margin: '0 auto', maxWidth: 360, lineHeight: 1.6 }}>
            Футболісти, блогери, спортсмени та знаменитості — наші амбасадори грають та рекомендують Rollon
          </p>

          {/* CTA */}
          <button onClick={() => nav('/referral')} style={{
            marginTop: 20, background: `linear-gradient(135deg, ${GREEN}, #00b894)`,
            border: 'none', borderRadius: 12, padding: '12px 28px',
            color: '#0f212e', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: `0 4px 20px ${GREEN}44`,
          }}>
            Стати партнером →
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '16px 16px 8px', scrollbarWidth: 'none' }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)} style={{
            flexShrink: 0, padding: '7px 16px', borderRadius: 20,
            background: cat === c.key ? GREEN : CARD,
            border: `1px solid ${cat === c.key ? GREEN : BORDER}`,
            color: cat === c.key ? '#0f212e' : SUB,
            fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all .15s',
          }}>{c.label}</button>
        ))}
      </div>

      {/* Ambassador cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14, padding: '8px 16px' }}>
        {filtered.map(a => (
          <div key={a.id} style={{
            background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 18, overflow: 'hidden',
            transition: 'transform .15s, border-color .15s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.borderColor = a.color }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.borderColor = BORDER }}
          >
            {/* Card top with color accent */}
            <div style={{ height: 6, background: `linear-gradient(90deg, ${a.color}, ${a.color}88)` }} />

            <div style={{ padding: '20px 18px 18px' }}>
              {/* Avatar + info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`,
                  border: `2px solid ${a.color}55`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, color: a.color, flexShrink: 0,
                }}>
                  {a.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>{a.name}</span>
                    <span style={{ background: `${a.color}22`, border: `1px solid ${a.color}44`, borderRadius: 5, padding: '1px 7px', fontSize: 9, fontWeight: 800, color: a.color }}>{a.tag}</span>
                  </div>
                  <div style={{ fontSize: 12, color: SUB }}>{a.role}</div>
                  {a.followers !== '—' && (
                    <div style={{ fontSize: 11, color: GREEN, fontWeight: 600, marginTop: 2 }}>{a.followers} підписників</div>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 12, color: SUB, lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* "Become ambassador" CTA block */}
      <div style={{ margin: '20px 16px 0', padding: '24px', borderRadius: 18, background: `linear-gradient(135deg, ${GREEN}15, ${BLUE}10)`, border: `1px solid ${GREEN}33` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontWeight: 900, fontSize: 17, color: '#fff', marginBottom: 6 }}>Хочеш стати амбасадором?</div>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.5 }}>
              Якщо ти блогер, спортсмен або відома особистість — ми запропонуємо вигідну співпрацю з Rollon
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={SUB} strokeWidth="1.8"/><polyline points="22,6 12,13 2,6" stroke={SUB} strokeWidth="1.8"/></svg>
              <a href="mailto:ambassadors@rollon.com" style={{ fontSize: 12, color: GREEN, textDecoration: 'none', fontWeight: 600 }}>ambassadors@rollon.com</a>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} style={{
            background: `linear-gradient(135deg, ${GREEN}, #00b894)`,
            border: 'none', borderRadius: 12, padding: '12px 24px',
            color: '#0f212e', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
            boxShadow: `0 4px 14px ${GREEN}44`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Подати заявку
          </button>
        </div>
      </div>


      {/* Application modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1200,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{
            width: '100%', maxWidth: 480, borderRadius: 20,
            background: CARD, border: `1px solid ${BORDER}`,
            boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17, color: '#fff' }}>Заявка амбасадора</div>
                <div style={{ fontSize: 12, color: SUB, marginTop: 2 }}>Ми розглянемо та зв'яжемось з вами</div>
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: SUB, cursor: 'pointer', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Form body */}
            <div style={{ padding: '20px 24px' }}>
              {formSent ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${GREEN}20`, border: `2px solid ${GREEN}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', marginBottom: 8 }}>Заявку відправлено!</div>
                  <div style={{ fontSize: 13, color: SUB }}>Ми розглянемо вашу кандидатуру і зв'яжемось протягом 3-5 днів</div>
                  <button onClick={() => { setShowForm(false); setFormSent(false) }} style={{ marginTop: 24, background: GREEN, border: 'none', borderRadius: 12, padding: '10px 24px', color: '#0f212e', fontWeight: 800, cursor: 'pointer' }}>Закрити</button>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setFormSent(true) }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Ім'я *</label>
                      <input required placeholder="Ваше ім'я" style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}/>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Telegram / Instagram</label>
                      <input placeholder="@username" style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}/>
                    </div>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Email *</label>
                    <input required type="email" placeholder="your@email.com" style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Тип співпраці</label>
                    <select style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}>
                      <option value="">Оберіть категорію</option>
                      <option>Блогер / Інфлюенсер</option>
                      <option>Футболіст / Спортсмен</option>
                      <option>Знаменитість</option>
                      <option>Стример</option>
                      <option>Медіа-партнер</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Аудиторія / Охоплення</label>
                    <input placeholder="напр. 150K підписників на Instagram" style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}/>
                  </div>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: SUB, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.4 }}>Розкажіть про себе</label>
                    <textarea rows={3} placeholder="Коротко опишіть, чим займаєтесь і чому хочете стати амбасадором Rollon..." style={{ width: '100%', background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}/>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: '#213743', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px', color: SUB, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                      Скасувати
                    </button>
                    <button type="submit" style={{ flex: 2, background: `linear-gradient(135deg, ${GREEN}, #00b894)`, border: 'none', borderRadius: 12, padding: '12px', color: '#0f212e', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Відправити заявку
                    </button>
                  </div>
                </form>
              )}
            </div>
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
