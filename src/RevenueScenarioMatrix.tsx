import { useState } from 'react'
import { PLAYABLE_DAYS_PER_YEAR } from './calc/constants'
import { Icon } from './components/ui'
import {
  buildGolfCapacityMatrix,
  deriveFrozenCartBreakEven,
  deriveGolfBreakEvenCell,
  FROZEN_CART_CAPEX,
  FROZEN_CART_REVENUE_PER_ROUND,
  FROZEN_PLAYERS_PER_CART,
  FROZEN_ROUNDS_PER_CART_PER_DAY,
  GREEN_FEE_SCENARIOS,
  SPEND_PER_DAY_BANDS,
  type CartScenarioInput,
  type GolfCapacityStatus,
} from './calc/revenueScenario'
import { formatNumber, formatRupees, formatRupeesCompact } from './format'

const GOLF_STATUS_DOT: Record<GolfCapacityStatus, string> = {
  below: 'bg-risk-600',
  crossing: 'bg-amber-600',
  above: 'bg-mint-600',
}

const GOLF_STATUS_ROW_BG: Record<GolfCapacityStatus, string> = {
  below: 'bg-risk-100/50',
  crossing: 'bg-amber-100/50',
  above: 'bg-mint-100/40',
}

function nearest(values: readonly number[], target: number): number {
  return values.reduce((best, v) => (Math.abs(v - target) < Math.abs(best - target) ? v : best))
}

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
        <span className="block text-xs font-semibold uppercase tracking-wide">{title}</span>
        {subtitle && <span className="block text-[10px] text-white/60">{subtitle}</span>}
      </span>
      <span className="flex flex-none items-center gap-1 text-[10px] font-medium normal-case tracking-normal text-white/70">
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
 * hours/day, cart round time, players/cart, revenue/cart round, cart cost),
 * plus the original frozen Golf + Cart reference chart (Revenue Matrix and
 * BE Capacity Band) restored below it.
 */
export function RevenueScenarioMatrix(props: CartScenarioInput & { avgGreenFee?: number; expensesPerDay?: number }) {
  const [golfMatrixExpanded, setGolfMatrixExpanded] = useState(true)
  const [golfBeBandExpanded, setGolfBeBandExpanded] = useState(true)

  const golfRows = buildGolfCapacityMatrix()
  const at100Golf = golfRows[golfRows.length - 1]
  const frozenCartBE = deriveFrozenCartBreakEven()
  const { avgGreenFee, expensesPerDay } = props
  const courseBreakEven =
    avgGreenFee && expensesPerDay ? deriveGolfBreakEvenCell(expensesPerDay, avgGreenFee) : null
  const nearestSpendBand = expensesPerDay ? nearest(SPEND_PER_DAY_BANDS, expensesPerDay) : null
  const nearestFeeScenario = avgGreenFee ? nearest(GREEN_FEE_SCENARIOS, avgGreenFee) : null

  return (
    <div className="mb-5">
      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <ToggleHeader
          title="Revenue Matrix (Frozen Numbers)"
          expanded={golfMatrixExpanded}
          onToggle={() => setGolfMatrixExpanded((v) => !v)}
        />
        {golfMatrixExpanded && (
          <>
            {courseBreakEven && (
              <div className="border-b border-hairline bg-ipi-100 px-4 py-2 text-[11px] text-ipi-900">
                <span className="font-semibold">This course's break-even:</span> {formatRupees(expensesPerDay!)}/day
                ÷ {formatRupees(avgGreenFee!)} green fee = {courseBreakEven.playersNeeded} players/day
                {courseBreakEven.band !== null
                  ? ` — highlighted at the ${courseBreakEven.band}% capacity row below.`
                  : ' — not reached even at 100% capacity.'}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-xs">
                <thead>
                  <tr className="bg-ipi-50/60 text-left text-[11px] text-ipi-700/60">
                    <th rowSpan={2} className="px-3 py-1.5 font-medium">
                      Cap.
                    </th>
                    <th rowSpan={2} className="px-3 py-1.5 text-right font-medium">
                      Plyr/Day
                    </th>
                    <th rowSpan={2} className="px-3 py-1.5 text-right font-medium">
                      Rds/Day
                    </th>
                    <th rowSpan={2} className="px-3 py-1.5 text-right font-medium">
                      Carts
                    </th>
                    <th
                      colSpan={GREEN_FEE_SCENARIOS.length}
                      className="border-l border-hairline px-3 py-1 text-center font-medium"
                    >
                      Golf Revenue (₹)
                    </th>
                    <th rowSpan={2} className="border-l border-hairline px-3 py-1.5 text-right font-medium">
                      Cart Rev. (₹)
                    </th>
                  </tr>
                  <tr className="bg-ipi-50/60 text-[11px] text-ipi-700/60">
                    {GREEN_FEE_SCENARIOS.map((fee) => (
                      <th key={fee} className="border-l border-hairline px-3 py-1 text-right font-medium">
                        ₹{fee / 1000}K
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {golfRows.map((row) => {
                    const isBreakEvenRow = courseBreakEven?.band === row.capacityPct
                    const rowClass = courseBreakEven
                      ? isBreakEvenRow
                        ? 'ring-1 ring-inset ring-ipi-600'
                        : ''
                      : GOLF_STATUS_ROW_BG[row.status]
                    return (
                      <tr key={row.capacityPct} className={`border-t border-hairline ${rowClass}`}>
                        <td className="px-3 py-1.5">
                          <span className="inline-flex items-center gap-1.5">
                            {courseBreakEven ? (
                              isBreakEvenRow && <span className="h-2 w-2 flex-none rounded-full bg-ipi-600" />
                            ) : (
                              <span className={`h-2 w-2 flex-none rounded-full ${GOLF_STATUS_DOT[row.status]}`} />
                            )}
                            <span className={isBreakEvenRow ? 'font-semibold text-ipi-900' : ''}>{row.capacityPct}%</span>
                            {isBreakEvenRow && (
                              <span className="rounded-full bg-ipi-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                                BE
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="font-data px-3 py-1.5 text-right tabular-nums text-ink">{row.playersPerDay}</td>
                        <td className="font-data px-3 py-1.5 text-right tabular-nums text-ink">{row.roundsPerDay}</td>
                        <td className="font-data px-3 py-1.5 text-right tabular-nums text-ink">{row.carts}</td>
                        {row.golfRevenueByFee.map((v, i) => (
                          <td
                            key={GREEN_FEE_SCENARIOS[i]}
                            className="font-data border-l border-hairline px-3 py-1.5 text-right tabular-nums text-ink"
                          >
                            {formatRupeesCompact(v)}
                          </td>
                        ))}
                        <td className="font-data border-l border-hairline px-3 py-1.5 text-right tabular-nums text-ink">
                          {formatRupeesCompact(row.cartRevenue)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <ToggleHeader
          title="BE Capacity Band — % / Players"
          subtitle="Players required to cover daily golf spend"
          expanded={golfBeBandExpanded}
          onToggle={() => setGolfBeBandExpanded((v) => !v)}
        />
        {golfBeBandExpanded && (
          <>
            {courseBreakEven && (
              <div className="border-b border-hairline bg-ipi-100 px-4 py-2 text-[11px] text-ipi-900">
                <span className="font-semibold">Nearest reference row/column</span> to this course's actual
                expenses/day and avg green fee is highlighted below.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-xs">
                <colgroup>
                  <col style={{ width: '28%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '24%' }} />
                  <col style={{ width: '24%' }} />
                </colgroup>
                <thead>
                  <tr className="bg-ipi-50/60 text-left text-[11px] text-ipi-700/60">
                    <th className="px-3 py-1.5 font-medium">Spend/Day (₹)</th>
                    {GREEN_FEE_SCENARIOS.map((fee) => (
                      <th
                        key={fee}
                        className={`border-l border-hairline px-3 py-1.5 text-center font-medium ${
                          nearestFeeScenario === fee ? 'text-ipi-900' : ''
                        }`}
                      >
                        <span className="inline-flex items-center justify-center gap-1">
                          <span>₹{fee / 1000}K</span>
                          {nearestFeeScenario === fee && (
                            <span className="rounded-full bg-ipi-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                              BE
                            </span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SPEND_PER_DAY_BANDS.map((spend) => {
                    const isNearestSpendRow = nearestSpendBand === spend
                    return (
                      <tr
                        key={spend}
                        className={`border-t border-hairline ${isNearestSpendRow ? 'ring-1 ring-inset ring-ipi-600' : ''}`}
                      >
                        <td
                          className={`font-data px-3 py-1.5 font-medium tabular-nums ${
                            isNearestSpendRow ? 'text-ipi-900' : 'text-ink'
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <span>{formatRupeesCompact(spend)}</span>
                            {isNearestSpendRow && (
                              <span className="rounded-full bg-ipi-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                                BE
                              </span>
                            )}
                          </span>
                        </td>
                        {GREEN_FEE_SCENARIOS.map((fee) => {
                          const cell = deriveGolfBreakEvenCell(spend, fee)
                          const isMatch = isNearestSpendRow && nearestFeeScenario === fee
                          return (
                            <td key={fee} className="border-l border-hairline px-3 py-1.5 text-center">
                              <span
                                className={`font-data inline-block rounded-md px-2 py-1 text-[11px] font-semibold tabular-nums ${
                                  isMatch ? 'bg-ipi-600 text-white' : 'bg-white text-ipi-700/70'
                                }`}
                              >
                                {cell.band !== null ? `${cell.band}% / ${cell.playersNeeded}` : `>100% / ${cell.playersNeeded}`}
                              </span>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="border-t border-hairline">
              <div className="bg-ipi-900 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white">
                At 100% Capacity (Reference)
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-xs">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '24%' }} />
                  </colgroup>
                  <tbody>
                    {[
                      { label: 'Players / Day', value: formatNumber(at100Golf.playersPerDay) },
                      {
                        label: `Cart Rounds / Day (Players ÷ ${FROZEN_PLAYERS_PER_CART})`,
                        value: formatNumber(at100Golf.roundsPerDay),
                      },
                      {
                        label: `Physical Carts Required (Rounds ÷ ${FROZEN_ROUNDS_PER_CART_PER_DAY})`,
                        value: formatNumber(at100Golf.carts),
                      },
                      { label: 'Cart Revenue / Day', value: formatRupeesCompact(at100Golf.cartRevenue) },
                    ].map((row, i) => (
                      <tr key={row.label} className={i > 0 ? 'border-t border-hairline' : ''}>
                        <td className="px-3 py-2 text-ipi-700/70">{row.label}</td>
                        <td className="border-l border-hairline px-3 py-2" />
                        <td className="font-data border-l border-hairline px-3 py-2 text-center font-semibold tabular-nums text-ink">
                          {row.value}
                        </td>
                        <td className="border-l border-hairline px-3 py-2" />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Golf BE Formula
          </div>
          <div className="text-[11px] text-ipi-700/70">BE Players/Day = Daily Golf Spend ÷ Green Fee</div>
          <div className="mt-1 text-[11px] text-ipi-700/50">
            Capacity Band shown is the first 10% band where BE is crossed.
          </div>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Cart BE Assumption (Frozen)
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-ipi-700/70">
            <li>{formatRupeesCompact(FROZEN_CART_CAPEX)} per cart (capital recovery)</li>
            <li>{formatRupees(FROZEN_CART_REVENUE_PER_ROUND)} per round</li>
            <li>{FROZEN_ROUNDS_PER_CART_PER_DAY} rounds/cart/day</li>
            <li>{formatNumber(frozenCartBE.daysToRecoverCapital)} playable days</li>
          </ul>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Operating Assumptions (Frozen)
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-ipi-700/70">
            <li>192 players/day (100% capacity)</li>
            <li>{FROZEN_PLAYERS_PER_CART} players per cart</li>
            <li>{FROZEN_ROUNDS_PER_CART_PER_DAY} rounds per cart per day</li>
            <li>{formatNumber(PLAYABLE_DAYS_PER_YEAR)} playable days</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-ipi-900 px-4 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-white">
        <span>More players. More cart rounds. More cart revenue.</span>
      </div>
    </div>
  )
}
