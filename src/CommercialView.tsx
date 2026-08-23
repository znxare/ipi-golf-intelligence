import type { ReactNode } from 'react'
import { calculateCommercialView, calculateDraftSowTotal } from './calc/commercial'
import { EQUIPMENT_DOWNTIME_TARGET, PLAYABLE_DAYS_PER_YEAR } from './calc/constants'
import { Card, IntelRow, StatCard } from './components/ui'
import { CustomerAssumptionCard } from './CustomerAssumptionCard'
import { EQUIPMENT_CATALOG } from './data/equipmentCatalog'
import type { Assessment } from './domain/assessment'
import { formatNumber, formatRupeesCompact } from './format'

const CUSTOMER_TYPE_LABEL: Record<string, string> = {
  existing: 'Existing IPI',
  non_existing: 'Non-Existing',
  new_build: 'New Build',
}

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-data flex h-5 w-5 items-center justify-center rounded-full bg-ipi-600 text-[11px] font-semibold text-white">
          {n}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">{title}</span>
      </div>
      {children}
    </div>
  )
}

export function CommercialView({ assessment }: { assessment: Assessment }) {
  const { qualifyInput, quantifyInput } = assessment
  const commercial = calculateCommercialView(qualifyInput, {
    actualPlayersPerDay: quantifyInput?.actualPlayersPerDay ?? 0,
    actualGolfSpendPerMonth: quantifyInput?.golfSpendPerMonth ?? 0,
    actualSalariesPerMonth: quantifyInput?.salariesPerMonth ?? 0,
    actualWaterPerMonth: quantifyInput?.waterPerMonth ?? 0,
  })
  const { pricedTotal, hasUnpriced } = calculateDraftSowTotal(EQUIPMENT_CATALOG)

  return (
    <div>
      <div className="mb-5 rounded-xl border border-ipi-900 bg-ipi-100 px-4 py-3">
        <div className="text-xs text-ipi-700/70">Pre-Negotiation Intelligence</div>
        <div className="font-data text-sm font-medium text-ipi-900">
          {qualifyInput.courseName || '—'}
        </div>
      </div>

      <Section n={1} title="Customer & Course">
        <Card>
          <IntelRow label="Course Name" value={qualifyInput.courseName || '—'} />
          <IntelRow label="Customer Type" value={CUSTOMER_TYPE_LABEL[qualifyInput.customerType]} />
          <IntelRow label="Location / Google Maps" value={qualifyInput.location || '—'} />
          <IntelRow label="Playable Days" value={formatNumber(PLAYABLE_DAYS_PER_YEAR)} mono />
          <IntelRow label="Equipment Downtime Target" value={EQUIPMENT_DOWNTIME_TARGET} mono />
        </Card>
      </Section>

      <Section n={2} title="Customer Team">
        <Card>
          <IntelRow label="Superintendent" value={qualifyInput.superintendent || '—'} />
          <IntelRow label="Director / Head of Operations" value={qualifyInput.directorOfOperations || '—'} />
          <IntelRow label="Procurement Head / Equivalent" value={qualifyInput.procurementHead || '—'} />
          <IntelRow label="Key Decision Maker" value={qualifyInput.keyDecisionMaker || '—'} />
          <IntelRow label="IPI Account / Sales Owner" value={qualifyInput.ipiAccountOwner || '—'} />
        </Card>
      </Section>

      <Section n={3} title="Customer Assumption Card">
        <CustomerAssumptionCard qualifyInput={qualifyInput} quantifyInput={quantifyInput} />
      </Section>

      <Section n={4} title="Commercial Position">
        <div className="mb-3 grid grid-cols-2 gap-3">
          <StatCard
            label="Potential IPI Opportunity"
            value={`${formatRupeesCompact(commercial.ipiOpportunityPotentialAnnual)}/yr`}
            emphasis
          />
          <StatCard
            label="Actual IPI Opportunity"
            value={quantifyInput ? `${formatRupeesCompact(commercial.ipiOpportunityActualAnnual)}/yr` : '—'}
            emphasis
          />
        </div>
        <Card>
          <IntelRow label="IPI Equipment Requirement" value="Verified" />
          <IntelRow label="Playable-Day Objective" value={formatNumber(PLAYABLE_DAYS_PER_YEAR)} mono />
          <IntelRow label="Equipment Downtime Target" value={EQUIPMENT_DOWNTIME_TARGET} mono />
          <IntelRow label="Currently Priced Draft SOW" value={formatRupeesCompact(pricedTotal)} mono />
          <IntelRow label="Unpriced SOW" value={hasUnpriced ? 'TBD' : '—'} mono />
          <IntelRow
            label="Complete Draft SOW / Draft Invoice"
            value={hasUnpriced ? `${formatRupeesCompact(pricedTotal)} + TBD` : formatRupeesCompact(pricedTotal)}
            mono
          />
        </Card>
      </Section>

      <div className="mb-2 text-xs text-ipi-700/50">
        This is the intelligence available before entering customer negotiation.
      </div>
    </div>
  )
}
