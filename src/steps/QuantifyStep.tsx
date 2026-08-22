import { calculateQuantify } from '../calc/quantify'
import type { QuantifyInput } from '../calc/types'
import { Field, PrimaryButton, SecondaryButton, SectionLabel } from '../components/ui'
import { EquipmentVerification } from './EquipmentVerification'
import { IpiOpportunityBreakdown } from '../IpiOpportunityBreakdown'

export function QuantifyStep({
  input,
  onChange,
  onNext,
  onBack,
}: {
  input: QuantifyInput
  onChange: (input: QuantifyInput) => void
  onNext: () => void
  onBack: () => void
}) {
  const result = calculateQuantify(input)

  return (
    <div>
      <SectionLabel>Actuals for this course</SectionLabel>
      <div className="mb-5 grid grid-cols-5 gap-3">
        <Field
          label="Avg price"
          value={input.pricePerRound}
          onChange={(v) => onChange({ ...input, pricePerRound: v })}
          suffix="₹"
        />
        <Field
          label="Actual players / day"
          value={input.actualPlayersPerDay}
          onChange={(v) => onChange({ ...input, actualPlayersPerDay: v })}
        />
        <Field
          label="Golf course spend / month"
          value={input.golfSpendPerMonth}
          onChange={(v) => onChange({ ...input, golfSpendPerMonth: v })}
          suffix="₹"
        />
        <Field
          label="Salaries / month"
          value={input.salariesPerMonth}
          onChange={(v) => onChange({ ...input, salariesPerMonth: v })}
          suffix="₹"
        />
        <Field
          label="Water / month"
          value={input.waterPerMonth}
          onChange={(v) => onChange({ ...input, waterPerMonth: v })}
          suffix="₹"
        />
      </div>

      <EquipmentVerification
        lines={input.equipmentVerification}
        onChange={(equipmentVerification) => onChange({ ...input, equipmentVerification })}
      />

      <IpiOpportunityBreakdown
        breakdown={input.breakdown}
        total={result.totalIpiOpportunity}
        onChange={(breakdown) => onChange({ ...input, breakdown })}
      />

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Verify →</PrimaryButton>
      </div>
    </div>
  )
}
