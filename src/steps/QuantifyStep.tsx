import { useEffect, useState } from 'react'
import { calculateSelectedEquipmentTotal, calculateSelectedGolfCartTotal } from '../calc/commercial'
import { calculateQuantify } from '../calc/quantify'
import type { QualifyInput, QuantifyInput } from '../calc/types'
import { Field, PrimaryButton, SecondaryButton, SectionLabel, SelectField } from '../components/ui'
import { EQUIPMENT_CATALOG } from '../data/equipmentCatalog'
import { GOLF_CART_CATALOG } from '../data/golfCartCatalog'
import { useUsdInrRate } from '../hooks/useUsdInrRate'
import { EquipmentVerification } from './EquipmentVerification'
import { GolfCartVerification } from './GolfCartVerification'
import { IpiOpportunityBreakdown } from '../IpiOpportunityBreakdown'
import { SelectedEquipmentDetail } from './SelectedEquipmentDetail'
import { SelectedGolfCartDetail } from './SelectedGolfCartDetail'

const PLAYERS_PER_CART_OPTIONS = [1, 2]

export function QuantifyStep({
  qualifyInput,
  input,
  isIndividual = false,
  onChange,
  onQualifyInputChange,
  onNext,
  onBack,
}: {
  qualifyInput: QualifyInput
  input: QuantifyInput
  /** True for a lead buying a golf cart only — hides golf-course-specific sections below and
   * shows Cart assumptions here instead of in Qualify. */
  isIndividual?: boolean
  onChange: (input: QuantifyInput) => void
  /** Only used for Individual leads' Cart assumptions, which live on qualifyInput. */
  onQualifyInputChange: (input: QualifyInput) => void
  onNext: () => void
  onBack: () => void
}) {
  const result = calculateQuantify(qualifyInput, input)
  const [showEquipmentDetail, setShowEquipmentDetail] = useState(false)
  const [showGolfCartDetail, setShowGolfCartDetail] = useState(false)
  const { rate: usdInrRate } = useUsdInrRate()

  const { pricedTotal: equipmentTotal } = calculateSelectedEquipmentTotal(
    EQUIPMENT_CATALOG,
    input.equipmentVerification,
    usdInrRate,
  )
  const { pricedTotal: golfCartTotal } = calculateSelectedGolfCartTotal(GOLF_CART_CATALOG, input.golfCartVerification)

  // Keep breakdown.equipment synced to the Equipment Template selection (and
  // the live rate) at all times — including on first load, before the rep
  // has touched a qty field — so Verify (which reads this same stored value
  // read-only) never shows a stale figure from before this was wired up.
  useEffect(() => {
    if (input.breakdown.equipment !== equipmentTotal) {
      onChange({ ...input, breakdown: { ...input.breakdown, equipment: equipmentTotal } })
    }
  }, [equipmentTotal])

  // Same live sync as Equipment, but for the Golf Cart Template.
  useEffect(() => {
    if (input.breakdown.golfCart !== golfCartTotal) {
      onChange({ ...input, breakdown: { ...input.breakdown, golfCart: golfCartTotal } })
    }
  }, [golfCartTotal])

  return (
    <div>
      {!isIndividual && (
        <>
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
        </>
      )}

      {isIndividual && (
        <>
          <SectionLabel>Cart assumptions</SectionLabel>
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field
              label="Golf cart hrs / tee round"
              value={qualifyInput.cartHoursPerTeeRound}
              onChange={(v) => onQualifyInputChange({ ...qualifyInput, cartHoursPerTeeRound: v })}
              suffix="hrs"
            />
            <SelectField
              label="Players per cart"
              value={qualifyInput.playersPerCart}
              onChange={(v) => onQualifyInputChange({ ...qualifyInput, playersPerCart: v })}
              options={PLAYERS_PER_CART_OPTIONS}
            />
            <Field
              label="Revenue per player / cart round"
              value={qualifyInput.cartRevenuePerRound}
              onChange={(v) => onQualifyInputChange({ ...qualifyInput, cartRevenuePerRound: v })}
              suffix="₹"
            />
            <Field
              label="Cart cost"
              value={qualifyInput.cartCost}
              onChange={(v) => onQualifyInputChange({ ...qualifyInput, cartCost: v })}
              suffix="₹"
            />
          </div>
        </>
      )}

      {!isIndividual && (
        <EquipmentVerification
          lines={input.equipmentVerification}
          onChange={(equipmentVerification) => onChange({ ...input, equipmentVerification })}
        />
      )}

      <GolfCartVerification
        lines={input.golfCartVerification}
        onChange={(golfCartVerification) => onChange({ ...input, golfCartVerification })}
      />

      {!isIndividual && (
        <>
          <IpiOpportunityBreakdown
            breakdown={input.breakdown}
            total={result.actualIpiOpportunity}
            onChange={(breakdown) => onChange({ ...input, breakdown })}
            equipmentAuto
            onEquipmentClick={() => setShowEquipmentDetail((v) => !v)}
            golfCartAuto
            onGolfCartClick={() => setShowGolfCartDetail((v) => !v)}
          />

          {showEquipmentDetail && <SelectedEquipmentDetail lines={input.equipmentVerification} />}
          {showGolfCartDetail && <SelectedGolfCartDetail lines={input.golfCartVerification} />}
        </>
      )}

      <div className="flex justify-between">
        <SecondaryButton onClick={onBack}>← Back</SecondaryButton>
        <PrimaryButton onClick={onNext}>Next: Verify →</PrimaryButton>
      </div>
    </div>
  )
}
