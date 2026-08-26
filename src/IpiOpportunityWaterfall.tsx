import { calculateCommercialView } from './calc/commercial'
import type { QualifyInput, QuantifyInput } from './calc/types'
import { formatRupeesCompact } from './format'

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

export function OpportunityWaterfallBox({
  title,
  revenue,
  operatingCost,
  salaryCost,
  waterCost,
  total,
  empty,
}: {
  title: string
  revenue: number
  operatingCost: number
  salaryCost: number
  waterCost: number
  total: number
  /** Shown instead of the waterfall lines when there's nothing to derive it from yet. */
  empty?: string
}) {
  return (
    <div className="rounded-xl border border-hairline bg-ipi-50/60 px-4 py-3">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">{title}</div>
      {empty ? (
        <div className="py-1 text-xs text-ipi-700/50">{empty}</div>
      ) : (
        <>
          <WaterfallLine label="Revenue / Customer Spend" value={formatRupeesCompact(revenue)} />
          <WaterfallLine label="− Annual Operating Cost" value={formatRupeesCompact(operatingCost)} />
          <WaterfallLine label="− Annual Salary Cost" value={formatRupeesCompact(salaryCost)} />
          <WaterfallLine label="− Annual Water Cost" value={formatRupeesCompact(waterCost)} />
          <WaterfallLine label="= IPI Opportunity / Year" value={formatRupeesCompact(total)} isTotal />
        </>
      )}
    </div>
  )
}

/**
 * The Qualify Potential / Quantify Actual IPI Opportunity waterfall, for a
 * single assessment. Used on the Commercial Layer and the Dashboard's
 * per-deal views — Verify shows the Customer Assumption Card's KPI table
 * only, not this.
 */
export function IpiOpportunityWaterfall({
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
    <div className="grid grid-cols-2 gap-3">
      <OpportunityWaterfallBox
        title="Qualify — Potential IPI Opportunity"
        revenue={commercial.revenueSpendPotentialAnnual}
        operatingCost={commercial.estimatedOperatingCostAnnual}
        salaryCost={commercial.annualSalaryCost}
        waterCost={commercial.annualWaterCost}
        total={commercial.ipiOpportunityPotentialAnnual}
      />
      <OpportunityWaterfallBox
        title="Quantify — Actual IPI Opportunity"
        revenue={commercial.revenueSpendActualAnnual}
        operatingCost={commercial.actualOperatingCostAnnual}
        salaryCost={commercial.actualSalaryCostAnnual}
        waterCost={commercial.actualWaterCostAnnual}
        total={commercial.ipiOpportunityActualAnnual}
        empty={quantifyInput ? undefined : 'No Quantify data yet — New Build has no current operation.'}
      />
    </div>
  )
}
