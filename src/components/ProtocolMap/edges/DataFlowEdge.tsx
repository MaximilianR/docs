import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

export default function DataFlowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd, animated } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#8888a8', strokeWidth: 2, strokeDasharray: '6 4' }} />
      {animated && (
        <circle r={3} fill="#c0c0c0" stroke="#8888a8" strokeWidth={1.5}>
          <animateMotion dur="4s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#505070" borderColor="#8888a8" />
      )}
    </>
  )
}
