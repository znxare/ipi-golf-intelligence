import { useEffect, useState } from 'react'
import { calculateCommercialView } from './calc/commercial'
import { PageHeader } from './components/ui'
import type { Assessment } from './domain/assessment'
import { OpportunityWaterfallBox } from './IpiOpportunityWaterfall'
import { assessmentStore } from './store/assessmentStore'

interface OpportunityTotals {
  revenue: number
  operatingCost: number
  salaryCost: number
  waterCost: number
  total: number
}

function zeroTotals(): OpportunityTotals {
  return { revenue: 0, operatingCost: 0, salaryCost: 0, waterCost: 0, total: 0 }
}

/**
 * Portfolio rollup, above the Transaction list — the same Qualify Potential /
 * Quantify Actual IPI Opportunity waterfall from the Commercial Layer, but
 * summed across every saved assessment instead of one deal at a time.
 */
export function Dashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    assessmentStore.list().then(setAssessments)
  }, [])

  const potential = zeroTotals()
  const actual = zeroTotals()
  let quantifiedCount = 0

  for (const a of assessments) {
    const commercial = calculateCommercialView(a.qualifyInput, {
      actualPlayersPerDay: a.quantifyInput?.actualPlayersPerDay ?? 0,
      actualGolfSpendPerMonth: a.quantifyInput?.golfSpendPerMonth ?? 0,
      actualSalariesPerMonth: a.quantifyInput?.salariesPerMonth ?? 0,
      actualWaterPerMonth: a.quantifyInput?.waterPerMonth ?? 0,
    })

    potential.revenue += commercial.revenueSpendPotentialAnnual
    potential.operatingCost += commercial.estimatedOperatingCostAnnual
    potential.salaryCost += commercial.annualSalaryCost
    potential.waterCost += commercial.annualWaterCost
    potential.total += commercial.ipiOpportunityPotentialAnnual

    if (a.quantifyInput) {
      quantifiedCount += 1
      actual.revenue += commercial.revenueSpendActualAnnual
      actual.operatingCost += commercial.actualOperatingCostAnnual
      actual.salaryCost += commercial.actualSalaryCostAnnual
      actual.waterCost += commercial.actualWaterCostAnnual
      actual.total += commercial.ipiOpportunityActualAnnual
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Portfolio Summary" title="Dashboard" />

      {assessments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-hairline p-10 text-center">
          <div className="text-sm font-medium text-ink">No transactions yet</div>
          <div className="mt-1 text-sm text-ipi-700/60">
            Add a golf course under Transaction to start seeing portfolio numbers here.
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3 text-xs text-ipi-700/50">
            Combined across {assessments.length} transaction{assessments.length === 1 ? '' : 's'}
            {quantifiedCount > 0 && ` (${quantifiedCount} with Quantify data)`}.
          </div>
          <div className="grid grid-cols-2 gap-3">
            <OpportunityWaterfallBox
              title="Qualify — Potential IPI Opportunity"
              revenue={potential.revenue}
              operatingCost={potential.operatingCost}
              salaryCost={potential.salaryCost}
              waterCost={potential.waterCost}
              total={potential.total}
            />
            <OpportunityWaterfallBox
              title="Quantify — Actual IPI Opportunity"
              revenue={actual.revenue}
              operatingCost={actual.operatingCost}
              salaryCost={actual.salaryCost}
              waterCost={actual.waterCost}
              total={actual.total}
              empty={quantifiedCount === 0 ? 'No Quantify data yet across any transaction.' : undefined}
            />
          </div>
        </>
      )}
    </div>
  )
}
