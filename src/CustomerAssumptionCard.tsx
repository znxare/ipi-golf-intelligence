import { calculateCommercialView } from './calc/commercial'
import { derivePotentialPlayersPerDay } from './calc/qualify'
import { Card, PotentialActualRow } from './components/ui'
import type { QualifyInput, QuantifyInput } from './calc/types'
import { formatNumber, formatRupees, formatRupeesCompact } from './format'

/**
 * Shared with Commercial View and Verify — "Results Generated From Customer
 * Inputs": the Potential/Actual KPI table. The Qualify/Quantify IPI
 * Opportunity waterfall (Revenue − Salary − Water) that used to sit below
 * this lives in IpiOpportunityWaterfall now — shown on the Commercial Layer
 * and the Dashboard, not repeated here in Verify.
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
          label="Revenue / Day"
          potential={formatRupees(commercial.potentialRevenuePerDay)}
          actual={quantifyInput ? formatRupees(commercial.actualRevenuePerDay) : '—'}
        />
        <PotentialActualRow
          label="Break-even Players / Day"
          potential={formatNumber(commercial.breakEvenPlayersPerDay)}
          actual={formatNumber(commercial.breakEvenPlayersPerDay)}
        />
        <PotentialActualRow
          label="Gap to Break-even"
          potential={`${formatNumber(commercial.gapToBreakEvenPlayersPotential)}/day`}
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
    </div>
  )
}
