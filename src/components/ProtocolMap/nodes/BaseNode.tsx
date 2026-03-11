import { Handle, Position } from '@xyflow/react'
import type { ProtocolNodeData, Category } from '../data/graph'
import { categories } from '../data/graph'

const ICON_MAP: Record<string, string> = {
  crv: '/icons/crv.svg',
  vecrv: '/icons/vecrv.svg',
  crvusd: '/icons/crvusd.svg',
  scrvusd: '/icons/scrvusd.svg',
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

  const handleClass = "!bg-transparent !w-3 !h-3 !border-0 hover:!bg-white/50 !transition-all"

  return (
    <>
      {/* Each side has both source and target handles so edges can connect from/to any direction */}
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
          background: cat.color,
          boxShadow: selected
            ? `0 0 0 2px var(--pm-node-border, white), 0 4px 12px var(--pm-node-shadow, rgba(0,0,0,0.25)), 0 0 16px ${cat.color}44`
            : `0 0 0 2px var(--pm-node-border, white), 0 4px 12px var(--pm-node-shadow, rgba(0,0,0,0.25))`,
        }}
        className={`
          relative px-4 py-2.5 cursor-pointer transition-all duration-150
          ${isToken ? 'rounded-lg min-w-[100px] text-center' : 'rounded-md min-w-[180px]'}
          ${isSystem ? 'border-2 border-dashed border-white/40' : ''}
          ${selected ? 'scale-105' : 'hover:scale-105 hover:brightness-110'}
        `}
      >
        <div className="flex items-center gap-2">
          {iconSrc ? (
            <img src={iconSrc} alt="" className="w-5 h-5 rounded-full" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))' }} />
          ) : (
            <div
              className="w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-white/40 bg-white/15 rounded"
              style={{ color: 'white' }}
            >
              {data.label.charAt(0)}
            </div>
          )}
          <div>
            <div className="font-bold text-xs text-white whitespace-nowrap" style={{ fontFamily: 'var(--Text-FontFamily-Body, system-ui, sans-serif)' }}>
              {data.label}
            </div>
            {isSystem && (
              <div className="text-[9px] text-white/60 uppercase tracking-widest" style={{ fontFamily: 'var(--Text-FontFamily-Body, system-ui, sans-serif)' }}>
                {data.category}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
