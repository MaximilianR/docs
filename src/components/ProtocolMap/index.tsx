import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type NodeTypes,
  type EdgeTypes,
  type NodeChange,
  type Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { initialNodes, initialEdges, type ProtocolNodeData } from './data/graph'
import { tabs } from './data/tabs'
import ContractNode from './nodes/ContractNode'
import SystemNode from './nodes/SystemNode'
import TokenNode from './nodes/TokenNode'
import ExternalNode from './nodes/ExternalNode'
import FeeFlowEdge from './edges/FeeFlowEdge'
import GovernanceEdge from './edges/GovernanceEdge'
import DataFlowEdge from './edges/DataFlowEdge'
import EmissionFlowEdge from './edges/EmissionFlowEdge'
import OracleFlowEdge from './edges/OracleFlowEdge'
import DetailPanel from './panels/DetailPanel'
import { useLiveData } from './hooks/useLiveData'
import { useCrvusdMarkets, type CrvusdMarket, type PegKeeper } from './hooks/useCrvusdMarkets'
import { formatNumber } from './utils/formatters'
import './ProtocolMap.css'

const nodeTypes: NodeTypes = {
  contractNode: ContractNode,
  systemNode: SystemNode,
  tokenNode: TokenNode,
  externalNode: ExternalNode,
}

const edgeTypes: EdgeTypes = {
  feeFlow: FeeFlowEdge,
  governanceFlow: GovernanceEdge,
  dataFlow: DataFlowEdge,
  emissionFlow: EmissionFlowEdge,
  oracleFlow: OracleFlowEdge,
}

// Per-tab localStorage keys
function posKey(tabId: string) { return `curve-map-pos-${tabId}` }
function edgeKey(tabId: string) { return `curve-map-edges-${tabId}` }
function hiddenEdgesKey(tabId: string) { return `curve-map-hidden-${tabId}` }

function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function buildNodesForTab(tabId: string) {
  const tab = tabs.find(t => t.id === tabId)!
  const isOverview = tab.nodeIds.size === 0
  const savedPositions = loadJSON<Record<string, { x: number; y: number }>>(posKey(tabId))

  return initialNodes
    .filter(n => isOverview || tab.nodeIds.has(n.id))
    .map(n => {
      const pos = savedPositions?.[n.id] ?? tab.positions[n.id] ?? n.position
      return { ...n, position: pos }
    })
}

function buildEdgesForTab(tabId: string) {
  const savedEdges = loadJSON<Record<string, { sourceHandle?: string; targetHandle?: string }>>(edgeKey(tabId))
  return initialEdges.map(e => {
    const override = savedEdges?.[e.id]
    return override ? { ...e, ...override } : e
  })
}

function buildStablecoinDynamic(markets: CrvusdMarket[], pegkeepers: PegKeeper[]) {
  const savedPositions = loadJSON<Record<string, { x: number; y: number }>>(posKey('stablecoin'))
  const nodes: Node<ProtocolNodeData>[] = []
  const edges: import('@xyflow/react').Edge[] = []

  if (markets.length > 0) {
    const totalDebt = markets.reduce((s, m) => s + m.total_debt_usd, 0)
    const totalCollateral = markets.reduce((s, m) => s + m.collateral_amount_usd, 0)
    const totalLoans = markets.reduce((s, m) => s + m.n_loans, 0)
    const marketRows = markets
      .sort((a, b) => b.total_debt_usd - a.total_debt_usd)
      .map(m => ({ symbol: m.collateral_token.symbol, debt: m.total_debt_usd, loans: m.n_loans, collateral: m.collateral_amount_usd }))
    nodes.push({
      id: 'dyn-mint-markets',
      type: 'systemNode',
      position: savedPositions?.['dyn-mint-markets'] ?? { x: -300, y: -25 },
      data: {
        label: 'Mint Markets',
        category: 'stablecoin',
        description: `${markets.length} crvUSD mint markets with ${totalLoans} active loans, $${formatNumber(totalDebt)} total debt, $${formatNumber(totalCollateral)} collateral.`,
        docPath: '/user/crvusd/understanding-crvusd',
        icon: 'controller',
        marketRows,
      },
    })
    edges.push(
      { id: 'dyn-mint-mint', source: 'dyn-mint-markets', target: 'crvusd-token', sourceHandle: 'right-source', targetHandle: 'left-target', type: 'dataFlow', label: 'Mint crvUSD', animated: true },
      { id: 'dyn-mint-interest', source: 'dyn-mint-markets', target: 'fee-splitter', sourceHandle: 'bottom-source', targetHandle: 'left-target', type: 'feeFlow', label: 'Interest' },
    )
  }

  if (pegkeepers.length > 0) {
    const totalPkDebt = pegkeepers.reduce((s, pk) => s + pk.total_debt, 0)
    const totalProfit = pegkeepers.reduce((s, pk) => s + pk.total_profit, 0)
    const pools = pegkeepers.map(pk => {
      const other = pk.pair.find(t => t.symbol !== 'crvUSD')
      return other?.symbol || '?'
    }).join(', ')
    nodes.push({
      id: 'dyn-pegkeepers',
      type: 'systemNode',
      position: savedPositions?.['dyn-pegkeepers'] ?? { x: 300, y: -25 },
      data: {
        label: 'PegKeepers',
        category: 'stablecoin',
        description: `${pegkeepers.length} active PegKeepers stabilizing crvUSD peg via ${pools} pools. Total debt: $${formatNumber(totalPkDebt)}, total profit: $${formatNumber(totalProfit)}.`,
        docPath: '/developer/crvusd/pegkeepers/overview',
        icon: 'pegkeeper',
      },
    })
    edges.push(
      { id: 'dyn-pk-stabilize', source: 'dyn-pegkeepers', target: 'crvusd-token', sourceHandle: 'left-source', targetHandle: 'right-target', type: 'dataFlow', label: 'Stabilize Peg', animated: true },
    )
  }

  return { nodes, edges }
}

// Tabs that are live vs coming soon
const ENABLED_TABS = new Set(['fees'])

interface ProtocolMapCanvasProps {
  defaultTab?: string
}

function FlowCanvas({ defaultTab = 'fees' }: ProtocolMapCanvasProps) {
  const { fitView } = useReactFlow()
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodesForTab(defaultTab))
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdgesForTab(defaultTab))
  const [hiddenEdges, setHiddenEdges] = useState<Set<string>>(() => {
    const saved = loadJSON<string[]>(hiddenEdgesKey(defaultTab))
    return new Set(saved || [])
  })
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node<ProtocolNodeData> | null>(null)
  const [popupPos, setPopupPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [search, setSearch] = useState('')
  const [animationsOn, setAnimationsOn] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const liveData = useLiveData()
  const crvusdData = useCrvusdMarkets()

  const switchTab = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setNodes(buildNodesForTab(tabId))
    setEdges(buildEdgesForTab(tabId))
    const saved = loadJSON<string[]>(hiddenEdgesKey(tabId))
    setHiddenEdges(new Set(saved || []))
    setSelectedNode(null)
    setHoveredNode(null)
    setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 50)
  }, [setNodes, setEdges, fitView])

  const onEdgesDelete = useCallback((deleted: { id: string }[]) => {
    setHiddenEdges(prev => {
      const next = new Set(prev)
      deleted.forEach(e => next.add(e.id))
      localStorage.setItem(hiddenEdgesKey(activeTab), JSON.stringify([...next]))
      return next
    })
  }, [activeTab])

  const resetTab = useCallback(() => {
    localStorage.removeItem(posKey(activeTab))
    localStorage.removeItem(edgeKey(activeTab))
    localStorage.removeItem(hiddenEdgesKey(activeTab))
    localStorage.removeItem('curve-protocol-map-label-offsets')
    setHiddenEdges(new Set())
    setNodes(buildNodesForTab(activeTab))
    setEdges(buildEdgesForTab(activeTab))
    setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 50)
  }, [activeTab, setNodes, setEdges, fitView])

  useEffect(() => {
    setTimeout(() => fitView({ padding: 0.15 }), 100)
  }, [fitView])

  useEffect(() => {
    if (activeTab !== 'stablecoin' || crvusdData.loading) return
    const { nodes: dynNodes, edges: dynEdges } = buildStablecoinDynamic(crvusdData.markets, crvusdData.pegkeepers)
    setNodes(prev => {
      const staticNodes = prev.filter(n => !n.id.startsWith('dyn-'))
      return [...staticNodes, ...dynNodes]
    })
    setEdges(prev => {
      const staticEdges = prev.filter(e => !e.id.startsWith('dyn-'))
      return [...staticEdges, ...dynEdges]
    })
    setTimeout(() => fitView({ padding: 0.15, duration: 300 }), 100)
  }, [activeTab, crvusdData.loading, crvusdData.markets, crvusdData.pegkeepers, setNodes, setEdges, fitView])

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes)
    const hasDrag = changes.some(c => c.type === 'position' && !c.dragging)
    if (hasDrag) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        setNodes(currentNodes => {
          const positions: Record<string, { x: number; y: number }> = {}
          currentNodes.forEach(n => { positions[n.id] = n.position })
          localStorage.setItem(posKey(activeTab), JSON.stringify(positions))
          return currentNodes
        })
      }, 300)
    }
  }, [onNodesChange, setNodes, activeTab])

  const onReconnect = useCallback((oldEdge: { id: string }, newConnection: Connection) => {
    setEdges(eds => {
      const updated = eds.map(e => {
        if (e.id !== oldEdge.id) return e
        return {
          ...e,
          source: newConnection.source!,
          target: newConnection.target!,
          sourceHandle: newConnection.sourceHandle,
          targetHandle: newConnection.targetHandle,
        }
      })
      const overrides: Record<string, { sourceHandle?: string; targetHandle?: string }> = {}
      updated.forEach(e => {
        if (e.sourceHandle || e.targetHandle) {
          overrides[e.id] = { sourceHandle: e.sourceHandle ?? undefined, targetHandle: e.targetHandle ?? undefined }
        }
      })
      localStorage.setItem(edgeKey(activeTab), JSON.stringify(overrides))
      return updated
    })
  }, [setEdges, activeTab])

  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      const data = n.data as ProtocolNodeData
      if (search && !data.label.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [nodes, search])

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  const filteredEdges = useMemo(() => {
    const rhVal = liveData.rhEffectiveWeight != null ? (liveData.rhEffectiveWeight / 100).toFixed(0) : '~80'
    const fcVal = liveData.rhEffectiveWeight != null ? (100 - liveData.rhEffectiveWeight / 100).toFixed(0) : '~20'
    const rhPct = `${rhVal}% (dynamic)`
    const fcPct = `${fcVal}% (dynamic)`

    const treasuryAddr = '0x6508ef65b0bd57eabd0f1d52685a70433b2d290b'
    const treasuryReceiver = liveData.allocatorReceivers?.find(r => r.address.toLowerCase() === treasuryAddr)
    const allocTreasuryLabel = treasuryReceiver != null ? `${(treasuryReceiver.weight / 100).toFixed(0)}% Treasury` : '10% Treasury'
    const allocDistLabel = liveData.allocatorDistributorWeight != null ? `${(liveData.allocatorDistributorWeight / 100).toFixed(0)}% to veCRV` : '90% to veCRV'

    return edges
      .filter(e => !hiddenEdges.has(e.id))
      .filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target))
      .map(e => {
        let edge = e
        if (e.id === 'splitter-rh') edge = { ...e, label: rhPct }
        if (e.id === 'splitter-fc') edge = { ...e, label: fcPct }
        if (e.id === 'allocator-treasury') edge = { ...e, label: allocTreasuryLabel }
        if (e.id === 'allocator-dist') edge = { ...e, label: allocDistLabel }
        return animationsOn ? edge : { ...edge, animated: false }
      })
  }, [edges, filteredNodeIds, animationsOn, liveData.rhEffectiveWeight, liveData.allocatorReceivers, liveData.allocatorDistributorWeight, hiddenEdges])

  const styledEdges = useMemo(() => {
    if (!hoveredNode) return filteredEdges
    return filteredEdges.map(e => {
      const connected = e.source === hoveredNode || e.target === hoveredNode
      return { ...e, style: { ...e.style, opacity: connected ? 1 : 0.15 } }
    })
  }, [filteredEdges, hoveredNode])

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<ProtocolNodeData>)
    setPopupPos({ x: event.clientX, y: event.clientY })
  }, [])

  return (
    <div className="protocol-map-container">
      {/* Top bar */}
      <div className="protocol-map-topbar">
        <a href="/" className="protocol-map-back">
          ← Docs
        </a>

        {/* Tab buttons */}
        <div className="protocol-map-tabs">
          {tabs.map(tab => {
            const enabled = ENABLED_TABS.has(tab.id)
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => enabled && switchTab(tab.id)}
                className={`protocol-map-tab ${!enabled ? 'protocol-map-tab-disabled' : ''}`}
                style={{
                  background: active ? '#e67e00' : enabled ? '#3465a4' : 'rgba(52,101,164,0.4)',
                }}
                title={!enabled ? 'Coming soon' : undefined}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />
      </div>

      <ReactFlow
        nodes={filteredNodes}
        edges={styledEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={onEdgesDelete}
        onReconnect={onReconnect}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={useCallback((_: React.MouseEvent, node: Node) => setHoveredNode(node.id), [])}
        onNodeMouseLeave={useCallback(() => setHoveredNode(null), [])}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edgesReconnectable
        fitView
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Controls position="bottom-left" />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(255,255,255,0.2)" />
      </ReactFlow>

      <DetailPanel node={selectedNode} liveData={liveData} position={popupPos} onClose={() => setSelectedNode(null)} />
    </div>
  )
}

interface ProtocolMapProps {
  tab?: string
}

export default function ProtocolMap({ tab = 'fees' }: ProtocolMapProps) {
  return (
    <ReactFlowProvider>
      <FlowCanvas defaultTab={tab} />
    </ReactFlowProvider>
  )
}
