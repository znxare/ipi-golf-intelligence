export function formatRupees(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`
}

/** Formats large rupee amounts in Lakh/Crore, matching the mockups (e.g. ₹1.4 Cr, ₹93,500). */
export function formatRupeesCompact(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')} Cr`
  if (abs >= 1_00_000) return `₹${(value / 1_00_000).toFixed(2).replace(/\.?0+$/, '')} L`
  return formatRupees(value)
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-IN')
}

/** Formats liter quantities in K/M, matching the mockups (e.g. 2.0M L, 500K L). */
export function formatLiters(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M L`
  if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}K L`
  return `${Math.round(value)} L`
}
