import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

// Simple hash to get a stable pseudo-random number from edge ID
function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

export default function GovernanceEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })

  const h = hashId(id)
  const dur = 3 + (h % 30) / 10 // 3s–6s
  const delay = (h % 40) / 10   // 0s–4s

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#a855f7', strokeWidth: 3, strokeDasharray: '8 4' }} />
      <circle r={4} fill="#c084fc" stroke="#7c3aed" strokeWidth={1.5} opacity="0">
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={edgePath} />
        <animate attributeName="opacity" from="0" to="1" dur="0.01s" begin={`${delay}s`} fill="freeze" />
      </circle>
      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#6d28d9" borderColor="#a855f7" />
      )}
    </>
  )
}
