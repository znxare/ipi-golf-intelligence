import { EQUIPMENT_CATALOG } from './data/equipmentCatalog'
import type { Assessment, NegotiationLine } from './domain/assessment'
import { formatRupeesCompact } from './format'

function money(value: number | null): string {
  return value === null ? 'TBD' : formatRupeesCompact(value)
}

export function NegotiationTable({
  assessment,
  onChange,
}: {
  assessment: Assessment
  onChange: (negotiation: Record<string, NegotiationLine>) => void
}) {
  const negotiation = assessment.negotiation ?? {}

  function lineFor(id: string): NegotiationLine {
    return negotiation[id] ?? { negotiatedQty: 0, notes: '' }
  }

  function updateLine(id: string, patch: Partial<NegotiationLine>) {
    onChange({ ...negotiation, [id]: { ...lineFor(id), ...patch } })
  }

  let draftTotal = 0
  let negotiatedTotal = 0
  let gapTotal = 0
  let hasUnpriced = false

  return (
    <div>
      <div className="mb-3 text-xs text-ipi-700/60">
        The verified SOW is never overwritten — only Negotiated Qty and Notes are entered here. Negotiated Value
        is calculated automatically.
      </div>

      <div className="max-h-[600px] overflow-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_var(--color-hairline)]">
            <tr className="text-left text-xs text-ipi-700/60">
              <th className="px-3 py-2 font-medium">SOW Equipment</th>
              <th className="px-3 py-2 text-right font-medium">SOW Qty</th>
              <th className="px-3 py-2 text-right font-medium">Unit Price</th>
              <th className="px-3 py-2 text-right font-medium">Draft SOW Value</th>
              <th className="px-3 py-2 text-right font-medium">Negotiated Qty</th>
              <th className="px-3 py-2 text-right font-medium">Negotiated Value</th>
              <th className="px-3 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT_CATALOG.map((item) => {
              const line = lineFor(item.id)
              const draftValue = item.unitPriceINR === null ? null : item.unitPriceINR * item.sowQtyNumeric
              const negotiatedValue =
                item.unitPriceINR === null ? null : item.unitPriceINR * line.negotiatedQty
              const gapValue =
                item.unitPriceINR === null
                  ? null
                  : item.unitPriceINR * Math.max(item.sowQtyNumeric - line.negotiatedQty, 0)

              if (draftValue === null) hasUnpriced = true
              else draftTotal += draftValue
              if (negotiatedValue !== null) negotiatedTotal += negotiatedValue
              if (gapValue !== null) gapTotal += gapValue

              const isNegotiated = line.negotiatedQty > 0

              return (
                <tr
                  key={item.id}
                  className={`border-b border-hairline last:border-b-0 ${isNegotiated ? 'bg-ipi-50/60' : ''}`}
                >
                  <td className="px-3 py-2 text-ink">{item.equipment}</td>
                  <td className="font-data px-3 py-2 text-right tabular-nums text-ipi-700/80">
                    {item.sowQtyLabel}
                  </td>
                  <td className="font-data px-3 py-2 text-right tabular-nums text-ipi-700/80">
                    {item.unitPriceINR === null ? (
                      <span className="text-amber-600">TBD</span>
                    ) : (
                      money(item.unitPriceINR)
                    )}
                  </td>
                  <td className="font-data px-3 py-2 text-right font-medium tabular-nums text-ink">
                    {draftValue === null ? <span className="text-amber-600">TBD</span> : money(draftValue)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      type="number"
                      min={0}
                      max={item.sowQtyNumeric}
                      value={line.negotiatedQty}
                      onChange={(e) =>
                        updateLine(item.id, {
                          negotiatedQty: Math.max(
                            0,
                            Math.min(item.sowQtyNumeric, e.target.valueAsNumber || 0),
                          ),
                        })
                      }
                      className="font-data w-16 rounded-md border border-hairline px-1.5 py-1 text-right tabular-nums outline-none transition-colors focus:border-ipi-600"
                    />
                  </td>
                  <td className="font-data px-3 py-2 text-right font-medium tabular-nums text-ipi-900">
                    {negotiatedValue === null ? (
                      <span className="text-amber-600">TBD</span>
                    ) : (
                      money(negotiatedValue)
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={line.notes}
                      onChange={(e) => updateLine(item.id, { notes: e.target.value })}
                      placeholder="—"
                      className="w-full rounded-md border border-hairline px-1.5 py-1 text-xs outline-none placeholder:text-ipi-700/30 transition-colors focus:border-ipi-600"
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-hairline bg-ipi-50 text-sm font-medium text-ink">
              <td className="px-3 py-2" colSpan={3}>
                TOTAL
              </td>
              <td className="font-data px-3 py-2 text-right tabular-nums">
                {formatRupeesCompact(draftTotal)}
                {hasUnpriced ? ' + TBD' : ''}
              </td>
              <td className="px-3 py-2" />
              <td className="font-data px-3 py-2 text-right tabular-nums">
                {formatRupeesCompact(negotiatedTotal)}
                {hasUnpriced ? ' + TBD' : ''}
              </td>
              <td className="px-3 py-2" />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 rounded-xl border border-ipi-900 bg-ipi-100 px-4 py-3 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-ipi-700/70">Original Verified SOW − Negotiated SOW</span>
          <span className="font-data font-semibold tabular-nums text-ipi-900">
            = {formatRupeesCompact(gapTotal)}
            {hasUnpriced ? ' + TBD' : ''} remaining gap / future opportunity
          </span>
        </div>
      </div>
    </div>
  )
}
