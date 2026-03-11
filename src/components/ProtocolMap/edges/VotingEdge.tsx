import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

export default function VotingEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#a855f7', strokeWidth: 3, strokeDasharray: '8 4' }} />

      {/* YES card */}
      <g>
        <animateMotion dur="5s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" />
        <rect x={-14} y={-8} width={28} height={16} rx={2} fill="#22c55e" stroke="#16a34a" strokeWidth={1.5} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold" fontFamily="System, monospace">YES</text>
      </g>

      {/* NO card — offset by half the duration */}
      <g>
        <animateMotion dur="5s" repeatCount="indefinite" path={edgePath} keyPoints="0;1" keyTimes="0;1" begin="2.5s" />
        <rect x={-12} y={-8} width={24} height={16} rx={2} fill="#ef4444" stroke="#dc2626" strokeWidth={1.5} />
        <text x={0} y={1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={8} fontWeight="bold" fontFamily="System, monospace">NO</text>
      </g>

      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#6d28d9" borderColor="#a855f7" />
      )}
    </>
  )
}
