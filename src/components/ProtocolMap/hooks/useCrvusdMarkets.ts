import { useState, useEffect } from 'react'

const MARKETS_API = 'https://prices.curve.finance/v1/crvusd/markets'
const PEGKEEPERS_API = 'https://prices.curve.finance/v1/crvusd/pegkeepers/ethereum'

export interface CrvusdMarket {
  address: string
  collateral_token: { symbol: string; address: string }
  total_debt: number
  total_debt_usd: number
  n_loans: number
  rate: number
  borrow_apy: number
  collateral_amount: number
  collateral_amount_usd: number
  debt_ceiling: number
}

export interface PegKeeper {
  address: string
  pool: string
  pool_address: string
  pair: { symbol: string; address: string }[]
  active: boolean
  total_debt: number
  total_profit: number
}

export interface CrvusdData {
  markets: CrvusdMarket[]
  pegkeepers: PegKeeper[]
  loading: boolean
}

export function useCrvusdMarkets(): CrvusdData {
  const [data, setData] = useState<CrvusdData>({ markets: [], pegkeepers: [], loading: true })

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const [marketsRes, pkRes] = await Promise.all([
          fetch(MARKETS_API),
          fetch(PEGKEEPERS_API),
        ])
        const marketsJson = await marketsRes.json()
        const pkJson = await pkRes.json()

        if (cancelled) return

        const marketsArray = marketsJson?.chains?.ethereum?.data || marketsJson?.data || []
        const markets: CrvusdMarket[] = marketsArray.map((m: any) => ({
          address: m.address,
          collateral_token: m.collateral_token,
          total_debt: m.total_debt,
          total_debt_usd: m.total_debt_usd,
          n_loans: m.n_loans,
          rate: m.rate,
          borrow_apy: m.borrow_apy,
          collateral_amount: m.collateral_amount,
          collateral_amount_usd: m.collateral_amount_usd,
          debt_ceiling: m.debt_ceiling,
        }))

        const pegkeepers: PegKeeper[] = (pkJson.keepers || [])
          .filter((pk: any) => pk.active)
          .map((pk: any) => ({
            address: pk.address,
            pool: pk.pool,
            pool_address: pk.pool_address,
            pair: pk.pair,
            active: pk.active,
            total_debt: pk.total_debt,
            total_profit: pk.total_profit,
          }))

        setData({ markets, pegkeepers, loading: false })
      } catch {
        if (!cancelled) setData({ markets: [], pegkeepers: [], loading: false })
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  return data
}
