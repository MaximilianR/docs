import { useState, useEffect } from 'react'

const GAUGES_API = 'https://prices.curve.finance/v1/dao/gauges/overview'

export interface GaugeWeight {
  address: string
  name: string
  gauge_type: string
  pool_name: string | null
  chain: string | null
  emissions: number
  gauge_relative_weight: number
  is_killed: boolean
}

export interface GaugeWeightsData {
  gauges: GaugeWeight[]
  loading: boolean
}

export function useGaugeWeights(): GaugeWeightsData {
  const [data, setData] = useState<GaugeWeightsData>({ gauges: [], loading: true })

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      try {
        const res = await fetch(GAUGES_API)
        const json = await res.json()

        if (cancelled) return

        const gauges: GaugeWeight[] = (json.gauges || [])
          .filter((g: any) => !g.is_killed && g.gauge_relative_weight > 0)
          .sort((a: any, b: any) => b.gauge_relative_weight - a.gauge_relative_weight)
          .slice(0, 5)
          .map((g: any) => ({
            address: g.address,
            name: g.name,
            gauge_type: g.gauge_type,
            pool_name: g.pool?.name || g.name,
            chain: g.pool?.chain || null,
            emissions: g.emissions,
            gauge_relative_weight: g.gauge_relative_weight,
            is_killed: g.is_killed,
          }))

        setData({ gauges, loading: false })
      } catch {
        if (!cancelled) setData({ gauges: [], loading: false })
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [])

  return data
}
