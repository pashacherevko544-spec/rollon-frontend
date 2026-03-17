import { useRef, useState, useCallback, useEffect, forwardRef } from 'react'

interface Props {
  children: React.ReactNode
  gap?: number
  paddingX?: number
  step?: number
  /** Render arrow buttons in the section header row instead of floating over cards */
  headerArrows?: boolean
}

// ArrowBtn — rounded square dark button
function ArrowBtn({ dir, onClick, disabled }: { dir: 'left'|'right', onClick: () => void, disabled: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34, height: 34, borderRadius: 8,
        background: '#1e3345',
        border: '1px solid #2d4a5a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background .15s',
        opacity: disabled ? 0.3 : 1,
        flexShrink: 0,
        color: '#cdd8e0',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        {dir === 'left'
          ? <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}

/** Hook — exposes scroll state + scrollBy for a ref */
export function useScrollRow() {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(false)

  const check = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    // Delay first check so DOM is ready
    const t = setTimeout(check, 80)
    const el = ref.current
    el?.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      clearTimeout(t)
      el?.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [check])

  const scrollBy = (dir: 1 | -1, step = 320) => {
    ref.current?.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return { ref, canLeft, canRight, scrollBy }
}

/** Pair of ‹ › buttons to drop into any section header */
export function ScrollArrows({ state }: { state: ReturnType<typeof useScrollRow> }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
      <ArrowBtn dir="left"  onClick={() => state.scrollBy(-1)} disabled={!state.canLeft} />
      <ArrowBtn dir="right" onClick={() => state.scrollBy(1)}  disabled={!state.canRight} />
    </div>
  )
}

/** Full self-contained component (arrows float mid-height on sides) — kept for convenience */
export default function ScrollRow({ children, gap = 10, paddingX = 16, step = 320 }: Props) {
  const { ref, canLeft, canRight, scrollBy } = useScrollRow()

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={ref}
        style={{
          display: 'flex', gap, padding: `0 ${paddingX}px 4px`,
          overflowX: 'auto', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  )
}
