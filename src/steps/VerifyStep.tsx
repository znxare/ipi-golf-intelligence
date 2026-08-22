import { calculateVerify } from '../calc/verify'
import type { AbilityToPay, QualifyInput, QuantifyInput, QuantifyResult, VerifyInput } from '../calc/types'
import { Card, Field, PrimaryButton, SecondaryButton, SectionLabel } from '../components/ui'
import { CustomerAssumptionCard } from '../CustomerAssumptionCard'
import { formatRupeesCompact } from '../format'

const CLASSIFICATION: Record<AbilityToPay, { title: string; traits: string[] }> = {
  growth: {
    title: 'A — Growth customer',
    traits: ['Good footfall', 'Stable cash flow', 'Budget available'],
  },
  operational: {
    title: 'B — Operational customer',
    traits: ['Reasonable activity', 'Limited capex', 'Cash-flow constrained'],
  },
  development: {
    title: 'C — Development customer',
    traits: ['Low footfall', 'Low operating spend', 'Limited ability to invest'],
  },
}

export function VerifyStep({
  input,
  onChange,
  quantifyResult,
  qualifyInput,
  quantifyInput,
  onNext,
  onBack,
}: {
  input: VerifyInput
  onChange: (input: VerifyInput) => void
  quantifyResult: QuantifyResult
  qualifyInput: QualifyInput
  quantifyInput: QuantifyInput
  onNext: () => void
  onBack: () => void
}) {
  const result = calculateVerify(input)
  const classification = CLASSIFICATION[result.abilityToPay]

  return (
    <div>
      <SectionLabel>Customer Assumption Card — results generated from customer inputs</SectionLabel>
      <div className="mb-5">
        <CustomerAssumptionCard qualifyInput={qualifyInput} quantifyInput={quantifyInput} />
      </div>

      <SectionLabel>Verify operational and financial viability</SectionLabel>
      <Card className="mb-5">
        <div className="mb-3 text-sm">
          <div className="flex justify-between border-b border-hairline py-1.5">
            <span className="text-ipi-700/70">Amount available for IPI scope</span>
            <span className="font-data font-medium tabular-nums">{formatRupeesCompact(quantifyResult.totalIpiOpportunity)}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Field
            label="Recurring golf revenue / year"
            value={input.recurringGolfRevenueAnnual}
            onChange={(v) => onChange({ ...input, recurringGolfRevenueAnnual: v })}
            suffix="₹"
          />
          <Field
            label="Available cash flow / year"
            value={input.availableCashFlowAnnual}
            onChange={(v) => onChange({ ...input, availableCashFlowAnnual: v })}
            suffix="₹"
          />
          <Field
            label="Footfall / day"
            value={input.footfallPerDay}
            onChange={(v) => onChange({ ...input, footfallPerDay: v })}
          />
          <Field
            label="Break-even players / day"
            value={input.breakEvenPlayersPerDay}
            onChange={(v) => onChange({ ...input, breakEvenPlayersPerDay: v })}
          />
        </div>
      </Card>

      <SectionLabel>Ability to pay (from recurring golf revenue)</SectionLabel>
      <Card className="mb-5 border-ipi-900 bg-ipi-100">
        <div className="text-sm font-medium text-ipi-900">{classification.title}</div>
        <ul className="mt-2 flex gap-4 text-xs text-ipi-800">
          {classification.traits.map((t) => (
            <li key={t}>• {t}</li>
          ))}
        </ul>
      </Card>

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Certify →</PrimaryButton>
      </div>
    </div>
  )
}
