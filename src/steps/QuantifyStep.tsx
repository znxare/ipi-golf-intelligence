import { calculateQuantify } from '../calc/quantify'
import type { QuantifyInput } from '../calc/types'
import { BarDivider, BarStat, Field, PrimaryButton, SecondaryButton, SectionLabel, StatBar } from '../components/ui'
import { EquipmentVerification } from './EquipmentVerification'
import { formatRupeesCompact } from '../format'

const ICON_PATHS = {
  equipment: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  irrigation: 'M12 3c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10Z',
  maintenance: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 9l6 6M15 9l-6 6',
  total: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 12h.01',
}

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

      <StatBar title="IPI Opportunity Breakdown (Annual)">
        <BarStat
          icon={ICON_PATHS.equipment}
          label="Equipment"
          value={formatRupeesCompact(input.breakdown.equipment)}
          first
          editable={{
            value: input.breakdown.equipment,
            onChange: (v) => onChange({ ...input, breakdown: { ...input.breakdown, equipment: v } }),
          }}
        />
        <BarStat
          icon={ICON_PATHS.irrigation}
          label="Irrigation"
          value={formatRupeesCompact(input.breakdown.irrigation)}
          editable={{
            value: input.breakdown.irrigation,
            onChange: (v) => onChange({ ...input, breakdown: { ...input.breakdown, irrigation: v } }),
          }}
        />
        <BarStat
          icon={ICON_PATHS.maintenance}
          label="Maintenance"
          value={formatRupeesCompact(input.breakdown.maintenance)}
          editable={{
            value: input.breakdown.maintenance,
            onChange: (v) => onChange({ ...input, breakdown: { ...input.breakdown, maintenance: v } }),
          }}
        />
        <BarDivider />
        <BarStat
          icon={ICON_PATHS.total}
          label="Total IPI Opportunity"
          value={formatRupeesCompact(result.totalIpiOpportunity)}
          emphasis
        />
      </StatBar>

      <div className="mb-5 flex gap-2 rounded-lg border border-hairline bg-ipi-50/60 px-3 py-2.5 text-xs text-ipi-700/70">
        <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-ipi-700 text-[10px] font-semibold text-white">
          i
        </span>
        <span>
          IPI Opportunity = Equipment + Irrigation + Maintenance. This is the annual opportunity available for
          IPI Scope of Work, subject to verification.
        </span>
      </div>

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Verify →</PrimaryButton>
      </div>
    </div>
  )
}
