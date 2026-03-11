import { Handle, Position } from '@xyflow/react'
import type { ProtocolNodeData, Category } from '../data/graph'
import { categories } from '../data/graph'

const ICON_MAP: Record<string, string> = {
  crv: '/icons/crv.svg',
  vecrv: '/icons/vecrv.svg',
  crvusd: '/icons/crvusd.svg',
  scrvusd: '/icons/scrvusd.svg',
  convex: '/img/logos/convex.svg',
  stakedao: '/img/logos/stakedao.svg',
  yearn: '/img/logos/yearn.svg',
}

const BAR_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e84393']

interface GaugeBar {
  name: string
  weight: number     // current weight (always changing)
  snapshot?: number   // snapshot weight (locked after Thursday)
}

interface BaseNodeProps {
  data: ProtocolNodeData
  selected: boolean
  variant?: 'default' | 'system' | 'token' | 'external'
}

export default function BaseNode({ data, selected, variant = 'default' }: BaseNodeProps) {
  const cat = categories[data.category]
  const isToken = variant === 'token'
  const isSystem = variant === 'system'
  const iconSrc = data.icon ? ICON_MAP[data.icon] : undefined
  const gauges = (data as any).gauges as GaugeBar[] | undefined
  const snapshotFlash = (data as any).snapshotFlash as boolean | undefined
  const colorOverride = (data as any).colorOverride as string | undefined

  const handleClass = "!bg-transparent !w-3 !h-3 !border-0 hover:!bg-white/50 !transition-all"

  const bgColor = colorOverride || cat.color
  const borderColor = colorOverride ? 'rgba(255,255,255,0.6)' : 'white'
  const glowColor = colorOverride || cat.color

  return (
    <>
      <Handle type="target" position={Position.Top} id="top-target" className={handleClass} />
      <Handle type="source" position={Position.Top} id="top-source" className={handleClass} />
      <Handle type="target" position={Position.Bottom} id="bottom-target" className={handleClass} />
      <Handle type="source" position={Position.Bottom} id="bottom-source" className={handleClass} />
      <Handle type="target" position={Position.Left} id="left-target" className={handleClass} />
      <Handle type="source" position={Position.Left} id="left-source" className={handleClass} />
      <Handle type="target" position={Position.Right} id="right-target" className={handleClass} />
      <Handle type="source" position={Position.Right} id="right-source" className={handleClass} />
      <div
        style={{
          background: bgColor,
          boxShadow: selected
            ? `0 0 0 3px ${glowColor}, 8px 8px 3px rgba(0,0,0,0.5), 0 0 16px ${glowColor}66`
            : `0 0 0 3px ${glowColor}, 8px 8px 3px rgba(0,0,0,0.5)`,
          borderColor,
          transition: 'all 0.3s',
        }}
        className={`
          relative cursor-pointer transition-all duration-150
          border-[6px] border-double
          ${isToken ? 'rounded-sm min-w-[60px] text-center px-2 py-1.5' : gauges ? 'rounded-none min-w-[280px] px-5 py-3' : 'rounded-none min-w-[180px] px-4 py-2.5'}
          ${isSystem ? 'border-dashed' : ''}
          ${selected ? 'scale-105' : 'hover:scale-105 hover:brightness-110'}
        `}
      >
        <div className="flex items-center gap-2">
          {iconSrc ? (
            <img src={iconSrc} alt="" className="w-5 h-5 rounded-full" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }} />
          ) : (
            <div
              className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-white/40 bg-white/15"
              style={{ color: 'white' }}
            >
              {data.label.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-bold text-xs text-white whitespace-nowrap" style={{ fontFamily: 'System, monospace' }}>
              {data.label}
            </div>
            {isSystem && (
              <div className="text-[9px] text-white/60 uppercase tracking-widest" style={{ fontFamily: 'System, monospace' }}>
                {data.category}
              </div>
            )}
          </div>
        </div>

        {/* Inline gauge weight bar chart */}
        {gauges && gauges.length > 0 && (() => {
          const hasSnapshot = gauges.some(g => g.snapshot != null)
          const barH = 80
          // Fixed scale: max weight is capped at 50% for consistent bar sizing
          const maxW = 50
          return (
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, height: barH }}>
                {/* Y-axis title */}
                <div style={{ display: 'flex', alignItems: 'center', height: barH, marginRight: 2, marginLeft: -12 }}>
                  <span className="text-[6px] text-white/40" style={{ fontFamily: 'System, monospace', writingMode: 'vertical-rl', transform: 'rotate(180deg)', whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>gauge weight</span>
                </div>
                {/* Y-axis labels */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: barH, marginRight: 4, alignItems: 'flex-end' }}>
                  <span className="text-[6px] text-white/40" style={{ fontFamily: 'System, monospace', lineHeight: 1 }}>{maxW}%</span>
                  <span className="text-[6px] text-white/40" style={{ fontFamily: 'System, monospace', lineHeight: 1 }}>{maxW / 2}%</span>
                  <span className="text-[6px] text-white/40" style={{ fontFamily: 'System, monospace', lineHeight: 1 }}>0%</span>
                </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: barH, flex: 1 }}>
                {gauges.map((g, i) => {
                  const h = Math.max(2, (g.weight / maxW) * barH)
                  const snapH = g.snapshot != null ? (g.snapshot / maxW) * barH : 0
                  const color = BAR_COLORS[i % BAR_COLORS.length]

                  return (
                    <div key={i} style={{ flex: 1, height: barH, position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                      {/* Current weight bar */}
                      <div style={{
                        width: '100%', height: h, background: color,
                        minHeight: 2,
                      }} />
                      {/* Snapshot weight line + label */}
                      {g.snapshot != null && (
                        <>
                          <div style={{
                            position: 'absolute', bottom: snapH, left: -1, right: -1,
                            height: 2,
                            background: 'white',
                            pointerEvents: 'none',
                          }} />
                          <div style={{
                            position: 'absolute', bottom: snapH + 1, left: 0, right: 0, lineHeight: 1,
                            textAlign: 'center', pointerEvents: 'none',
                          }}>
                            <span className="text-[6px] text-white/55" style={{ fontFamily: 'System, monospace' }}>
                              {g.snapshot.toFixed(1)}%
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
              </div>
              {/* Gauge labels + weight — padded to align with bars */}
              <div style={{ display: 'flex', gap: 4, marginTop: 3, paddingLeft: 28 }}>
                {gauges.map((g, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', lineHeight: 1.2 }}>
                    <div className="text-[7px] font-bold text-white/70" style={{ fontFamily: 'System, monospace' }}>
                      {g.name}
                    </div>
                    <div className="text-[7px] text-white/50" style={{ fontFamily: 'System, monospace' }}>
                      {g.weight.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
              {/* Legend */}
              {hasSnapshot && (
                <div style={{ display: 'flex', gap: 8, marginTop: 5, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 10, height: 2, background: 'white' }} />
                    <span className="text-[7px] text-white/50" style={{ fontFamily: 'System, monospace' }}>Snapshot Weight (Thursday at 00:00 UTC)</span>
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </>
  )
}
