import { calculateCommercialView, deriveVerifiedQty } from './calc/commercial'
import { deriveEquipmentPriceINR } from './calc/pricing'
import { BarStat, StatBar } from './components/ui'
import { EQUIPMENT_CATALOG } from './data/equipmentCatalog'
import type { Assessment, NegotiationLine } from './domain/assessment'
import { formatRupeesCompact } from './format'
import { useUsdInrRate } from './hooks/useUsdInrRate'

const ICON_PATHS = {
  potential: 'M12 4v16M9 8h4.5a2 2 0 1 1 0 4H10a2 2 0 1 0 0 4h5',
  draft: 'M7 3h7l4 4v14H7zM14 3v4h4',
  negotiated: 'M20 6 9 17l-5-5',
  future: 'M3 17l6-6 4 4 8-8M15 7h6v6',
}

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
  const quantifyInput = assessment.quantifyInput
  const equipmentVerification = quantifyInput?.equipmentVerification ?? {}
  const { rate: usdInrRate } = useUsdInrRate()

  function lineFor(id: string): NegotiationLine {
    return negotiation[id] ?? { negotiatedQty: 0, notes: '' }
  }

  function updateLine(id: string, patch: Partial<NegotiationLine>) {
    onChange({ ...negotiation, [id]: { ...lineFor(id), ...patch } })
  }

  const negotiationLines = EQUIPMENT_CATALOG.map((item) => {
    const verifiedQty = deriveVerifiedQty(item, equipmentVerification[item.id])
    const line = lineFor(item.id)
    const unitPrice = item.usdMsrp === null ? null : deriveEquipmentPriceINR(item.usdMsrp, usdInrRate)
    const draftValue = unitPrice === null ? null : unitPrice * verifiedQty
    const negotiatedValue = unitPrice === null ? null : unitPrice * line.negotiatedQty
    const gapValue = unitPrice === null ? null : unitPrice * Math.max(verifiedQty - line.negotiatedQty, 0)
    return { item, verifiedQty, line, unitPrice, draftValue, negotiatedValue, gapValue }
  }).filter(({ verifiedQty }) => verifiedQty > 0)

  const draftTotal = negotiationLines.reduce((sum, l) => sum + (l.draftValue ?? 0), 0)
  const negotiatedTotal = negotiationLines.reduce((sum, l) => sum + (l.negotiatedValue ?? 0), 0)
  const gapTotal = negotiationLines.reduce((sum, l) => sum + (l.gapValue ?? 0), 0)
  const hasUnpriced = negotiationLines.some((l) => l.unitPrice === null)

  const commercial = calculateCommercialView(assessment.qualifyInput, {
    actualPlayersPerDay: quantifyInput?.actualPlayersPerDay ?? 0,
    actualGolfSpendPerMonth: quantifyInput?.golfSpendPerMonth ?? 0,
    actualSalariesPerMonth: quantifyInput?.salariesPerMonth ?? 0,
    actualWaterPerMonth: quantifyInput?.waterPerMonth ?? 0,
  })

  return (
    <div>
      <StatBar title="Potential, Draft, Negotiated & Future Opportunity">
        <BarStat
          icon={ICON_PATHS.potential}
          label="Potential"
          value={formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)}
          sublabel="Annual · Qualify"
          first
        />
        <BarStat
          icon={ICON_PATHS.draft}
          label="Draft"
          value={hasUnpriced ? `${formatRupeesCompact(draftTotal)} + TBD` : formatRupeesCompact(draftTotal)}
          sublabel="Verified SOW"
        />
        <BarStat
          icon={ICON_PATHS.negotiated}
          label="Negotiated"
          value={hasUnpriced ? `${formatRupeesCompact(negotiatedTotal)} + TBD` : formatRupeesCompact(negotiatedTotal)}
          sublabel="Agreed so far"
        />
        <BarStat
          icon={ICON_PATHS.future}
          label="Future Opportunity"
          value={hasUnpriced ? `${formatRupeesCompact(gapTotal)} + TBD` : formatRupeesCompact(gapTotal)}
          sublabel="Draft − Negotiated"
          emphasis
        />
      </StatBar>

      <div className="mb-3 text-xs text-ipi-700/60">
        The verified SOW is never overwritten — only Negotiated Qty and Notes are entered here. Negotiated Value
        is calculated automatically.
      </div>

      {negotiationLines.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline p-10 text-center">
          <div className="text-sm font-medium text-ink">No verified equipment yet</div>
          <div className="mt-1 text-sm text-ipi-700/60">
            Go back to Quantify and enter a qty on the Equipment Template to negotiate against.
          </div>
        </div>
      ) : (
        <>
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
                {negotiationLines.map(({ item, verifiedQty, line, unitPrice, draftValue, negotiatedValue }) => {
                  const isNegotiated = line.negotiatedQty > 0

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-hairline last:border-b-0 ${isNegotiated ? 'bg-ipi-50/60' : ''}`}
                    >
                      <td className="px-3 py-2 text-ink">{item.equipment}</td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ipi-700/80">{verifiedQty}</td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ipi-700/80">
                        {unitPrice === null ? <span className="text-amber-600">TBD</span> : money(unitPrice)}
                      </td>
                      <td className="font-data px-3 py-2 text-right font-medium tabular-nums text-ink">
                        {draftValue === null ? <span className="text-amber-600">TBD</span> : money(draftValue)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <input
                          type="number"
                          min={0}
                          max={verifiedQty}
                          value={line.negotiatedQty}
                          onChange={(e) =>
                            updateLine(item.id, {
                              negotiatedQty: Math.max(0, Math.min(verifiedQty, e.target.valueAsNumber || 0)),
                            })
                          }
                          className="font-data w-16 rounded-md border border-hairline px-1.5 py-1 text-right tabular-nums outline-none transition-colors focus:border-ipi-600"
                        />
                      </td>
                      <td className="font-data px-3 py-2 text-right font-medium tabular-nums text-ipi-900">
                        {negotiatedValue === null ? <span className="text-amber-600">TBD</span> : money(negotiatedValue)}
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
        </>
      )}
    </div>
  )
}
