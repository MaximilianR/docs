export function formatNumber(value: number | null | undefined, sigFigures = 3): string {
  if (value == null || isNaN(value)) return '—'
  if (value === 0) return '0'

  const abs = Math.abs(value)
  if (abs >= 1e9) return (value / 1e9).toPrecision(sigFigures) + 'B'
  if (abs >= 1e6) return (value / 1e6).toPrecision(sigFigures) + 'M'
  if (abs >= 1e3) return (value / 1e3).toPrecision(sigFigures) + 'k'
  if (abs >= 1) return value.toPrecision(sigFigures)
  return value.toPrecision(sigFigures)
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return '—'
  return (value * 100).toFixed(2) + '%'
}
