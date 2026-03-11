import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import { useMemo, useState, useCallback } from 'react'
import DraggableEdgeLabel from './DraggableEdgeLabel'
import { useSettlementTokens } from '../hooks/useSettlementTokens'

const CRVUSD_EDGES = new Set([
  'mint-markets-splitter',
  'splitter-rh',
  'splitter-fc',
  'burner-fc',
  'fc-allocator',
  'allocator-treasury',
  'allocator-dist',
  'dist-vecrv',
  'rh-scrvusd',
])

// Edges that show token icons from settlements
const STABLE_EDGES = new Set(['stableswap-fees'])
const VOLATILE_EDGES = new Set(['twocrypto-fees', 'tricrypto-fees'])
const ALL_TOKEN_EDGES = new Set(['fc-burner'])

// Seeded pseudo-random shuffle per edge so it's stable across renders
function shuffleWithSeed(arr: string[], seed: number): string[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    const j = s % (i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function FeeFlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const settlements = useSettlementTokens()

  const useCrvusdLogo = CRVUSD_EDGES.has(id) || id === 'dyn-mint-interest'
  const isStableEdge = STABLE_EDGES.has(id)
  const isVolatileEdge = VOLATILE_EDGES.has(id)
  const isAllTokenEdge = ALL_TOKEN_EDGES.has(id)
  const useTokenIcons = isStableEdge || isVolatileEdge || isAllTokenEdge
  const logoSize = 16

  // Fee flows use dark silver-gray — neutral infrastructure
  const colors = {
    stroke: '#606078',
    dash: '#808098',
    label: '#404058',
    border: '#606078',
  }

  // Pick tokens based on edge type from live settlement data
  // fc-burner reuses the same tokens shown on the incoming pool edges
  const tokens = useMemo(() => {
    if (!useTokenIcons || settlements.loading) return []
    const stablePool = settlements.stableTokens.map(t => t.iconUrl)
    const volatilePool = settlements.volatileTokens.map(t => t.iconUrl)

    if (isStableEdge) {
      if (stablePool.length === 0) return []
      return shuffleWithSeed(stablePool, hashId(id)).slice(0, Math.min(3, stablePool.length))
    }
    if (isVolatileEdge) {
      if (volatilePool.length === 0) return []
      return shuffleWithSeed(volatilePool, hashId(id)).slice(0, Math.min(3, volatilePool.length))
    }
    // fc-burner: combine the exact tokens picked by the 3 pool edges
    const fromStable = stablePool.length > 0 ? shuffleWithSeed(stablePool, hashId('stableswap-fees')).slice(0, Math.min(3, stablePool.length)) : []
    const fromTwocrypto = volatilePool.length > 0 ? shuffleWithSeed(volatilePool, hashId('twocrypto-fees')).slice(0, Math.min(3, volatilePool.length)) : []
    const fromTricrypto = volatilePool.length > 0 ? shuffleWithSeed(volatilePool, hashId('tricrypto-fees')).slice(0, Math.min(3, volatilePool.length)) : []
    // Deduplicate and pick up to 4
    const combined = [...new Set([...fromStable, ...fromTwocrypto, ...fromTricrypto])]
    return shuffleWithSeed(combined, hashId(id)).slice(0, Math.min(4, combined.length))
  }, [id, useTokenIcons, isStableEdge, isVolatileEdge, settlements])

  const clipId = `clip-circle-${id}`

  // Track which token images failed to load
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const onImageError = useCallback((index: number) => {
    setFailedImages(prev => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <circle cx={0} cy={0} r={logoSize / 2} />
        </clipPath>
      </defs>

      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: colors.stroke, strokeWidth: 3 }} />
      <path
        d={edgePath}
        fill="none"
        stroke={colors.dash}
        strokeWidth={3}
        strokeDasharray="6 4"
        style={{ animation: 'dashFlow 1.5s linear infinite' }}
      />

      {useCrvusdLogo && (
        <g>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
          <image
            href="/icons/crvusd.svg"
            x={-logoSize / 2}
            y={-logoSize / 2}
            width={logoSize}
            height={logoSize}
            clipPath={`url(#${clipId})`}
            style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
          />
        </g>
      )}

      {useTokenIcons && tokens.map((icon, i) => (
        !failedImages.has(i) && (
          <g key={i}>
            <animateMotion
              dur={`${6 + i * 1.5}s`}
              repeatCount="indefinite"
              path={edgePath}
              begin={`${i * 2.5 + (hashId(id) % 3) * 0.7}s`}
            />
            <foreignObject x={-logoSize / 2} y={-logoSize / 2} width={logoSize} height={logoSize}>
              <img
                src={icon}
                width={logoSize}
                height={logoSize}
                style={{
                  borderRadius: '50%',
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))',
                  display: failedImages.has(i) ? 'none' : 'block',
                }}
                onError={() => onImageError(i)}
              />
            </foreignObject>
          </g>
        )
      ))}

      {!useCrvusdLogo && !useTokenIcons && (
        <circle r={5} fill={colors.dash} stroke={colors.stroke} strokeWidth={1.5}>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background={colors.label} borderColor={colors.border} />
      )}
    </>
  )
}
