import { calculateQualify } from '../calc/qualify'
import type { CustomerType, QualifyInput } from '../calc/types'
import { Card, Field, PrimaryButton, SectionLabel, StatCard } from '../components/ui'
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

      <SectionLabel>Assumptions (editable)</SectionLabel>
      <div className="mb-5 grid grid-cols-4 gap-3">
        <Field
          label="Potential players / day"
          value={input.potentialPlayersPerDay}
          onChange={(v) => onChange({ ...input, potentialPlayersPerDay: v })}
        />
        <Field
          label="Days open / year"
          value={input.daysOpenPerYear}
          onChange={(v) => onChange({ ...input, daysOpenPerYear: v })}
        />
        <Field
          label="Price / round"
          value={input.pricePerRound}
          onChange={(v) => onChange({ ...input, pricePerRound: v })}
          suffix="₹"
        />
        <Field
          label="Est. operating cost / year"
          value={input.estimatedOperatingCostAnnual}
          onChange={(v) => onChange({ ...input, estimatedOperatingCostAnnual: v })}
          suffix="₹"
        />
      </div>

      <SectionLabel>Potential opportunity</SectionLabel>
      <Card className="mb-5">
        <div className="grid grid-cols-5 gap-3">
          <StatCard label="Players / day" value={formatNumber(input.potentialPlayersPerDay)} sublabel="Potential" />
          <StatCard label="Annual rounds" value={formatNumber(result.annualRounds)} sublabel="Potential" />
          <StatCard label="Potential revenue" value={formatRupeesCompact(result.potentialRevenueAnnual)} sublabel="Annual" />
          <StatCard label="Est. operating cost" value={formatRupeesCompact(input.estimatedOperatingCostAnnual)} sublabel="Annual" />
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
