import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

export default function GovernanceEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#a855f7', strokeWidth: 3, strokeDasharray: '8 4' }} />
      <circle r={4} fill="#c084fc" stroke="#7c3aed" strokeWidth={1.5}>
        <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
      </circle>
      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#6d28d9" borderColor="#a855f7" />
      )}
    </>
  )
}
