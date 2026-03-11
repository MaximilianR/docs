import { useCallback, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useReactFlow } from '@xyflow/react'
import { getEdgeDescription } from '../data/edgeDescriptions'

// Render description text, converting [text](url) markdown links to clickable <a> tags
function renderDescription(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/)
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      return <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>{match[1]}</a>
    }
    return part
  })
}

const LABEL_OFFSETS_KEY = 'curve-protocol-map-label-offsets'

let cachedOffsets: Record<string, { dx: number; dy: number }> | null = null

function loadOffsets(): Record<string, { dx: number; dy: number }> {
  if (cachedOffsets) return cachedOffsets
  try {
    const raw = localStorage.getItem(LABEL_OFFSETS_KEY)
    cachedOffsets = raw ? JSON.parse(raw) : {}
    return cachedOffsets!
  } catch {
    cachedOffsets = {}
    return cachedOffsets
  }
}

function saveOffset(edgeId: string, dx: number, dy: number) {
  const offsets = loadOffsets()
  offsets[edgeId] = { dx, dy }
  cachedOffsets = offsets
  localStorage.setItem(LABEL_OFFSETS_KEY, JSON.stringify(offsets))
}

interface Props {
  edgeId: string
  labelX: number
  labelY: number
  label: string
  background: string
  borderColor: string
}

export default function DraggableEdgeLabel({ edgeId, labelX, labelY, label, background, borderColor }: Props) {
  const { getViewport } = useReactFlow()
  const saved = loadOffsets()[edgeId]
  const [offset, setOffset] = useState<{ dx: number; dy: number }>(saved || { dx: 0, dy: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const labelRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const didDrag = useRef(false)
  const startPos = useRef({ mx: 0, my: 0, dx: 0, dy: 0 })

  const description = getEdgeDescription(edgeId)

  // Close tooltip on pane click / scroll (deferred to avoid same-event close)
  useEffect(() => {
    if (!showTooltip) return
    const close = () => setShowTooltip(false)
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', close)
      window.addEventListener('wheel', close)
    }, 50)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('mousedown', close)
      window.removeEventListener('wheel', close)
    }
  }, [showTooltip])

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    dragging.current = true
    didDrag.current = false
    startPos.current = { mx: e.clientX, my: e.clientY, dx: offset.dx, dy: offset.dy }

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      const dx = Math.abs(ev.clientX - startPos.current.mx)
      const dy = Math.abs(ev.clientY - startPos.current.my)
      if (dx > 3 || dy > 3) didDrag.current = true
      const { zoom } = getViewport()
      const newDx = startPos.current.dx + (ev.clientX - startPos.current.mx) / zoom
      const newDy = startPos.current.dy + (ev.clientY - startPos.current.my) / zoom
      setOffset({ dx: newDx, dy: newDy })
    }

    const onMouseUp = (ev: MouseEvent) => {
      dragging.current = false
      if (!didDrag.current && description) {
        setShowTooltip(v => {
          if (!v) {
            // Position tooltip at click location
            setTooltipPos({ x: ev.clientX, y: ev.clientY + 8 })
          }
          return !v
        })
      }
      setOffset(cur => {
        saveOffset(edgeId, cur.dx, cur.dy)
        return cur
      })
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }, [edgeId, offset.dx, offset.dy, getViewport, description])

  const foWidth = 200
  const x = labelX + offset.dx - foWidth / 2
  const y = labelY + offset.dy - 13

  return (
    <>
      <foreignObject x={x} y={y} width={foWidth} height={30} requiredExtensions="http://www.w3.org/1999/xhtml">
        <div ref={labelRef} style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div
            onMouseDown={onMouseDown}
            style={{
              fontFamily: 'System, monospace', fontSize: 10, fontWeight: 'bold', textAlign: 'center',
              color: 'white', background, border: `3px double ${borderColor}`, padding: '2px 8px',
              boxShadow: '3px 3px 2px rgba(0,0,0,0.4)',
              cursor: description ? 'pointer' : 'grab',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              width: 'fit-content',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {label}
            {description && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 11, height: 11, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)', fontSize: 8, lineHeight: 1,
                flexShrink: 0,
              }}>
                i
              </span>
            )}
          </div>
        </div>
      </foreignObject>

      {showTooltip && description && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            maxWidth: 260,
            fontFamily: 'System, monospace',
            fontSize: 11,
            color: 'white',
            background: '#1e293b',
            border: '3px double #64748b',
            padding: '8px 10px',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
            lineHeight: 1.5,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setShowTooltip(false) }}
            style={{
              position: 'absolute', top: 3, right: 5,
              background: 'none', border: 'none', color: '#94a3b8',
              cursor: 'pointer', fontSize: 11, fontFamily: 'System, monospace',
              padding: 0, lineHeight: 1,
            }}
          >
            x
          </button>
          {renderDescription(description)}
        </div>,
        document.body
      )}
    </>
  )
}
