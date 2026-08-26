import { useEffect, useState } from 'react'
import { calculateSelectedEquipmentTotal } from '../calc/commercial'
import { calculateQuantify } from '../calc/quantify'
import type { QualifyInput, QuantifyInput } from '../calc/types'
import { Field, PrimaryButton, SecondaryButton, SectionLabel } from '../components/ui'
import { EQUIPMENT_CATALOG } from '../data/equipmentCatalog'
import { useUsdInrRate } from '../hooks/useUsdInrRate'
import { EquipmentVerification } from './EquipmentVerification'
import { IpiOpportunityBreakdown } from '../IpiOpportunityBreakdown'
import { SelectedEquipmentDetail } from './SelectedEquipmentDetail'

export function QuantifyStep({
  qualifyInput,
  input,
  onChange,
  onNext,
  onBack,
}: {
  qualifyInput: QualifyInput
  input: QuantifyInput
  onChange: (input: QuantifyInput) => void
  onNext: () => void
  onBack: () => void
}) {
  const result = calculateQuantify(qualifyInput, input)
  const [showEquipmentDetail, setShowEquipmentDetail] = useState(false)
  const { rate: usdInrRate } = useUsdInrRate()

  const { pricedTotal: equipmentTotal } = calculateSelectedEquipmentTotal(
    EQUIPMENT_CATALOG,
    input.equipmentVerification,
    usdInrRate,
  )

  // Keep breakdown.equipment synced to the Equipment Template selection (and
  // the live rate) at all times — including on first load, before the rep
  // has touched a qty field — so Verify (which reads this same stored value
  // read-only) never shows a stale figure from before this was wired up.
  useEffect(() => {
    if (input.breakdown.equipment !== equipmentTotal) {
      onChange({ ...input, breakdown: { ...input.breakdown, equipment: equipmentTotal } })
    }
  }, [equipmentTotal])

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
        total={result.actualIpiOpportunity}
        onChange={(breakdown) => onChange({ ...input, breakdown })}
        equipmentAuto
        onEquipmentClick={() => setShowEquipmentDetail((v) => !v)}
      />

      {showEquipmentDetail && <SelectedEquipmentDetail lines={input.equipmentVerification} />}

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Verify →</PrimaryButton>
      </div>
    </div>
  )
}
