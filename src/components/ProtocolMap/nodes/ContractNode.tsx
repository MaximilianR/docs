import type { NodeProps, Node } from '@xyflow/react'
import type { ProtocolNodeData } from '../data/graph'
import BaseNode from './BaseNode'

export default function ContractNode({ data, selected }: NodeProps<Node<ProtocolNodeData>>) {
  return <BaseNode data={data} selected={!!selected} variant="default" />
}
