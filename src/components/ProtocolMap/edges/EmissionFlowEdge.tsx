import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

const CRV_LOGO_EDGES = new Set([
  'minter-crv',
  'minter-gauges',
  'gauges-stableswap',
  'gauges-twocrypto',
  'gauges-tricrypto',
  'u-gc-gauges',
])

export default function EmissionFlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  const useCrvLogo = CRV_LOGO_EDGES.has(id)
  const logoSize = 16

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#22c55e', strokeWidth: 3 }} />
      {useCrvLogo ? (
        <g>
          <animateMotion dur="3s" repeatCount="indefinite" path={edgePath} />
          <image
            href="/icons/crv.svg"
            x={-logoSize / 2}
            y={-logoSize / 2}
            width={logoSize}
            height={logoSize}
            clipPath={`circle(${logoSize / 2}px)`}
            style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.5))' }}
          />
        </g>
      ) : (
        <circle r={4} fill="#4ade80" stroke="#16a34a" strokeWidth={1.5}>
          <animateMotion dur="2.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#15803d" borderColor="#22c55e" />
      )}
    </>
  )
}
