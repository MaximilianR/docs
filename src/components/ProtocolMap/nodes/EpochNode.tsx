import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'
import type { ProtocolNodeData } from '../data/graph'

interface EpochData extends ProtocolNodeData {
  simProgress?: number // 0–1, passed from parent
}

const DAYS = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']

function getPhase(progress: number) {
  if (progress < 0.02)
    return { phase: 'Snapshot', color: '#22c55e', detail: 'Gauge weights updated. New emission rates applied.' }
  return { phase: 'Epoch Active', color: '#3b82f6', detail: 'CRV streaming to gauges. Votes accumulate for next snapshot.' }
}

function getDay(progress: number) {
  const dayIdx = Math.min(Math.floor(progress * 7), 6)
  return DAYS[dayIdx]
}

function getCountdown(progress: number) {
  const remaining = (1 - progress) * 7
  const days = Math.floor(remaining)
  const hours = Math.floor((remaining - days) * 24)
  return { days, hours }
}

export default function EpochNode({ data, selected }: NodeProps<Node<EpochData>>) {
  const progress = (data as EpochData).simProgress ?? 0
  const { phase, color, detail } = getPhase(progress)
  const day = getDay(progress)
  const countdown = getCountdown(progress)

  const handleClass = "!bg-transparent !w-3 !h-3 !border-0 hover:!bg-white/50 !transition-all"

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
          background: '#1e1b4b',
          boxShadow: selected
            ? `0 0 0 3px #4c1d95, 8px 8px 3px rgba(0,0,0,0.5), 0 0 16px #8b5cf666`
            : `0 0 0 3px #4c1d95, 8px 8px 3px rgba(0,0,0,0.5)`,
          minWidth: 260,
          fontFamily: 'System, monospace',
          cursor: 'pointer',
          border: '6px double #a78bfa',
          transition: 'all 150ms',
        }}
        className={`relative px-4 py-3 ${selected ? 'scale-105' : 'hover:scale-105 hover:brightness-110'}`}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Weekly Epoch
          </span>
          <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {day}
          </span>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
          <span className="text-xs font-bold" style={{ color }}>
            {phase}
          </span>
        </div>

        <div className="text-[10px] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {detail}
        </div>

        {/* Progress bar with day markers */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', height: 6, position: 'relative' }}>
            {/* Full background gradient showing continuous streaming */}
            <div
              style={{
                background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 5%, #3b82f6 95%, #22c55e 100%)',
                height: '100%',
                width: '100%',
                opacity: 0.3,
              }}
            />
            {/* Filled portion */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                background: `linear-gradient(90deg, #22c55e 0%, #3b82f6 5%, #3b82f6 100%)`,
                height: '100%',
                width: `${progress * 100}%`,
                opacity: 0.7,
                transition: 'width 0.15s',
              }}
            />
            {/* Current position indicator */}
            <div
              style={{
                position: 'absolute',
                left: `${progress * 100}%`,
                top: -3,
                width: 3,
                height: 12,
                background: 'white',
                transform: 'translateX(-1px)',
                boxShadow: '0 0 4px white',
                transition: 'left 0.15s',
              }}
            />
          </div>
          {/* Day labels */}
          <div className="flex justify-between mt-0.5">
            {DAYS.map((d, i) => (
              <span
                key={d}
                className="text-[7px]"
                style={{
                  color: Math.floor(progress * 7) === i ? 'white' : 'rgba(255,255,255,0.3)',
                  fontWeight: Math.floor(progress * 7) === i ? 'bold' : 'normal',
                }}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px]">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Next snapshot</span>
            <span className="font-bold text-white">{countdown.days}d {countdown.hours}h</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Voting</span>
            <span style={{ color: '#a855f7' }} className="font-bold">Always open</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>CRV streaming</span>
            <span style={{ color: '#3b82f6' }} className="font-bold">Continuous</span>
          </div>
        </div>
      </div>
    </>
  )
}
