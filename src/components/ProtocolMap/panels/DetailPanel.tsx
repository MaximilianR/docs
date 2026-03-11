import { useRef, useEffect, useState, useCallback } from 'react'
import type { Node } from '@xyflow/react'
import type { ProtocolNodeData } from '../data/graph'
import { categories } from '../data/graph'
import type { LiveData } from '../hooks/useLiveData'
import { formatNumber, shortenAddress } from '../utils/formatters'

const DOCS_BASE = ''
const MARKETS_API = 'https://prices.curve.finance/v1/crvusd/markets/ethereum'

// Known address labels for FeeAllocator receivers
const ADDRESS_LABELS: Record<string, string> = {
  '0x6508ef65b0bd57eabd0f1d52685a70433b2d290b': 'Treasury',
}
const FEE_API = 'https://prices.curve.finance/v1/dao/fees/distributions'
const FEE_PER_PAGE = 5
const SAVINGS_API = 'https://prices.curve.finance/v1/crvusd/savings/revenue'
const SAVINGS_PER_PAGE = 5
const SETTLEMENTS_API = 'https://prices.curve.finance/v1/dao/fees/settlements'
const SETTLEMENTS_PER_PAGE = 10

interface DetailPanelProps {
  node: Node<ProtocolNodeData> | null
  liveData: LiveData
  position: { x: number; y: number }
  onClose: () => void
}

interface FeeDistribution {
  fees_usd: number
  timestamp: string
}

interface SavingsDistribution {
  gain: string
  dt: string
  tx_hash: string
}

interface SavingsData {
  total_distributed: string
  count: number
  history: SavingsDistribution[]
}

interface Settlement {
  coin: { symbol: string; address: string; lp_token: boolean; precision: number }
  amount: string
  amount_received: number
  tx_hash: string
  dt: string
}

function getLiveValue(key: string | undefined, liveData: LiveData): { label: string; value: string; icon?: string } | null {
  if (!key) return null
  switch (key) {
    case 'crvSupply': return liveData.crvSupply ? { label: 'Total Supply', value: formatNumber(parseFloat(liveData.crvSupply)) + ' CRV' } : null
    case 'crvusdSupply': return liveData.crvusdSupply ? { label: 'Total Supply', value: formatNumber(parseFloat(liveData.crvusdSupply)) + ' crvUSD' } : null
    case 'vecrvSupply': return liveData.vecrvSupply ? { label: 'Total Locked', value: formatNumber(parseFloat(liveData.vecrvSupply)) + ' veCRV' } : null
    case 'scrvusdAssets': return liveData.scrvusdSupply ? { label: 'Total Deposits', value: formatNumber(parseFloat(liveData.scrvusdSupply)) + ' crvUSD' } : null
    case 'nGauges': return liveData.nGauges ? { label: 'Active Gauges', value: liveData.nGauges } : null
    case 'minterRate': return liveData.minterRate ? { label: 'Emission Rate', value: formatNumber(parseFloat(liveData.minterRate) * 86400) + ' CRV/day' } : null
    case 'treasuryBalance': return liveData.treasuryBalance ? { label: 'crvUSD Balance', value: formatNumber(parseFloat(liveData.treasuryBalance)), icon: '/icons/crvusd.svg' } : null
    default: return null
  }
}

function formatDate(ts: string, includeTime = false): string {
  const d = new Date(ts)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  if (!includeTime) return date
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${date} ${time}`
}

export default function DetailPanel({ node, liveData, position, onClose }: DetailPanelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(position)
  const [showFeeHistory, setShowFeeHistory] = useState(false)
  const [feeHistory, setFeeHistory] = useState<FeeDistribution[] | null>(null)
  const [feePage, setFeePage] = useState(1)
  const [feeCount, setFeeCount] = useState(0)
  const [feeLoading, setFeeLoading] = useState(false)

  // Market fees (FeeSplitter)
  const [marketFees, setMarketFees] = useState<{ pending: number; collected: number } | null>(null)

  // Savings revenue history (RewardsHandler)
  const [showSavingsHistory, setShowSavingsHistory] = useState(false)
  const [savingsData, setSavingsData] = useState<SavingsData | null>(null)
  const [savingsPage, setSavingsPage] = useState(1)
  const [savingsLoading, setSavingsLoading] = useState(false)

  // Settlements (CowSwap Burner)
  const [showSettlements, setShowSettlements] = useState(false)
  const [settlements, setSettlements] = useState<Settlement[] | null>(null)
  const [settlementsLoading, setSettlementsLoading] = useState(false)

  // Dragging state
  const [dragging, setDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Only drag from the title bar
    if ((e.target as HTMLElement).closest('button')) return
    setDragging(true)
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    e.preventDefault()
  }, [pos])

  useEffect(() => {
    if (!dragging) return
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y })
    }
    const onUp = () => setDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [dragging])

  // Clamp position so popup stays within viewport on initial open
  useEffect(() => {
    if (!node || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const pad = 16
    let x = position.x + 12
    let y = position.y - 20
    if (x + rect.width + pad > window.innerWidth) x = position.x - rect.width - 12
    if (y + rect.height + pad > window.innerHeight) y = window.innerHeight - rect.height - pad
    if (y < pad) y = pad
    if (x < pad) x = pad
    setPos({ x, y })
    setShowFeeHistory(false)
    setFeeHistory(null)
    setFeePage(1)
    setFeeCount(0)
    setMarketFees(null)
    setShowSavingsHistory(false)
    setSavingsData(null)
    setSavingsPage(1)
    setShowSettlements(false)
    setSettlements(null)
  }, [node, position])

  // Fetch market fees for crvUSD Mint Markets
  useEffect(() => {
    if (!node || node.id !== 'crvusd-mint-markets') return
    fetch(MARKETS_API)
      .then(r => r.json())
      .then(data => {
        const markets = data?.data as { pending_fees: number; collected_fees: number }[] | undefined
        if (markets) {
          const pending = markets.reduce((sum, m) => sum + (m.pending_fees || 0), 0)
          const collected = markets.reduce((sum, m) => sum + (m.collected_fees || 0), 0)
          setMarketFees({ pending, collected })
        }
      })
      .catch(() => {})
  }, [node])

  // Fetch fee history when toggled / page changes
  // First entry is always the current incomplete week, so we skip it by fetching with +1 offset
  useEffect(() => {
    if (!showFeeHistory) return
    setFeeLoading(true)
    // We want items [1..] from the API (skip incomplete week at index 0)
    // Map our pages to: page1 = API items 1-5, page2 = items 6-10, etc.
    const startIdx = (feePage - 1) * FEE_PER_PAGE + 1 // +1 to skip first
    // API is 1-indexed pages, so compute which API page and slice
    const apiPage = Math.floor(startIdx / FEE_PER_PAGE) + 1
    const sliceStart = startIdx - (apiPage - 1) * FEE_PER_PAGE
    fetch(`${FEE_API}?page=${apiPage}&per_page=${FEE_PER_PAGE + 1}`)
      .then(r => r.json())
      .then(data => {
        const distributions = (data.distributions as FeeDistribution[]).slice(sliceStart, sliceStart + FEE_PER_PAGE)
        setFeeCount(data.count - 1)
        setFeeHistory(distributions)
      })
      .catch(() => { setFeeHistory([]); setFeeCount(0) })
      .finally(() => setFeeLoading(false))
  }, [showFeeHistory, feePage])

  // Fetch savings revenue history when toggled / page changes
  useEffect(() => {
    if (!showSavingsHistory) return
    setSavingsLoading(true)
    fetch(`${SAVINGS_API}?page=${savingsPage}&per_page=${SAVINGS_PER_PAGE}`)
      .then(r => r.json())
      .then((data: SavingsData) => setSavingsData(data))
      .catch(() => setSavingsData({ total_distributed: '0', count: 0, history: [] }))
      .finally(() => setSavingsLoading(false))
  }, [showSavingsHistory, savingsPage])

  // Fetch settlements when toggled (CowSwap Burner)
  useEffect(() => {
    if (!showSettlements) return
    setSettlementsLoading(true)
    const now = Math.floor(Date.now() / 1000)
    fetch(`${SETTLEMENTS_API}?timestamp=${now}`)
      .then(r => r.json())
      .then(resp => {
        const entries = resp?.data as Settlement[] | undefined
        if (entries) {
          // Filter out LP tokens, sort by date desc
          const filtered = entries
            .filter(e => !e.coin.lp_token)
            .sort((a, b) => new Date(b.dt).getTime() - new Date(a.dt).getTime())
          setSettlements(filtered)
        }
      })
      .catch(() => setSettlements([]))
      .finally(() => setSettlementsLoading(false))
  }, [showSettlements])

  if (!node) return null

  const { data } = node
  const cat = categories[data.category]
  const live = getLiveValue(data.liveDataKey, liveData)
  const isFeeDistributor = node.id === 'fee-distributor'
  const isRewardsHandler = node.id === 'rewards-handler'
  const isCowswapBurner = node.id === 'cowswap-burner'

  return (
    <div
      ref={ref}
      className="fixed z-50 protocol-map-detail-panel"
      style={{
        left: pos.x,
        top: pos.y,
        width: 300,
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
        background: '#3465a4',
        color: 'white',
        border: '6px double white',
        boxShadow: '8px 8px 0 rgba(0,0,0,0.35)',
        fontFamily: 'System, monospace',
      }}
    >
      {/* Title bar — draggable */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '2px solid rgba(255,255,255,0.3)', cursor: 'grab' }}
        onMouseDown={onMouseDown}
      >
        <span className="text-xs font-bold truncate select-none">{data.label}</span>
        <button
          onClick={onClose}
          className="hover:opacity-70 flex-shrink-0 ml-2"
          style={{
            background: 'red',
            color: 'white',
            border: '1px outset red',
            width: 18,
            height: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 'bold',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Category badge */}
        <span
          className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: cat.color, border: '1px outset ' + cat.color, boxShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}
        >
          {data.category}
        </span>

        {/* Description */}
        <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{data.description}</p>

        {/* Market breakdown table (dynamic stablecoin tab) */}
        {(data as any).marketRows && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Markets (Live)
            </div>
            <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Collateral</th>
                  <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Debt</th>
                  <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Loans</th>
                </tr>
              </thead>
              <tbody>
                {((data as any).marketRows as { symbol: string; debt: number; loans: number }[]).map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.8)' }}>{r.symbol}</td>
                    <td className="py-px font-bold text-right">${formatNumber(r.debt)}</td>
                    <td className="py-px text-right">{r.loans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from API
            </div>
          </div>
        )}

        {/* Live data — combine with scrvUSD APY when both available */}
        {live && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="flex items-center gap-2">
              {live.icon && <img src={live.icon} alt="" className="w-5 h-5 rounded-full" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>{live.label}</span>
                  <span className="text-[10px] flex items-center gap-1" style={{ color: '#4ade80' }}>
                    <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
                    Live
                  </span>
                </div>
                <div className="text-sm font-bold">{live.value}</div>
              </div>
            </div>
            {node.id === 'scrvusd' && liveData.scrvusdApy != null && (
              <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Projected APY</span>
                </div>
                <div className="text-sm font-bold">{liveData.scrvusdApy.toFixed(2)}%</div>
              </div>
            )}
          </div>
        )}

        {liveData.loading && data.liveDataKey && (
          <div className="animate-pulse" style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="h-3 bg-white/20 w-20 mb-2" />
            <div className="h-5 bg-white/20 w-32" />
          </div>
        )}

        {/* crvUSD Mint Markets collected & pending fees */}
        {node.id === 'crvusd-mint-markets' && marketFees && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Interest Fees
            </div>
            <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Total Collected</td>
                  <td className="py-px font-bold text-right">{formatNumber(marketFees.collected)} crvUSD</td>
                </tr>
                <tr>
                  <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Pending Collection</td>
                  <td className="py-px font-bold text-right">{formatNumber(marketFees.pending)} crvUSD</td>
                </tr>
              </tbody>
            </table>
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from API
            </div>
          </div>
        )}

        {/* FeeSplitter active receivers */}
        {node.id === 'fee-splitter' && liveData.rhEffectiveWeight != null && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Active Receivers
            </div>
            <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Receiver</th>
                  <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Share</th>
                  <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <td className="py-px" style={{ color: 'rgba(255,255,255,0.85)' }}>RewardsHandler</td>
                  <td className="py-px font-bold text-right">{(liveData.rhEffectiveWeight / 100).toFixed(2)}%</td>
                  <td className="py-px text-right text-[10px]" style={{ color: '#facc15' }}>dynamic</td>
                </tr>
                <tr>
                  <td className="py-px" style={{ color: 'rgba(255,255,255,0.85)' }}>FeeCollector</td>
                  <td className="py-px font-bold text-right">{(100 - liveData.rhEffectiveWeight / 100).toFixed(2)}%</td>
                  <td className="py-px text-right text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>static</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              The RewardsHandler weight is dynamic — it requests a share equal to the percentage of total crvUSD supply staked in scrvUSD, capped by a configured maximum. The FeeCollector receives the remainder.
            </p>
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from Ethereum
            </div>
          </div>
        )}

        {/* FeeAllocator receivers */}
        {node.id === 'fee-allocator' && liveData.allocatorReceivers && liveData.allocatorReceivers.length > 0 && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Active Receivers
            </div>
            <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                  <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Receiver</th>
                  <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {liveData.allocatorReceivers.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px">
                      <a
                        href={`https://etherscan.io/address/${r.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {ADDRESS_LABELS[r.address.toLowerCase()] || shortenAddress(r.address)}
                      </a>
                    </td>
                    <td className="py-px font-bold text-right">{(r.weight / 100).toFixed(2)}%</td>
                  </tr>
                ))}
                {liveData.allocatorDistributorWeight != null && (
                  <tr>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.85)' }}>FeeDistributor</td>
                    <td className="py-px font-bold text-right">{(liveData.allocatorDistributorWeight / 100).toFixed(2)}%</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from Ethereum
            </div>
          </div>
        )}

        {/* RewardsHandler dynamic weight breakdown */}
        {node.id === 'rewards-handler' && liveData.rhEffectiveWeight != null && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Dynamic Weight
            </div>
            <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {liveData.crvusdCirculating != null && (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>crvUSD Minted</td>
                    <td className="py-px font-bold text-right">{formatNumber(parseFloat(liveData.crvusdCirculating))}</td>
                  </tr>
                )}
                {liveData.scrvusdAssets != null && (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>scrvUSD Staked</td>
                    <td className="py-px font-bold text-right">{formatNumber(parseFloat(liveData.scrvusdAssets))}</td>
                  </tr>
                )}
                {liveData.rhDynamicWeight != null && (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Requested Weight</td>
                    <td className="py-px font-bold text-right">{(liveData.rhDynamicWeight / 100).toFixed(2)}%</td>
                  </tr>
                )}
                {liveData.rhMaxWeight != null && (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Maximum (cap)</td>
                    <td className="py-px font-bold text-right">{(liveData.rhMaxWeight / 100).toFixed(2)}%</td>
                  </tr>
                )}
                {liveData.rhMinWeight != null && (
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                    <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Minimum (floor)</td>
                    <td className="py-px font-bold text-right">{(liveData.rhMinWeight / 100).toFixed(2)}%</td>
                  </tr>
                )}
                <tr>
                  <td className="py-px" style={{ color: 'rgba(255,255,255,0.6)' }}>Effective Weight</td>
                  <td className="py-px font-bold text-right" style={{ color: '#4ade80' }}>{(liveData.rhEffectiveWeight / 100).toFixed(2)}%</td>
                </tr>
              </tbody>
            </table>
            <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Weight is based on a TWA (time-weighted average, 1 week window) of scrvUSD staked / crvUSD minted from controllers{liveData.scrvusdAssets != null && liveData.crvusdCirculating != null
                ? ` (currently ${(parseFloat(liveData.scrvusdAssets) / parseFloat(liveData.crvusdCirculating) * 100).toFixed(2)}%)`
                : ''}, clamped between min and max. Distribution is permissionless — anyone can call process_rewards(). Once triggered, rewards stream linearly to scrvUSD holders over the vault's distribution time.
            </p>
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from Ethereum
            </div>
          </div>
        )}

        {/* Contract address */}
        {data.address && (
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Contract</div>
            <a
              href={`https://etherscan.io/address/${data.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold hover:underline"
              style={{ color: 'white' }}
            >
              {shortenAddress(data.address)}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(data.address!)}
              className="ml-2 text-[10px] hover:underline"
              style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'System, monospace' }}
            >
              [copy]
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {data.docPath && (
            <a
              href={`${DOCS_BASE}${data.docPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-3 py-1 text-[11px] font-bold hover:brightness-110 transition-all"
              style={{
                background: 'green',
                color: 'white',
                border: '1px outset green',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                textDecoration: 'none',
              }}
            >
              View Full Docs →
            </a>
          )}

          {isFeeDistributor && (
            <button
              onClick={() => setShowFeeHistory(v => !v)}
              className="inline-block px-3 py-1 text-[11px] font-bold text-white hover:brightness-110 transition-all"
              style={{
                background: showFeeHistory ? '#cc6600' : '#e67e00',
                border: '1px outset #e67e00',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontFamily: 'System, monospace',
              }}
            >
              {showFeeHistory ? 'Hide History' : 'Fee History →'}
            </button>
          )}

          {isRewardsHandler && (
            <button
              onClick={() => setShowSavingsHistory(v => !v)}
              className="inline-block px-3 py-1 text-[11px] font-bold text-white hover:brightness-110 transition-all"
              style={{
                background: showSavingsHistory ? '#cc6600' : '#e67e00',
                border: '1px outset #e67e00',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontFamily: 'System, monospace',
              }}
            >
              {showSavingsHistory ? 'Hide History' : 'Distribution History →'}
            </button>
          )}

          {isCowswapBurner && (
            <button
              onClick={() => setShowSettlements(v => !v)}
              className="inline-block px-3 py-1 text-[11px] font-bold text-white hover:brightness-110 transition-all"
              style={{
                background: showSettlements ? '#cc6600' : '#e67e00',
                border: '1px outset #e67e00',
                boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                cursor: 'pointer',
                fontFamily: 'System, monospace',
              }}
            >
              {showSettlements ? 'Hide Settlements' : 'Recent Settlements →'}
            </button>
          )}
        </div>

        {/* Fee distribution history (FeeDistributor only) */}
        {isFeeDistributor && showFeeHistory && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Weekly Distributions
            </div>
            {feeLoading && (
              <div className="animate-pulse space-y-1">
                {[...Array(FEE_PER_PAGE)].map((_, i) => <div key={i} className="h-3 bg-white/20 w-full" />)}
              </div>
            )}
            {feeHistory && feeHistory.length > 0 && !feeLoading && (
              <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                    <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Week</th>
                    <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Fees (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {feeHistory.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td className="py-px" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatDate(d.timestamp)}</td>
                      <td className="py-px font-bold text-right">${formatNumber(d.fees_usd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {feeHistory && feeHistory.length === 0 && !feeLoading && (
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>No data available</div>
            )}
            {/* Pagination */}
            {feeCount > FEE_PER_PAGE && (
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setFeePage(p => Math.max(1, p - 1))}
                  disabled={feePage <= 1}
                  className="text-[10px] font-bold"
                  style={{
                    background: feePage <= 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    border: '1px outset rgba(255,255,255,0.3)',
                    color: feePage <= 1 ? 'rgba(255,255,255,0.3)' : 'white',
                    padding: '2px 8px',
                    cursor: feePage <= 1 ? 'default' : 'pointer',
                    fontFamily: 'System, monospace',
                  }}
                >
                  ← Prev
                </button>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {feePage} / {Math.ceil(feeCount / FEE_PER_PAGE)}
                </span>
                <button
                  onClick={() => setFeePage(p => p + 1)}
                  disabled={feePage >= Math.ceil(feeCount / FEE_PER_PAGE)}
                  className="text-[10px] font-bold"
                  style={{
                    background: feePage >= Math.ceil(feeCount / FEE_PER_PAGE) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    border: '1px outset rgba(255,255,255,0.3)',
                    color: feePage >= Math.ceil(feeCount / FEE_PER_PAGE) ? 'rgba(255,255,255,0.3)' : 'white',
                    padding: '2px 8px',
                    cursor: feePage >= Math.ceil(feeCount / FEE_PER_PAGE) ? 'default' : 'pointer',
                    fontFamily: 'System, monospace',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Settlements history (CowSwap Burner) */}
        {isCowswapBurner && showSettlements && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Latest Settlements
            </div>
            {settlementsLoading && (
              <div className="animate-pulse space-y-1">
                {[...Array(SETTLEMENTS_PER_PAGE)].map((_, i) => <div key={i} className="h-3 bg-white/20 w-full" />)}
              </div>
            )}
            {settlements && settlements.length > 0 && !settlementsLoading && (
              <>
                <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                      <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Token</th>
                      <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Received (USD)</th>
                      <th className="py-px w-5" />
                    </tr>
                  </thead>
                  <tbody>
                    {settlements.slice(0, SETTLEMENTS_PER_PAGE).map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td className="py-px" style={{ color: 'rgba(255,255,255,0.85)' }}>{s.coin.symbol}</td>
                        <td className="py-px font-bold text-right">${formatNumber(s.amount_received)}</td>
                        <td className="py-px text-right">
                          <a
                            href={`https://etherscan.io/tx/${s.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on Etherscan"
                            className="inline-block hover:opacity-70"
                            style={{ lineHeight: 0 }}
                          >
                            <img src="/icons/etherscan.svg" alt="Etherscan" className="w-3.5 h-3.5 inline-block" style={{ opacity: 0.6 }} />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Showing {Math.min(SETTLEMENTS_PER_PAGE, settlements.length)} of {settlements.length} tokens
                </div>
              </>
            )}
            {settlements && settlements.length === 0 && !settlementsLoading && (
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>No settlements found</div>
            )}
            <div className="text-[10px] mt-2 flex items-center gap-1" style={{ color: '#4ade80' }}>
              <span className="w-1.5 h-1.5 bg-green-400 inline-block pulse-glow" />
              Live from API
            </div>
          </div>
        )}

        {/* Savings distribution history (RewardsHandler) */}
        {isRewardsHandler && showSavingsHistory && (
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '2px inset rgba(255,255,255,0.2)', padding: '6px 8px' }}>
            {savingsData && savingsData.total_distributed !== '0' && (
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Total Distributed
                </div>
                <div className="text-[11px] font-bold">
                  {formatNumber(parseFloat(savingsData.total_distributed) / 1e18)} crvUSD
                </div>
              </div>
            )}
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Recent Distributions
            </div>
            {savingsLoading && (
              <div className="animate-pulse space-y-1">
                {[...Array(SAVINGS_PER_PAGE)].map((_, i) => <div key={i} className="h-3 bg-white/20 w-full" />)}
              </div>
            )}
            {savingsData && savingsData.history.length > 0 && !savingsLoading && (
              <table className="text-[11px] w-full" style={{ borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
                    <th className="py-px text-left font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Date</th>
                    <th className="py-px text-right font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Gain (crvUSD)</th>
                    <th className="py-px w-5" />
                  </tr>
                </thead>
                <tbody>
                  {savingsData.history.map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td className="py-px" style={{ color: 'rgba(255,255,255,0.8)' }}>{formatDate(d.dt, true)}</td>
                      <td className="py-px font-bold text-right">{formatNumber(parseFloat(d.gain) / 1e18)}</td>
                      <td className="py-px text-right">
                        <a
                          href={`https://etherscan.io/tx/${d.tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on Etherscan"
                          className="inline-block hover:opacity-70"
                          style={{ lineHeight: 0 }}
                        >
                          <img src="/icons/etherscan.svg" alt="Etherscan" className="w-3.5 h-3.5 inline-block" style={{ opacity: 0.6 }} />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {savingsData && savingsData.history.length === 0 && !savingsLoading && (
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>No data available</div>
            )}
            {/* Pagination */}
            {savingsData && savingsData.count > SAVINGS_PER_PAGE && (
              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={() => setSavingsPage(p => Math.max(1, p - 1))}
                  disabled={savingsPage <= 1}
                  className="text-[10px] font-bold"
                  style={{
                    background: savingsPage <= 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    border: '1px outset rgba(255,255,255,0.3)',
                    color: savingsPage <= 1 ? 'rgba(255,255,255,0.3)' : 'white',
                    padding: '2px 8px',
                    cursor: savingsPage <= 1 ? 'default' : 'pointer',
                    fontFamily: 'System, monospace',
                  }}
                >
                  ← Prev
                </button>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {savingsPage} / {Math.ceil(savingsData.count / SAVINGS_PER_PAGE)}
                </span>
                <button
                  onClick={() => setSavingsPage(p => p + 1)}
                  disabled={savingsPage >= Math.ceil(savingsData.count / SAVINGS_PER_PAGE)}
                  className="text-[10px] font-bold"
                  style={{
                    background: savingsPage >= Math.ceil(savingsData.count / SAVINGS_PER_PAGE) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    border: '1px outset rgba(255,255,255,0.3)',
                    color: savingsPage >= Math.ceil(savingsData.count / SAVINGS_PER_PAGE) ? 'rgba(255,255,255,0.3)' : 'white',
                    padding: '2px 8px',
                    cursor: savingsPage >= Math.ceil(savingsData.count / SAVINGS_PER_PAGE) ? 'default' : 'pointer',
                    fontFamily: 'System, monospace',
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
