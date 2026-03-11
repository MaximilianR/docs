import { useRef, useEffect } from 'react'
import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/react'
import DraggableEdgeLabel from './DraggableEdgeLabel'

export default function GaugeEmissionEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, label, markerEnd } = props
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition })
  const animRef = useRef<SVGAnimateMotionElement>(null)
  const opacityRef = useRef<SVGAnimateElement>(null)
  const logoSize = 16

  useEffect(() => {
    const handler = () => {
      animRef.current?.beginElement()
      opacityRef.current?.beginElement()
    }
    window.addEventListener('crv-flow-trigger', handler)
    return () => window.removeEventListener('crv-flow-trigger', handler)
  }, [])

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#8888a8', strokeWidth: 2, strokeDasharray: '6 4' }} />
      <g opacity={0}>
        <animateMotion ref={animRef} dur="3s" repeatCount="1" begin="indefinite" fill="remove" path={edgePath} />
        <animate ref={opacityRef} attributeName="opacity" values="1;1;0" keyTimes="0;0.85;1" dur="3s" begin="indefinite" fill="freeze" />
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
      {label && (
        <DraggableEdgeLabel edgeId={id} labelX={labelX} labelY={labelY} label={label as string} background="#505070" borderColor="#8888a8" />
      )}
    </>
  )
}
