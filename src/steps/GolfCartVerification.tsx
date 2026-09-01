import { deriveActiveGolfCartBrands, isGolfCartItemEnabled } from '../calc/commercial'
import type { EquipmentVerificationLine } from '../calc/types'
import { GOLF_CART_CATALOG } from '../data/golfCartCatalog'
import { formatRupees } from '../format'

const BRAND_LABEL = { elite: 'an Elite', yamaha: 'a Yamaha' } as const

export function GolfCartVerification({
  lines,
  onChange,
}: {
  lines: Record<string, EquipmentVerificationLine>
  onChange: (lines: Record<string, EquipmentVerificationLine>) => void
}) {
  const activeBrands = deriveActiveGolfCartBrands(GOLF_CART_CATALOG, lines)

  function lineFor(id: string): EquipmentVerificationLine {
    return lines[id] ?? { confirmed: false, sowQty: '' }
  }

  function updateLine(id: string, patch: Partial<EquipmentVerificationLine>) {
    onChange({ ...lines, [id]: { ...lineFor(id), ...patch } })
  }

  return (
    <div className="mb-5 rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
      <div className="border-b border-hairline bg-ipi-50/60 px-4 py-3">
        <div className="text-sm font-medium text-ink">Golf Cart Template</div>
        <div className="mt-0.5 text-xs text-ipi-700/60">
          Golf car range and accessories, Ex-Bangalore pricing — check off each line if the template quantity holds,
          otherwise write the SOW qty beside it
        </div>
      </div>

      <div className="max-h-[480px] overflow-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--color-hairline)]">
            <tr className="text-left text-xs text-ipi-700/60">
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Equipment</th>
              <th className="px-4 py-2 font-medium">Model / Ref</th>
              <th className="px-4 py-2 font-medium">Description</th>
              <th className="px-4 py-2 text-right font-medium">Price (₹)</th>
              <th className="px-4 py-2 text-right font-medium">Template Qty</th>
              <th className="w-12 px-4 py-2 text-center font-medium">✓</th>
              <th className="px-4 py-2 text-right font-medium">SOW Qty</th>
            </tr>
          </thead>
          <tbody>
            {GOLF_CART_CATALOG.map((item) => {
              const line = lineFor(item.id)
              const enabled = isGolfCartItemEnabled(item, activeBrands)
              const disabledReason = enabled ? undefined : `Select ${BRAND_LABEL[item.brand]} golf car first`
              return (
                <tr
                  key={item.id}
                  className={`border-b border-hairline last:border-b-0 ${enabled ? '' : 'opacity-40'}`}
                  title={disabledReason}
                >
                  <td className="px-4 py-2 text-xs text-ipi-700/60">{item.category}</td>
                  <td className="px-4 py-2 text-ink">
                    {item.imageFile && (
                      <img
                        src={`${import.meta.env.BASE_URL}golf-carts/${item.imageFile}`}
                        alt={item.equipment}
                        className="mb-1 h-12 w-auto object-contain"
                      />
                    )}
                    <div>{item.equipment}</div>
                  </td>
                  <td className="font-data px-4 py-2 text-xs tabular-nums text-ipi-700/70">{item.model}</td>
                  <td className="max-w-[220px] px-4 py-2 text-xs text-ipi-700/60" title={item.description}>
                    {item.description}
                  </td>
                  <td className="font-data px-4 py-2 text-right tabular-nums text-ink">
                    {formatRupees(item.priceINR)}
                  </td>
                  <td className="font-data px-4 py-2 text-right font-medium tabular-nums text-ink">
                    {item.templateQtyLabel}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={line.confirmed}
                      disabled={!enabled}
                      onChange={(e) => updateLine(item.id, { confirmed: e.target.checked })}
                      className="h-4 w-4 accent-[var(--color-ipi-600)] disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {line.confirmed ? (
                      <span className="font-data tabular-nums text-ipi-700/50">{item.templateQtyLabel}</span>
                    ) : (
                      <input
                        type="text"
                        value={line.sowQty}
                        disabled={!enabled}
                        onChange={(e) => updateLine(item.id, { sowQty: e.target.value })}
                        placeholder="___"
                        className="font-data w-20 rounded-md border border-hairline px-2 py-1 text-right tabular-nums outline-none transition-colors placeholder:text-ipi-700/30 focus:border-ipi-600 disabled:cursor-not-allowed disabled:bg-ipi-50/60"
                      />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline bg-ipi-50/60 px-4 py-2 text-xs text-ipi-700/60">
        <span>Ex-Bangalore pricing, converted from IPI's Elite and Yamaha DR2E price lists</span>
        <span>
          {activeBrands.size === 0
            ? 'Select a golf car to unlock its accessories'
            : `${[...activeBrands].map((b) => (b === 'elite' ? 'Elite' : 'Yamaha')).join(' + ')} unlocked`}
        </span>
      </div>
    </div>
  )
}
