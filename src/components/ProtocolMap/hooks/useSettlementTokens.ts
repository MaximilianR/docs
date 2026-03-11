import { useState, useEffect } from 'react'

const SETTLEMENTS_API = 'https://prices.curve.finance/v1/dao/fees/settlements'
const ASSET_BASE = 'https://raw.githubusercontent.com/curvefi/curve-assets/main/images/assets'

// Well-known stablecoins by symbol prefix/match
const STABLECOIN_SYMBOLS = new Set([
  'USDC', 'USDT', 'DAI', 'FRAX', 'PYUSD', 'USDS', 'sUSDS', 'sDAI',
  'USDe', 'sUSDe', 'USDtb', 'RLUSD', 'fxUSD', 'frxUSD', 'reUSD',
  'BOLD', 'msUSD', 'crvUSD', 'scrvUSD',
])

export interface SettlementToken {
  symbol: string
  address: string
  iconUrl: string
  isStable: boolean
}

export interface SettlementData {
  stableTokens: SettlementToken[]
  volatileTokens: SettlementToken[]
  loading: boolean
}

// Shared state so multiple components can read without re-fetching
let cached: SettlementData | null = null

export function useSettlementTokens(): SettlementData {
  const [data, setData] = useState<SettlementData>(cached || { stableTokens: [], volatileTokens: [], loading: true })

  useEffect(() => {
    if (cached) return

    const now = Math.floor(Date.now() / 1000)
    fetch(`${SETTLEMENTS_API}?timestamp=${now}`)
      .then(r => r.json())
      .then(async resp => {
        const entries = resp?.data as { coin: { lp_token: boolean; symbol: string; address: string } }[] | undefined
        if (!entries) return

        // Deduplicate by address, skip LP tokens
        const seen = new Set<string>()
        const tokens: SettlementToken[] = []
        for (const entry of entries) {
          if (entry.coin.lp_token) continue
          const addr = entry.coin.address.toLowerCase()
          if (seen.has(addr)) continue
          seen.add(addr)
          tokens.push({
            symbol: entry.coin.symbol,
            address: addr,
            iconUrl: `${ASSET_BASE}/${addr}.png`,
            isStable: STABLECOIN_SYMBOLS.has(entry.coin.symbol),
          })
        }

        // Prevalidate icon URLs — only keep tokens whose image loads
        const validated = await Promise.all(
          tokens.map(t => new Promise<SettlementToken | null>(resolve => {
            const img = new Image()
            img.onload = () => resolve(t)
            img.onerror = () => resolve(null)
            img.src = t.iconUrl
          }))
        )
        const valid = validated.filter((t): t is SettlementToken => t !== null)

        const result: SettlementData = {
          stableTokens: valid.filter(t => t.isStable),
          volatileTokens: valid.filter(t => !t.isStable),
          loading: false,
        }
        cached = result
        setData(result)
      })
      .catch(() => {
        const result: SettlementData = { stableTokens: [], volatileTokens: [], loading: false }
        cached = result
        setData(result)
      })
  }, [])

  return data
}
