import { SLOT_INTERVAL_MINUTES, TANKER_CAPACITY_LITERS } from '../calc/constants'
import { calculateQualify } from '../calc/qualify'
import type { CustomerType, QualifyInput } from '../calc/types'
import {
  Field,
  FixedField,
  PrimaryButton,
  SectionLabel,
  SelectField,
  TextField,
} from '../components/ui'
import { EquipmentAudit } from './EquipmentAudit'
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

const HOURS_OPTIONS = Array.from({ length: 24 }, (_, i) => i + 1)

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d={path} />
    </svg>
  )
}

const ICON_PATHS = {
  calendar: 'M4 6h16v14H4zM4 10h16M8 4v4M16 4v4',
  revenue: 'M12 4v16M9 8h4.5a2 2 0 1 1 0 4H10a2 2 0 1 0 0 4h5',
  cost: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM8.5 12h7',
  target: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 12h.01',
}

function OpportunityStat({
  icon,
  label,
  value,
  sublabel,
  first = false,
}: {
  icon: string
  label: string
  value: string
  sublabel: string
  first?: boolean
}) {
  return (
    <div className={`flex-1 px-4 py-4 ${first ? '' : 'border-l border-hairline'}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mint-100 text-mint-600">
          <Icon path={icon} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">{label}</span>
      </div>
      <div className="font-data text-2xl font-semibold tabular-nums text-ink">{value}</div>
      <div className="mt-0.5 text-xs text-ipi-700/50">{sublabel}</div>
    </div>
  )
}

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
              className={`rounded-xl border p-3 text-left transition-colors ${
                selected ? 'border-ipi-900 bg-ipi-100' : 'border-hairline bg-white hover:border-ipi-600'
              }`}
            >
              <div className="text-sm font-medium text-ink">{c.title}</div>
              <div className="mt-1 text-xs text-ipi-700/70">{c.description}</div>
              <div className="mt-2 text-xs font-medium text-ipi-800">→ {c.outcome}</div>
            </button>
          )
        })}
      </div>

      <div className="mb-5 rounded-xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
        <div className="flex items-center justify-between border-b border-hairline bg-ipi-50/60 px-4 py-3">
          <div>
            <div className="text-sm font-medium text-ink">Customer Input Card</div>
            <div className="mt-0.5 text-xs text-ipi-700/60">Filled by the sales person</div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-ipi-700/60 shadow-[0_0_0_1px_var(--color-hairline)]">
            Frozen Backend · Section 1
          </span>
        </div>

        <div className="px-4 pt-4">
          <SectionLabel>Course</SectionLabel>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <TextField
              label="Course name"
              value={input.courseName}
              onChange={(v) => onChange({ ...input, courseName: v })}
              placeholder="e.g. Kharghar Golf Course"
            />
            <TextField
              label="Location / Google Maps"
              value={input.location}
              onChange={(v) => onChange({ ...input, location: v })}
              placeholder="Maps link or address"
            />
          </div>

          <SectionLabel>Capacity</SectionLabel>
          <div className="mb-5 grid grid-cols-4 gap-3">
            <FixedField label="Slot interval" value={`${SLOT_INTERVAL_MINUTES} min`} />
            <SelectField
              label="Playable hours / day"
              value={input.playableHoursPerDay}
              onChange={(v) => onChange({ ...input, playableHoursPerDay: v })}
              options={HOURS_OPTIONS}
            />
            <Field
              label="Potential players / day"
              value={input.potentialPlayersPerDay}
              onChange={(v) => onChange({ ...input, potentialPlayersPerDay: v })}
            />
            <Field
              label="Avg green fee"
              value={input.pricePerRound}
              onChange={(v) => onChange({ ...input, pricePerRound: v })}
              suffix="₹"
            />
          </div>

          <SectionLabel>Costs</SectionLabel>
          <div className="mb-5 grid grid-cols-2 gap-3">
            <Field
              label="Expenses / day"
              value={input.expensesPerDay}
              onChange={(v) => onChange({ ...input, expensesPerDay: v })}
              suffix="₹"
            />
            <Field
              label="Salaries / month"
              value={input.salariesPerMonth}
              onChange={(v) => onChange({ ...input, salariesPerMonth: v })}
              suffix="₹"
            />
          </div>

          <SectionLabel>Water</SectionLabel>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <Field
              label="Water reserve"
              value={input.waterReserve}
              onChange={(v) => onChange({ ...input, waterReserve: v })}
              suffix="L"
            />
            <Field
              label="Water tanker cost"
              value={input.tankerCost}
              onChange={(v) => onChange({ ...input, tankerCost: v })}
              suffix="₹"
            />
            <FixedField label="Tanker capacity" value={`${formatNumber(TANKER_CAPACITY_LITERS)} L`} />
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

      {input.customerType === 'non_existing' && (
        <EquipmentAudit
          items={input.equipmentAudit}
          onChange={(equipmentAudit) => onChange({ ...input, equipmentAudit })}
        />
      )}

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <div className="bg-ipi-900 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white">
          Potential Opportunity
        </div>
        <div className="flex flex-wrap bg-white">
          <OpportunityStat
            icon={ICON_PATHS.calendar}
            label="Annual Rounds"
            value={formatNumber(result.annualRounds)}
            sublabel="Potential"
            first
          />
          <OpportunityStat
            icon={ICON_PATHS.revenue}
            label="Potential Revenue"
            value={formatRupeesCompact(result.potentialRevenueAnnual)}
            sublabel="Annual"
          />
          <OpportunityStat
            icon={ICON_PATHS.cost}
            label="Estimated Operating Cost"
            value={formatRupeesCompact(result.estimatedOperatingCostAnnual)}
            sublabel="Annual"
          />
          <OpportunityStat
            icon={ICON_PATHS.target}
            label="IPI Opportunity"
            value={formatRupeesCompact(result.ipiOpportunityAnnual)}
            sublabel="Annual"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={onNext}>
          {input.customerType === 'new_build' ? 'Next: Certify →' : 'Next: Quantify →'}
        </PrimaryButton>
      </div>
    </div>
  )
}
