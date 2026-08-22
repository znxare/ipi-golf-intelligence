import { calculateQualify } from '../calc/qualify'
import type { CustomerType, QualifyInput } from '../calc/types'
import { Card, Field, PrimaryButton, SectionLabel, StatCard, TextField } from '../components/ui'
import { formatNumber, formatRupeesCompact } from '../format'

const CUSTOMER_TYPES: {
  type: CustomerType
  title: string
  description: string
  outcome: string
}[] = [
  {
    type: 'existing',
    title: 'Existing IPI customer',
    description: 'Existing relationship. IPI already provides equipment, services or support.',
    outcome: 'Maintain / recurring SOW path',
  },
  {
    type: 'non_existing',
    title: 'Non-existing customer',
    description: 'Existing golf course, not currently an IPI customer, has historical operations and equipment.',
    outcome: 'Scope of work path',
  },
  {
    type: 'new_build',
    title: 'New build',
    description: 'New golf-course project. No operating or equipment history.',
    outcome: 'Project feasibility path → stop',
  },
]

export function QualifyStep({
  input,
  onChange,
  onNext,
}: {
  input: QualifyInput
  onChange: (input: QualifyInput) => void
  onNext: () => void
}) {
  const result = calculateQualify(input)

  return (
    <div>
      <SectionLabel>Establish customer type</SectionLabel>
      <div className="mb-5 grid grid-cols-3 gap-3">
        {CUSTOMER_TYPES.map((c) => {
          const selected = input.customerType === c.type
          return (
            <button
              key={c.type}
              type="button"
              onClick={() => onChange({ ...input, customerType: c.type })}
              className={`rounded-xl border p-3 text-left ${
                selected ? 'border-ipi-900 bg-ipi-100' : 'border-ipi-100 bg-white'
              }`}
            >
              <div className="text-sm font-medium text-ink">{c.title}</div>
              <div className="mt-1 text-xs text-ipi-700/70">{c.description}</div>
              <div className="mt-2 text-xs font-medium text-ipi-800">→ {c.outcome}</div>
            </button>
          )
        })}
      </div>

      <div className="mb-5 rounded-xl border border-ipi-100 bg-white">
        <div className="border-b border-ipi-100 px-4 py-3">
          <div className="text-sm font-medium text-ink">Customer Input Card</div>
          <div className="mt-0.5 text-xs text-ipi-700/60">Filled by the sales person</div>
        </div>

        <div className="px-4 pt-4">
          <SectionLabel>Course</SectionLabel>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <TextField
              label="Customer / Course code"
              value={input.courseCode}
              onChange={(v) => onChange({ ...input, courseCode: v })}
              placeholder="18H / P72 / 7.5K YD"
            />
            <TextField
              label="Location / Google Maps"
              value={input.location}
              onChange={(v) => onChange({ ...input, location: v })}
              placeholder="Maps link or address"
            />
            <Field
              label="Playable days"
              value={input.daysOpenPerYear}
              onChange={(v) => onChange({ ...input, daysOpenPerYear: v })}
            />
            <Field
              label="Green fee"
              value={input.pricePerRound}
              onChange={(v) => onChange({ ...input, pricePerRound: v })}
              suffix="₹"
            />
          </div>

          <SectionLabel>Players &amp; spend</SectionLabel>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Field
              label="Potential players / day"
              value={input.potentialPlayersPerDay}
              onChange={(v) => onChange({ ...input, potentialPlayersPerDay: v })}
            />
            <Field
              label="Actual players / day"
              value={input.actualPlayersPerDay}
              onChange={(v) => onChange({ ...input, actualPlayersPerDay: v })}
            />
            <Field
              label="Salary cost / day"
              value={input.salaryCostPerDay}
              onChange={(v) => onChange({ ...input, salaryCostPerDay: v })}
              suffix="₹"
            />
            <Field
              label="Potential maintenance spend / day"
              value={input.potentialMaintenanceSpendPerDay}
              onChange={(v) => onChange({ ...input, potentialMaintenanceSpendPerDay: v })}
              suffix="₹"
            />
            <Field
              label="Actual customer spend / month"
              value={input.actualCustomerSpendPerMonth}
              onChange={(v) => onChange({ ...input, actualCustomerSpendPerMonth: v })}
              suffix="₹"
            />
          </div>

          <SectionLabel>Water</SectionLabel>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Field
              label="Water requirement / day — potential"
              value={input.waterRequirementPotentialPerDay}
              onChange={(v) => onChange({ ...input, waterRequirementPotentialPerDay: v })}
              suffix="L"
            />
            <Field
              label="Water reserve"
              value={input.waterReserve}
              onChange={(v) => onChange({ ...input, waterReserve: v })}
              suffix="L"
            />
            <Field
              label="Tanker capacity"
              value={input.tankerCapacity}
              onChange={(v) => onChange({ ...input, tankerCapacity: v })}
              suffix="L"
            />
            <Field
              label="Tanker cost"
              value={input.tankerCost}
              onChange={(v) => onChange({ ...input, tankerCost: v })}
              suffix="₹"
            />
            <Field
              label="Reserve refills / year"
              value={input.refillsPerYear}
              onChange={(v) => onChange({ ...input, refillsPerYear: v })}
            />
          </div>

          <SectionLabel>Customer team</SectionLabel>
          <div className="mb-4 grid grid-cols-3 gap-3">
            <TextField
              label="Superintendent"
              value={input.superintendent}
              onChange={(v) => onChange({ ...input, superintendent: v })}
              placeholder="__________"
            />
            <TextField
              label="Director / Head of operations"
              value={input.directorOfOperations}
              onChange={(v) => onChange({ ...input, directorOfOperations: v })}
              placeholder="__________"
            />
            <TextField
              label="Procurement head / equivalent"
              value={input.procurementHead}
              onChange={(v) => onChange({ ...input, procurementHead: v })}
              placeholder="__________"
            />
            <TextField
              label="Key decision maker"
              value={input.keyDecisionMaker}
              onChange={(v) => onChange({ ...input, keyDecisionMaker: v })}
              placeholder="__________"
            />
            <TextField
              label="IPI account / sales owner"
              value={input.ipiAccountOwner}
              onChange={(v) => onChange({ ...input, ipiAccountOwner: v })}
              placeholder="__________"
            />
          </div>
        </div>
      </div>

      <SectionLabel>Potential opportunity</SectionLabel>
      <Card className="mb-5">
        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Players / day" value={formatNumber(input.potentialPlayersPerDay)} sublabel="Potential" />
          <StatCard label="Annual rounds" value={formatNumber(result.annualRounds)} sublabel="Potential" />
          <StatCard label="Potential revenue" value={formatRupeesCompact(result.potentialRevenueAnnual)} sublabel="Annual" />
          <StatCard label="Est. operating cost" value={formatRupeesCompact(result.estimatedOperatingCostAnnual)} sublabel="Annual" />
          <StatCard
            label="IPI opportunity"
            value={formatRupeesCompact(result.ipiOpportunityAnnual)}
            sublabel="Annual"
            emphasis
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <PrimaryButton onClick={onNext}>
          {input.customerType === 'new_build' ? 'Next: Certify →' : 'Next: Quantify →'}
        </PrimaryButton>
      </div>
    </div>
  )
}
