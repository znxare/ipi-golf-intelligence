import { BarDivider, BarStat, StatBar } from './components/ui'
import { formatRupeesCompact } from './format'

const ICON_PATHS = {
  equipment: 'M12 3v3M12 18v3M3 12h3M18 12h3M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
  irrigation: 'M12 3c-3 4-6 7-6 10a6 6 0 0 0 12 0c0-3-3-6-6-10Z',
  maintenance: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM9 9l6 6M15 9l-6 6',
  golfCart:
    'M5 16V11a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v5M5 16h14M9 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M17 19a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0',
  total: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 12h.01',
}

export interface EquipmentBreakdown {
  equipment: number
  irrigation: number
  maintenance: number
  golfCart: number
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
  golfCartAuto = false,
  onGolfCartClick,
}: {
  breakdown: EquipmentBreakdown
  total: number
  onChange?: (breakdown: EquipmentBreakdown) => void
  /** When true, Equipment is synced live from the Equipment Template above and shown read-only. */
  equipmentAuto?: boolean
  /** Click the Equipment stat to reveal which items make up that total. */
  onEquipmentClick?: () => void
  /** When true, Golf Cart is synced live from the Golf Cart Template above and shown read-only. */
  golfCartAuto?: boolean
  /** Click the Golf Cart stat to reveal which items make up that total. */
  onGolfCartClick?: () => void
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
        <BarStat
          icon={ICON_PATHS.golfCart}
          label="Golf Cart"
          value={formatRupeesCompact(breakdown.golfCart)}
          sublabel={golfCartAuto ? 'Click to view selected golf carts' : undefined}
          onClick={onGolfCartClick}
          editable={
            onChange && !golfCartAuto
              ? { value: breakdown.golfCart, onChange: (v) => onChange({ ...breakdown, golfCart: v }) }
              : undefined
          }
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
          operations (golf spend + salaries + water, per month × 12). Equipment / Irrigation / Maintenance / Golf
          Cart below is the itemized SOW pricing breakdown, priced independently.
        </span>
      </div>
    </div>
  )
}
