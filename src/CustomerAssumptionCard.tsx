import { calculateCommercialView } from './calc/commercial'
import { derivePotentialPlayersPerDay } from './calc/qualify'
import { Card, PotentialActualRow } from './components/ui'
import type { QualifyInput, QuantifyInput } from './calc/types'
import { formatNumber, formatRupees, formatRupeesCompact } from './format'

function WaterfallLine({ label, value, isTotal = false }: { label: string; value: string; isTotal?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between py-1 text-xs ${
        isTotal ? 'mt-1 border-t border-hairline pt-1.5 font-medium text-ipi-900' : 'text-ipi-700/70'
      }`}
    >
      <span>{label}</span>
      <span className="font-data tabular-nums">{value}</span>
    </div>
  )
}

/**
 * Shared with Commercial View — "Results Generated From Customer Inputs":
 * the Potential/Actual KPI table plus the Revenue − Salary − Water waterfall
 * that arrives at IPI Opportunity. One calc engine (calculateCommercialView),
 * two places it's shown.
 */
export function CustomerAssumptionCard({
  qualifyInput,
  quantifyInput,
}: {
  qualifyInput: QualifyInput
  quantifyInput?: QuantifyInput
}) {
  const commercial = calculateCommercialView(qualifyInput, {
    actualPlayersPerDay: quantifyInput?.actualPlayersPerDay ?? 0,
    actualGolfSpendPerMonth: quantifyInput?.golfSpendPerMonth ?? 0,
    actualSalariesPerMonth: quantifyInput?.salariesPerMonth ?? 0,
    actualWaterPerMonth: quantifyInput?.waterPerMonth ?? 0,
  })

  return (
    <div>
      <Card className="mb-3">
        <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-4 text-xs text-ipi-700/50">
          <span />
          <span className="w-28 text-right">Potential</span>
          <span className="w-28 text-right">Actual</span>
        </div>
        <PotentialActualRow
          label="Players / Day"
          potential={formatNumber(derivePotentialPlayersPerDay(qualifyInput.playableHoursPerDay))}
          actual={quantifyInput ? formatNumber(quantifyInput.actualPlayersPerDay) : '—'}
        />
        <PotentialActualRow
          label="Annual Players"
          potential={formatNumber(commercial.annualPlayersPotential)}
          actual={quantifyInput ? formatNumber(commercial.annualPlayersActual) : '—'}
        />
        <PotentialActualRow
          label="Avg Green Fee"
          potential={formatRupees(qualifyInput.pricePerRound)}
          actual={formatRupees(qualifyInput.pricePerRound)}
        />
        <PotentialActualRow
          label="Actual Revenue / Day"
          potential="—"
          actual={quantifyInput ? formatRupees(commercial.actualRevenuePerDay) : '—'}
        />
        <PotentialActualRow label="Break-even Players / Day" potential="—" actual={formatNumber(commercial.breakEvenPlayersPerDay)} />
        <PotentialActualRow
          label="Gap to Break-even"
          potential="—"
          actual={quantifyInput ? `${formatNumber(commercial.gapToBreakEvenPlayers)}/day` : '—'}
        />
        <PotentialActualRow
          label="Revenue / Customer Spend"
          potential={`${formatRupeesCompact(commercial.revenueSpendPotentialAnnual)}/yr`}
          actual={quantifyInput ? `${formatRupeesCompact(commercial.revenueSpendActualAnnual)}/yr` : '—'}
        />
        <PotentialActualRow
          label="Annual Operating Cost"
          potential={formatRupeesCompact(commercial.estimatedOperatingCostAnnual)}
          actual={quantifyInput ? formatRupeesCompact(commercial.actualOperatingCostAnnual) : '—'}
        />
        <PotentialActualRow
          label="Annual Salary Cost"
          potential={formatRupeesCompact(commercial.annualSalaryCost)}
          actual={quantifyInput ? formatRupeesCompact(commercial.actualSalaryCostAnnual) : '—'}
        />
        <PotentialActualRow
          label="Annual Water Cost"
          potential={formatRupeesCompact(commercial.annualWaterCost)}
          actual={quantifyInput ? formatRupeesCompact(commercial.actualWaterCostAnnual) : '—'}
        />
        <PotentialActualRow
          label="Total Cost of Operations"
          potential={formatRupeesCompact(commercial.totalCostOfOperations)}
          actual={quantifyInput ? formatRupeesCompact(commercial.totalCostOfOperationsActual) : '—'}
        />
        <PotentialActualRow
          label="IPI Opportunity / Year"
          potential={formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)}
          actual={quantifyInput ? formatRupeesCompact(commercial.ipiOpportunityActualAnnual) : '—'}
        />
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-hairline bg-ipi-50/60 px-4 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Qualify — Potential IPI Opportunity
          </div>
          <WaterfallLine label="Revenue / Customer Spend" value={formatRupeesCompact(commercial.revenueSpendPotentialAnnual)} />
          <WaterfallLine label="− Annual Operating Cost" value={formatRupeesCompact(commercial.estimatedOperatingCostAnnual)} />
          <WaterfallLine label="− Annual Salary Cost" value={formatRupeesCompact(commercial.annualSalaryCost)} />
          <WaterfallLine label="− Annual Water Cost" value={formatRupeesCompact(commercial.annualWaterCost)} />
          <WaterfallLine label="= IPI Opportunity / Year" value={formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)} isTotal />
        </div>
        <div className="rounded-xl border border-hairline bg-ipi-50/60 px-4 py-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Quantify — Actual IPI Opportunity
          </div>
          {quantifyInput ? (
            <>
              <WaterfallLine label="Revenue / Customer Spend" value={formatRupeesCompact(commercial.revenueSpendActualAnnual)} />
              <WaterfallLine label="− Annual Operating Cost" value={formatRupeesCompact(commercial.actualOperatingCostAnnual)} />
              <WaterfallLine label="− Annual Salary Cost" value={formatRupeesCompact(commercial.actualSalaryCostAnnual)} />
              <WaterfallLine label="− Annual Water Cost" value={formatRupeesCompact(commercial.actualWaterCostAnnual)} />
              <WaterfallLine label="= IPI Opportunity / Year" value={formatRupeesCompact(commercial.ipiOpportunityActualAnnual)} isTotal />
            </>
          ) : (
            <div className="py-1 text-xs text-ipi-700/50">No Quantify data yet — New Build has no current operation.</div>
          )}
        </div>
      </div>
    </div>
  )
}
