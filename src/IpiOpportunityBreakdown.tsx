import { BarDivider, BarStat, StatBar } from './components/ui'
import { formatRupeesCompact } from './format'

const ICON_PATHS = {
  equipment: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  irrigation: 'M12 3c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10Z',
  maintenance: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 9l6 6M15 9l-6 6',
  total: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 12h.01',
}

export interface EquipmentBreakdown {
  equipment: number
  irrigation: number
  maintenance: number
}

/**
 * Shared with Quantify — the bannered Equipment / Irrigation / Maintenance
 * SOW pricing breakdown, alongside Actual IPI Opportunity (revenue minus
 * actual cost of operations, from calculateQuantify — not a sum of the
 * three breakdown fields). Breakdown is editable there (pass onChange);
 * read-only elsewhere (e.g. Verify, reviewing what Quantify already set)
 * when omitted.
 */
export function IpiOpportunityBreakdown({
  breakdown,
  total,
  onChange,
  equipmentAuto = false,
  onEquipmentClick,
}: {
  breakdown: EquipmentBreakdown
  total: number
  onChange?: (breakdown: EquipmentBreakdown) => void
  /** When true, Equipment is synced live from the Equipment Template above and shown read-only. */
  equipmentAuto?: boolean
  /** Click the Equipment stat to reveal which items make up that total. */
  onEquipmentClick?: () => void
}) {
  return (
    <div>
      <StatBar title="IPI Opportunity Breakdown (Annual)">
        <BarStat
          icon={ICON_PATHS.equipment}
          label="Equipment"
          value={formatRupeesCompact(breakdown.equipment)}
          sublabel={equipmentAuto ? 'Click to view selected equipment' : undefined}
          first
          onClick={onEquipmentClick}
          editable={
            onChange && !equipmentAuto
              ? { value: breakdown.equipment, onChange: (v) => onChange({ ...breakdown, equipment: v }) }
              : undefined
          }
        />
        <BarStat
          icon={ICON_PATHS.irrigation}
          label="Irrigation"
          value={formatRupeesCompact(breakdown.irrigation)}
          editable={onChange ? { value: breakdown.irrigation, onChange: (v) => onChange({ ...breakdown, irrigation: v }) } : undefined}
        />
        <BarStat
          icon={ICON_PATHS.maintenance}
          label="Maintenance"
          value={formatRupeesCompact(breakdown.maintenance)}
          editable={onChange ? { value: breakdown.maintenance, onChange: (v) => onChange({ ...breakdown, maintenance: v }) } : undefined}
        />
        <BarDivider />
        <BarStat icon={ICON_PATHS.total} label="Actual IPI Opportunity" value={formatRupeesCompact(total)} emphasis />
      </StatBar>

      <div className="mb-5 flex gap-2 rounded-lg border border-hairline bg-ipi-50/60 px-3 py-2.5 text-xs text-ipi-700/70">
        <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full bg-ipi-700 text-[10px] font-semibold text-white">
          i
        </span>
        <span>
          Actual IPI Opportunity = actual revenue (players/day × avg green fee × 336 days) minus actual cost of
          operations (golf spend + salaries + water, per month × 12). Equipment / Irrigation / Maintenance below is
          the itemized SOW pricing breakdown, priced independently.
        </span>
      </div>
    </div>
  )
}
