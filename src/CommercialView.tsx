import { calculateCommercialView, calculateDraftSowTotal } from './calc/commercial'
import { Card, IntelRow, PotentialActualRow, SectionLabel } from './components/ui'
import { EQUIPMENT_CATALOG } from './data/equipmentCatalog'
import type { Assessment } from './domain/assessment'
import { formatLiters, formatNumber, formatRupees, formatRupeesCompact } from './format'

const CUSTOMER_TYPE_LABEL: Record<string, string> = {
  existing: 'Existing IPI',
  non_existing: 'Non-Existing',
  new_build: 'New Build',
}

export function CommercialView({ assessment }: { assessment: Assessment }) {
  const { qualifyInput } = assessment
  const commercial = calculateCommercialView(qualifyInput)
  const { pricedTotal, hasUnpriced } = calculateDraftSowTotal(EQUIPMENT_CATALOG)

  return (
    <div>
      <div className="mb-5 rounded-xl border border-ipi-900 bg-ipi-100 px-4 py-3">
        <div className="text-xs text-ipi-700/70">Pre-Negotiation Intelligence</div>
        <div className="text-sm font-medium text-ipi-900">
          Customer / Course Code: {qualifyInput.courseCode || '—'}
        </div>
      </div>

      <SectionLabel>1. Customer &amp; Course</SectionLabel>
      <Card className="mb-5">
        <IntelRow label="Customer / Course Code" value={qualifyInput.courseCode || '—'} />
        <IntelRow label="Customer Type" value={CUSTOMER_TYPE_LABEL[qualifyInput.customerType]} />
        <IntelRow label="Location / Google Maps" value={qualifyInput.location || '—'} />
        <IntelRow label="Playable Days" value={formatNumber(qualifyInput.daysOpenPerYear)} />
        <IntelRow label="Equipment Downtime Target" value="≤ 24 hrs" />
      </Card>

      <SectionLabel>2. Customer Team</SectionLabel>
      <Card className="mb-5">
        <IntelRow label="Superintendent" value={qualifyInput.superintendent || '—'} />
        <IntelRow label="Director / Head of Operations" value={qualifyInput.directorOfOperations || '—'} />
        <IntelRow label="Procurement Head / Equivalent" value={qualifyInput.procurementHead || '—'} />
        <IntelRow label="Key Decision Maker" value={qualifyInput.keyDecisionMaker || '—'} />
        <IntelRow label="IPI Account / Sales Owner" value={qualifyInput.ipiAccountOwner || '—'} />
      </Card>

      <SectionLabel>3. Playing &amp; Revenue Intelligence</SectionLabel>
      <Card className="mb-5">
        <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-4 text-xs text-ipi-700/50">
          <span />
          <span className="w-28 text-right">Potential</span>
          <span className="w-28 text-right">Actual</span>
        </div>
        <PotentialActualRow
          label="Players / Day"
          potential={formatNumber(qualifyInput.potentialPlayersPerDay)}
          actual={formatNumber(qualifyInput.actualPlayersPerDay)}
        />
        <PotentialActualRow
          label="Annual Players"
          potential={formatNumber(commercial.annualPlayersPotential)}
          actual={formatNumber(commercial.annualPlayersActual)}
        />
        <PotentialActualRow
          label="Green Fee"
          potential={formatRupees(qualifyInput.pricePerRound)}
          actual={formatRupees(qualifyInput.pricePerRound)}
        />
        <PotentialActualRow label="Actual Revenue / Day" potential="—" actual={formatRupees(commercial.actualRevenuePerDay)} />
        <PotentialActualRow label="Break-even Players / Day" potential="—" actual={formatNumber(commercial.breakEvenPlayersPerDay)} />
        <PotentialActualRow
          label="Gap to Break-even"
          potential="—"
          actual={`${formatNumber(commercial.gapToBreakEvenPlayers)}/day`}
        />
      </Card>

      <SectionLabel>4. Commercial Intelligence</SectionLabel>
      <Card className="mb-5">
        <div className="mb-1 grid grid-cols-[1fr_auto_auto] gap-4 text-xs text-ipi-700/50">
          <span />
          <span className="w-28 text-right">Potential</span>
          <span className="w-28 text-right">Actual</span>
        </div>
        <PotentialActualRow
          label="Revenue / Customer Spend"
          potential={`${formatRupeesCompact(commercial.revenueSpendPotentialAnnual)}/year`}
          actual={`${formatRupeesCompact(commercial.revenueSpendActualAnnual)}/year`}
        />
        <PotentialActualRow
          label="Annual Salary Cost"
          potential={formatRupeesCompact(commercial.annualSalaryCost)}
          actual={formatRupeesCompact(commercial.annualSalaryCost)}
        />
        <PotentialActualRow
          label="Annual Water Cost"
          potential={formatRupeesCompact(commercial.annualWaterCostPotential)}
          actual={formatRupeesCompact(commercial.annualWaterCostActual)}
        />
        <PotentialActualRow
          label="IPI Opportunity / Year"
          potential={formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)}
          actual={formatRupeesCompact(commercial.ipiOpportunityActualAnnual)}
        />
        <div className="mt-2 border-t border-ipi-100 pt-2 text-xs text-ipi-700/60">
          Water requirement: {formatLiters(qualifyInput.waterRequirementPotentialPerDay)}/day potential ·{' '}
          {formatLiters(qualifyInput.waterReserve)} reserve × {qualifyInput.refillsPerYear}/year actual
        </div>
      </Card>

      <SectionLabel>5. Commercial Position</SectionLabel>
      <Card className="mb-2 border-ipi-900 bg-ipi-100">
        <IntelRow label="Potential IPI Opportunity" value={`${formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)}/year`} />
        <IntelRow label="Actual IPI Opportunity" value={`${formatRupeesCompact(commercial.ipiOpportunityActualAnnual)}/year`} />
        <IntelRow label="IPI Equipment Requirement" value="Verified" />
        <IntelRow label="Playable-Day Objective" value={formatNumber(qualifyInput.daysOpenPerYear)} />
        <IntelRow label="Equipment Downtime Target" value="≤ 24 hrs" />
        <IntelRow label="Currently Priced Draft SOW" value={formatRupeesCompact(pricedTotal)} />
        <IntelRow label="Unpriced SOW" value={hasUnpriced ? 'TBD' : '—'} />
        <IntelRow
          label="Complete Draft SOW / Draft Invoice"
          value={hasUnpriced ? `${formatRupeesCompact(pricedTotal)} + TBD` : formatRupeesCompact(pricedTotal)}
        />
      </Card>
      <div className="mb-5 text-xs text-ipi-700/50">
        This is the intelligence available before entering customer negotiation.
      </div>
    </div>
  )
}
