import { calculateSelectedGolfCartTotal, deriveSelectedGolfCartBrand, deriveVerifiedQty } from '../calc/commercial'
import type { EquipmentVerificationLine } from '../calc/types'
import { GOLF_CART_CATALOG } from '../data/golfCartCatalog'
import { formatRupees, formatRupeesCompact } from '../format'

/**
 * Pricing detail for what's checked off in the Golf Cart Template, revealed
 * by clicking the Golf Cart stat in the IPI Opportunity Breakdown. Only
 * shows lines matching the active brand — same scope as the priced total.
 */
export function SelectedGolfCartDetail({ lines }: { lines: Record<string, EquipmentVerificationLine> }) {
  const selectedBrand = deriveSelectedGolfCartBrand(GOLF_CART_CATALOG, lines)
  const selected = GOLF_CART_CATALOG.filter((item) => item.brand === selectedBrand)
    .map((item) => ({ item, qty: deriveVerifiedQty(item, lines[item.id]) }))
    .filter(({ qty }) => qty > 0)
  const { pricedTotal } = calculateSelectedGolfCartTotal(GOLF_CART_CATALOG, lines)

  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
      <div className="border-b border-hairline bg-ipi-50/60 px-4 py-3">
        <div className="text-sm font-medium text-ink">Selected Golf Carts</div>
        <div className="mt-0.5 text-xs text-ipi-700/60">Priced from what's checked off in the Golf Cart Template above</div>
      </div>

      {selected.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-ipi-700/50">No golf carts selected yet.</div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs text-ipi-700/60">
              <th className="px-4 py-2 font-medium">Equipment</th>
              <th className="px-4 py-2 text-right font-medium">Qty</th>
              <th className="px-4 py-2 text-right font-medium">Unit Price</th>
              <th className="px-4 py-2 text-right font-medium">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {selected.map(({ item, qty }) => (
              <tr key={item.id} className="border-t border-hairline">
                <td className="px-4 py-2 text-ink">{item.equipment}</td>
                <td className="font-data px-4 py-2 text-right tabular-nums text-ink">{qty}</td>
                <td className="font-data px-4 py-2 text-right tabular-nums text-ipi-700/70">
                  {formatRupees(item.priceINR)}
                </td>
                <td className="font-data px-4 py-2 text-right font-medium tabular-nums text-ink">
                  {formatRupees(item.priceINR * qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center justify-between border-t border-hairline bg-ipi-50/60 px-4 py-2.5 text-sm">
        <span className="text-ipi-700/70">Total</span>
        <span className="font-data font-medium tabular-nums text-ink">{formatRupeesCompact(pricedTotal)}</span>
      </div>
    </div>
  )
}
