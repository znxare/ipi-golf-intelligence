import { calculateQuantify } from '../calc/quantify'
import type { QuantifyInput } from '../calc/types'
import { Card, Field, PrimaryButton, SecondaryButton, SectionLabel, StatCard } from '../components/ui'
import { formatRupees, formatRupeesCompact } from '../format'

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
          label="Price / round"
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
          label="Golf spend / day"
          value={input.golfSpendPerDay}
          onChange={(v) => onChange({ ...input, golfSpendPerDay: v })}
          suffix="₹"
        />
        <Field
          label="Salaries / day"
          value={input.salariesPerDay}
          onChange={(v) => onChange({ ...input, salariesPerDay: v })}
          suffix="₹"
        />
        <Field
          label="Water / day"
          value={input.waterPerDay}
          onChange={(v) => onChange({ ...input, waterPerDay: v })}
          suffix="₹"
        />
      </div>

      <SectionLabel>Establish economic opportunity</SectionLabel>
      <Card className="mb-4">
        <div className="grid grid-cols-5 gap-3">
          <StatCard
            label="BE players / day"
            value={String(result.breakEvenPlayersPerDay)}
            sublabel="Break-even"
          />
          <StatCard
            label="Actual players / day"
            value={String(input.actualPlayersPerDay)}
            sublabel="Current average"
          />
          <StatCard label="Revenue / day" value={formatRupees(result.revenuePerDay)} sublabel="Actual" />
          <StatCard label="Golf spend / day" value={formatRupeesCompact(input.golfSpendPerDay)} sublabel="Actual" />
          <StatCard
            label="IPI opportunity / day"
            value={formatRupeesCompact(result.ipiOpportunityPerDay)}
            sublabel="Available for IPI"
            emphasis
          />
        </div>
        <div className="font-data mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-hairline pt-3 text-xs tabular-nums text-ipi-700/70">
          <span>Current revenue/day: {formatRupees(result.revenuePerDay)}</span>
          <span>Revenue at BE: {formatRupeesCompact(result.revenueAtBreakEven)}</span>
          <span>Gap to BE: {result.gapToBreakEvenPlayers} players/day</span>
        </div>
      </Card>

      <SectionLabel>IPI opportunity breakdown</SectionLabel>
      <Card className="mb-5">
        <div className="grid grid-cols-5 gap-3">
          <Field
            label="Equipment"
            value={input.breakdown.equipment}
            onChange={(v) => onChange({ ...input, breakdown: { ...input.breakdown, equipment: v } })}
            suffix="₹"
          />
          <Field
            label="Irrigation"
            value={input.breakdown.irrigation}
            onChange={(v) => onChange({ ...input, breakdown: { ...input.breakdown, irrigation: v } })}
            suffix="₹"
          />
          <Field
            label="Maintenance"
            value={input.breakdown.maintenance}
            onChange={(v) => onChange({ ...input, breakdown: { ...input.breakdown, maintenance: v } })}
            suffix="₹"
          />
          <Field
            label="Management"
            value={input.breakdown.management}
            onChange={(v) => onChange({ ...input, breakdown: { ...input.breakdown, management: v } })}
            suffix="₹"
          />
          <StatCard label="Total IPI opportunity" value={formatRupeesCompact(result.totalIpiOpportunity)} emphasis />
        </div>
      </Card>

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Verify →</PrimaryButton>
      </div>
    </div>
  )
}
