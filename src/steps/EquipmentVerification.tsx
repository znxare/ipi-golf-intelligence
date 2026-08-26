import { deriveEquipmentPriceINR } from '../calc/pricing'
import type { EquipmentVerificationLine } from '../calc/types'
import { EQUIPMENT_CATALOG } from '../data/equipmentCatalog'
import { formatRupees } from '../format'
import { useUsdInrRate } from '../hooks/useUsdInrRate'

export function EquipmentVerification({
  lines,
  onChange,
}: {
  lines: Record<string, EquipmentVerificationLine>
  onChange: (lines: Record<string, EquipmentVerificationLine>) => void
}) {
  const { rate, isLive, loading } = useUsdInrRate()

  function updateQty(id: string, qty: string) {
    onChange({ ...lines, [id]: { qty } })
  }

  return (
    <div className="mb-5 rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
      <div className="border-b border-hairline bg-ipi-50/60 px-4 py-3">
        <div className="text-sm font-medium text-ink">Equipment Template</div>
        <div className="mt-0.5 text-xs text-ipi-700/60">
          Toro 2026 commercial MSRP, converted to INR — enter the qty needed for this SOW
        </div>
      </div>

      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--color-hairline)]">
            <tr className="text-left text-xs text-ipi-700/60">
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Equipment</th>
              <th className="px-4 py-2 font-medium">Model / Ref</th>
              <th className="px-4 py-2 font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium">Price (₹)</th>
              <th className="w-20 px-4 py-2 text-right font-medium">Qty</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT_CATALOG.map((item) => {
              const qtyValue = lines[item.id]?.qty ?? ''
              return (
                <tr key={item.id} className="border-b border-hairline last:border-b-0">
                  <td className="px-4 py-2 text-xs text-ipi-700/60">{item.category}</td>
                  <td className="px-4 py-2 text-ink">{item.equipment}</td>
                  <td className="font-data px-4 py-2 text-xs tabular-nums text-ipi-700/70">{item.model}</td>
                  <td className="max-w-[240px] px-4 py-2 text-xs text-ipi-700/60" title={item.description}>
                    {item.description}
                  </td>
                  <td className="font-data px-4 py-2 text-right tabular-nums text-ink">
                    {item.usdMsrp === null ? (
                      <span className="text-amber-600">Contact IPI</span>
                    ) : (
                      formatRupees(deriveEquipmentPriceINR(item.usdMsrp, rate))
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="text"
                      value={qtyValue}
                      onChange={(e) => updateQty(item.id, e.target.value)}
                      placeholder="0"
                      className="font-data w-16 rounded-md border border-hairline px-2 py-1 text-right tabular-nums outline-none transition-colors placeholder:text-ipi-700/30 focus:border-ipi-600"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline bg-ipi-50/60 px-4 py-2 text-xs text-ipi-700/60">
        <span>Formula: 2026 MSRP (USD) × 1.4 × USD→INR</span>
        <span>
          {loading ? 'Fetching live rate…' : `1 USD ≈ ${formatRupees(rate)} `}
          {!loading && (isLive ? '(live)' : '(fallback — live rate unavailable)')}
        </span>
      </div>
    </div>
  )
}
