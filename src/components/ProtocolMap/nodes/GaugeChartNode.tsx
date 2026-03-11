import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { ProtocolNodeData } from '../data/graph'

export interface GaugeBar {
  name: string
  weight: number  // current applied weight %
  pending: number // pending vote weight %
}

interface GaugeChartData extends ProtocolNodeData {
  gauges?: GaugeBar[]
  snapshotFlash?: boolean
}

const BAR_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#e84393']

export default function GaugeChartNode({ data, selected }: NodeProps<Node<GaugeChartData>>) {
  const gauges = (data as GaugeChartData).gauges || []
  const flash = (data as GaugeChartData).snapshotFlash || false
  const maxWeight = Math.max(...gauges.map(g => Math.max(g.weight, g.pending)), 1)
  // Round up to nearest nice tick
  const tickMax = Math.ceil(maxWeight / 5) * 5
  const ticks = [0, Math.round(tickMax / 3), Math.round((tickMax * 2) / 3), tickMax]

  const handleClass = "!bg-transparent !w-3 !h-3 !border-0 hover:!bg-white/50 !transition-all"
  const barMaxHeight = 140
  const barWidth = 32
  const gap = 12

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
          background: '#1a1a2e',
          boxShadow: flash
            ? `0 0 0 3px #22c55e, 8px 8px 3px rgba(0,0,0,0.5), 0 0 24px #22c55e88`
            : selected
              ? `0 0 0 3px #4c1d95, 8px 8px 3px rgba(0,0,0,0.5), 0 0 16px #8b5cf666`
              : `0 0 0 3px #4c1d95, 8px 8px 3px rgba(0,0,0,0.5)`,
          fontFamily: 'System, monospace',
          cursor: 'pointer',
          border: flash ? '6px double #22c55e' : '6px double #a78bfa',
          transition: 'all 0.3s',
          padding: '14px 18px 10px',
        }}
        className={`relative ${selected ? 'scale-105' : 'hover:scale-105 hover:brightness-110'}`}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Relative Weight Distribution
          </span>
          {flash && (
            <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: '#22c55e', color: 'white' }}>
              SNAPSHOT
            </span>
          )}
        </div>

        {/* Chart area */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
          {/* Y-axis ticks */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: barMaxHeight, pointerEvents: 'none' }}>
            {ticks.slice(1).map(t => {
              const y = barMaxHeight - (t / tickMax) * barMaxHeight
              return (
                <div key={t} style={{ position: 'absolute', top: y, left: 0, right: 0 }}>
                  <div style={{ borderTop: '1px dotted rgba(255,255,255,0.1)', width: '100%' }} />
                  <span
                    className="text-[8px]"
                    style={{ position: 'absolute', right: 0, top: -10, color: 'rgba(255,255,255,0.3)' }}
                  >
                    {t}%
                  </span>
                </div>
              )
            })}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: barMaxHeight, paddingRight: 28 }}>
            {gauges.map((g, i) => {
              const appliedH = (g.weight / tickMax) * barMaxHeight
              const pendingH = (g.pending / tickMax) * barMaxHeight
              const delta = g.pending - g.weight
              const showDelta = Math.abs(delta) > 0.05
              const color = BAR_COLORS[i % BAR_COLORS.length]

              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: barMaxHeight, justifyContent: 'flex-end' }}>
                  {/* Delta indicator above bar */}
                  {showDelta && (
                    <div
                      className="text-[8px] font-bold"
                      style={{
                        color: delta > 0 ? '#4ade80' : '#f87171',
                        marginBottom: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                    </div>
                  )}
                  {/* Pending bar (ghost) */}
                  {showDelta && pendingH > appliedH && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: barWidth,
                        height: pendingH,
                        background: `${color}33`,
                        borderTop: `2px dashed ${delta > 0 ? '#4ade80' : '#f87171'}`,
                        transition: 'height 0.3s',
                      }}
                    />
                  )}
                  {/* Applied bar */}
                  <div
                    style={{
                      width: barWidth,
                      height: appliedH,
                      background: color,
                      transition: 'height 0.3s',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div style={{ display: 'flex', gap, paddingTop: 6 }}>
          {gauges.map((g, i) => (
            <div key={i} style={{ width: barWidth, textAlign: 'center' }}>
              <span className="text-[8px] text-white/50">{g.weight.toFixed(1)}%</span>
              <div className="text-[9px] text-white/70 font-bold" style={{ whiteSpace: 'nowrap' }}>
                {g.name}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-1">
            <div style={{ width: 8, height: 8, background: '#3498db' }} />
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Current weight</span>
          </div>
          <div className="flex items-center gap-1">
            <div style={{ width: 8, height: 8, background: 'rgba(74,222,128,0.3)', borderTop: '2px dashed #4ade80' }} />
            <span className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Pending votes</span>
          </div>
        </div>
      </div>
    </>
  )
}
