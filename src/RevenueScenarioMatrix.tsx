import { useState } from 'react'
import { PLAYABLE_DAYS_PER_YEAR } from './calc/constants'
import { Icon } from './components/ui'
import {
  buildCartCapacityMatrix,
  deriveCartBreakEven,
  deriveRoundsPerCartPerDay,
  type CartScenarioInput,
} from './calc/revenueScenario'
import { formatNumber, formatRupees, formatRupeesCompact } from './format'

function ToggleHeader({
  title,
  subtitle,
  expanded,
  onToggle,
}: {
  title: string
  subtitle?: string
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 bg-ipi-900 px-4 py-2.5 text-left text-white"
    >
      <span>
        <span className="block text-sm font-semibold uppercase tracking-wide">{title}</span>
        {subtitle && <span className="block text-[11px] text-white/60">{subtitle}</span>}
      </span>
      <span className="flex flex-none items-center gap-1 text-[11px] font-medium normal-case tracking-normal text-white/70">
        {expanded ? 'Minimise' : 'Expand'}
        <span className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
          <Icon path="M6 9l6 6 6-6" />
        </span>
      </span>
    </button>
  )
}

/**
 * Cart Revenue Scenario — capacity ramp and capital-recovery break-even for
 * this course's own cart assumptions (Customer Input Card: playable
 * hours/day, cart round time, players/cart, revenue/cart round, cart cost).
 * Golf green-fee revenue and golf break-even were dropped from this view —
 * it's cart economics only.
 */
export function RevenueScenarioMatrix(props: CartScenarioInput) {
  const [matrixExpanded, setMatrixExpanded] = useState(true)
  const [breakEvenExpanded, setBreakEvenExpanded] = useState(true)
  const rows = buildCartCapacityMatrix(props)
  const cartBE = deriveCartBreakEven(props)
  const roundsPerCartPerDay = deriveRoundsPerCartPerDay(props.playableHoursPerDay, props.cartHoursPerTeeRound)
  const at100 = rows[rows.length - 1]

  return (
    <div className="mb-5">
      <div className="mb-3 rounded-xl bg-ipi-900 px-4 py-3 text-white">
        <div className="text-sm font-semibold uppercase tracking-wide">Cart Revenue Scenario</div>
        <div className="mt-0.5 text-xs text-white/60">Driven by this course's own cart assumptions</div>
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <ToggleHeader
          title="Capacity Ramp"
          subtitle="Players, cart rounds and cart revenue at each capacity band"
          expanded={matrixExpanded}
          onToggle={() => setMatrixExpanded((v) => !v)}
        />
        {matrixExpanded && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-ipi-50/60 text-left text-xs text-ipi-700/60">
                  <th className="px-3 py-2 font-medium">Cap.</th>
                  <th className="px-3 py-2 text-right font-medium">Players/Day</th>
                  <th className="px-3 py-2 text-right font-medium">Cart Rds/Day</th>
                  <th className="px-3 py-2 text-right font-medium">Carts Req./Day</th>
                  <th className="border-l border-hairline px-3 py-2 text-right font-medium">Cart Rev./Day (₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const isFull = row.capacityPct === 100
                  return (
                    <tr
                      key={row.capacityPct}
                      className={`border-t border-hairline ${isFull ? 'bg-ipi-100/50' : ''}`}
                    >
                      <td className="px-3 py-2">
                        <span className={isFull ? 'font-semibold text-ipi-900' : ''}>{row.capacityPct}%</span>
                      </td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.playersPerDay}</td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.cartRoundsPerDay}</td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.cartsRequired}</td>
                      <td className="font-data border-l border-hairline px-3 py-2 text-right tabular-nums text-ink">
                        {formatRupeesCompact(row.cartRevenuePerDay)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <ToggleHeader
          title="Cart Break-even (Capital Recovery)"
          subtitle="Rounds / players / days for cart revenue to cover cart cost"
          expanded={breakEvenExpanded}
          onToggle={() => setBreakEvenExpanded((v) => !v)}
        />
        {breakEvenExpanded && (
          <div className="grid grid-cols-2 gap-px bg-hairline sm:grid-cols-5">
            <div className="bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">Cart Cost</div>
              <div className="font-data mt-1 text-sm font-semibold tabular-nums text-ink">
                {formatRupees(props.cartCost)}
              </div>
            </div>
            <div className="bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
                Revenue / Cart Round
              </div>
              <div className="font-data mt-1 text-sm font-semibold tabular-nums text-ink">
                {formatRupees(props.cartRevenuePerRound)}
              </div>
            </div>
            <div className="bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
                Rounds to Break-even
              </div>
              <div className="font-data mt-1 text-sm font-semibold tabular-nums text-ink">
                {formatNumber(cartBE.roundsToRecoverCapital)}
              </div>
            </div>
            <div className="bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
                Players to Break-even
              </div>
              <div className="font-data mt-1 text-sm font-semibold tabular-nums text-ink">
                {formatNumber(cartBE.playerRoundsToRecoverCapital)}
              </div>
            </div>
            <div className="bg-white p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
                Days to Break-even
              </div>
              <div className="font-data mt-1 text-sm font-semibold tabular-nums text-ink">
                {formatNumber(cartBE.daysToRecoverCapital)}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            At 100% Capacity (This Course)
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-ipi-700/70">
            <li>{formatNumber(at100.playersPerDay)} players/day</li>
            <li>{formatNumber(at100.cartRoundsPerDay)} cart rounds/day</li>
            <li>{formatNumber(at100.cartsRequired)} physical carts required</li>
            <li>{formatRupeesCompact(at100.cartRevenuePerDay)} cart revenue/day</li>
            <li>{formatRupeesCompact(at100.cartRevenuePerDay * PLAYABLE_DAYS_PER_YEAR)} cart revenue/year</li>
          </ul>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Cart Assumptions
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-ipi-700/70">
            <li>{props.playableHoursPerDay} playable hrs/day</li>
            <li>{props.cartHoursPerTeeRound} hrs/tee round → {formatNumber(roundsPerCartPerDay)} rounds/cart/day</li>
            <li>{props.playersPerCart} players/cart</li>
            <li>{formatNumber(PLAYABLE_DAYS_PER_YEAR)} playable days/year</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-ipi-900 px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-white">
        <span>More players. More cart rounds. More cart revenue.</span>
      </div>
    </div>
  )
}
