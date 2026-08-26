import { PLAYABLE_DAYS_PER_YEAR } from './calc/constants'
import {
  BASE_PLAYERS_PER_DAY,
  CART_CAPEX,
  CART_REVENUE_PER_ROUND,
  GREEN_FEE_SCENARIOS,
  PLAYERS_PER_CART,
  ROUNDS_PER_CART_PER_DAY,
  SPEND_PER_DAY_BANDS,
  buildCapacityMatrix,
  deriveBreakEvenCell,
  deriveCartBreakEven,
  type CapacityStatus,
} from './calc/revenueScenario'
import { formatNumber, formatRupees, formatRupeesCompact } from './format'

const STATUS_DOT: Record<CapacityStatus, string> = {
  below: 'bg-risk-600',
  crossing: 'bg-amber-600',
  above: 'bg-mint-600',
}

const STATUS_ROW_BG: Record<CapacityStatus, string> = {
  below: 'bg-risk-100/50',
  crossing: 'bg-amber-100/50',
  above: 'bg-mint-100/40',
}

/**
 * Frozen reference matrix (same for every course): golf + cart revenue at
 * each capacity band, and the break-even capacity band across a spread of
 * daily-spend / green-fee scenarios. Shown at Qualify and Certify as a
 * leave-behind sales reference.
 *
 * When this course's own avg green fee and expenses/day are passed in, the
 * capacity row matching THIS course's break-even (expenses/day ÷ avg green
 * fee) is highlighted instead of the generic below/crossing/above banding —
 * the frozen ₹3.5K/₹5K/₹7.5K columns stay as reference points, but the row
 * highlight itself tracks the real numbers the rep just entered.
 */
export function RevenueScenarioMatrix({
  avgGreenFee,
  expensesPerDay,
}: {
  avgGreenFee?: number
  expensesPerDay?: number
}) {
  const rows = buildCapacityMatrix()
  const cartBE = deriveCartBreakEven()
  const courseBreakEven =
    avgGreenFee && expensesPerDay ? deriveBreakEvenCell(expensesPerDay, avgGreenFee) : null

  return (
    <div className="mb-5">
      <div className="mb-3 rounded-xl bg-ipi-900 px-4 py-3 text-white">
        <div className="text-sm font-semibold uppercase tracking-wide">Golf + Cart Revenue Scenario</div>
        <div className="mt-0.5 text-xs text-white/60">Frozen reference — capacity ramp and break-even bands</div>
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <div className="bg-ipi-900 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white">
          Revenue Matrix (Frozen Numbers)
        </div>
        {courseBreakEven && (
          <div className="border-b border-hairline bg-ipi-100 px-4 py-2 text-xs text-ipi-900">
            <span className="font-semibold">This course's break-even:</span> {formatRupees(expensesPerDay!)}/day ÷{' '}
            {formatRupees(avgGreenFee!)} green fee = {courseBreakEven.playersNeeded} players/day
            {courseBreakEven.band !== null
              ? ` — highlighted at the ${courseBreakEven.band}% capacity row below.`
              : ' — not reached even at 100% capacity.'}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-ipi-50/60 text-left text-xs text-ipi-700/60">
                <th rowSpan={2} className="px-3 py-2 font-medium">
                  Cap.
                </th>
                <th rowSpan={2} className="px-3 py-2 text-right font-medium">
                  Plyr/Day
                </th>
                <th rowSpan={2} className="px-3 py-2 text-right font-medium">
                  Rds/Day
                </th>
                <th rowSpan={2} className="px-3 py-2 text-right font-medium">
                  Carts
                </th>
                <th
                  colSpan={GREEN_FEE_SCENARIOS.length}
                  className="border-l border-hairline px-3 py-1.5 text-center font-medium"
                >
                  Golf Revenue (₹)
                </th>
                <th rowSpan={2} className="border-l border-hairline px-3 py-2 text-right font-medium">
                  Cart Rev. (₹)
                </th>
              </tr>
              <tr className="bg-ipi-50/60 text-xs text-ipi-700/60">
                {GREEN_FEE_SCENARIOS.map((fee) => (
                  <th key={fee} className="border-l border-hairline px-3 py-1.5 text-right font-medium">
                    ₹{fee / 1000}K
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const isBreakEvenRow = courseBreakEven?.band === row.capacityPct
                const rowClass = courseBreakEven
                  ? isBreakEvenRow
                    ? 'bg-ipi-100 ring-1 ring-inset ring-ipi-600'
                    : ''
                  : STATUS_ROW_BG[row.status]
                return (
                <tr key={row.capacityPct} className={`border-t border-hairline ${rowClass}`}>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5">
                      {courseBreakEven ? (
                        isBreakEvenRow && <span className="h-2 w-2 flex-none rounded-full bg-ipi-600" />
                      ) : (
                        <span className={`h-2 w-2 flex-none rounded-full ${STATUS_DOT[row.status]}`} />
                      )}
                      <span className={isBreakEvenRow ? 'font-semibold text-ipi-900' : ''}>{row.capacityPct}%</span>
                      {isBreakEvenRow && (
                        <span className="rounded-full bg-ipi-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          BE
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.playersPerDay}</td>
                  <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.roundsPerDay}</td>
                  <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{row.carts}</td>
                  {row.golfRevenueByFee.map((v, i) => (
                    <td
                      key={GREEN_FEE_SCENARIOS[i]}
                      className="font-data border-l border-hairline px-3 py-2 text-right tabular-nums text-ink"
                    >
                      {formatRupeesCompact(v)}
                    </td>
                  ))}
                  <td className="font-data border-l border-hairline px-3 py-2 text-right tabular-nums text-ink">
                    {formatRupeesCompact(row.cartRevenue)}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
        <div className="bg-ipi-900 px-4 py-2.5 text-center text-white">
          <div className="text-sm font-semibold uppercase tracking-wide">BE Capacity Band — % / Players</div>
          <div className="text-[11px] text-white/60">Players required to cover daily golf spend</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="bg-ipi-50/60 text-left text-xs text-ipi-700/60">
                <th className="px-3 py-2 font-medium">Spend/Day (₹)</th>
                {GREEN_FEE_SCENARIOS.map((fee) => (
                  <th key={fee} className="border-l border-hairline px-3 py-2 text-center font-medium">
                    ₹{fee / 1000}K
                  </th>
                ))}
                <th className="border-l border-hairline px-3 py-2 text-center font-medium">
                  Cart BE ({formatRupeesCompact(CART_CAPEX)}/cart)
                </th>
              </tr>
            </thead>
            <tbody>
              {SPEND_PER_DAY_BANDS.map((spend) => (
                <tr key={spend} className="border-t border-hairline">
                  <td className="font-data px-3 py-2 font-medium tabular-nums text-ink">
                    {formatRupeesCompact(spend)}
                  </td>
                  {GREEN_FEE_SCENARIOS.map((fee) => {
                    const cell = deriveBreakEvenCell(spend, fee)
                    return (
                      <td key={fee} className="border-l border-hairline px-3 py-2 text-center">
                        <span className="font-data inline-block rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold tabular-nums text-amber-600">
                          {cell.band !== null ? `${cell.band}% / ${cell.playersNeeded}` : `>100% / ${cell.playersNeeded}`}
                        </span>
                      </td>
                    )
                  })}
                  <td className="border-l border-hairline px-3 py-2 text-center text-xs text-ipi-700/70">
                    {formatNumber(cartBE.roundsToRecoverCapital)} Rds /{' '}
                    {formatNumber(cartBE.playerRoundsToRecoverCapital)} Plyr /{' '}
                    {formatNumber(cartBE.daysToRecoverCapital)} Days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-xl border border-hairline bg-white px-4 py-2.5 text-xs text-ipi-700/70">
        {courseBreakEven ? (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ipi-600" /> Highlighted row = this course's break-even
            capacity band (Expenses/day ÷ Avg green fee)
          </span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-risk-600" /> Below
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-600" /> Crossing (BE band)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-mint-600" /> Above
            </span>
          </>
        )}
      </div>

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Golf BE Formula
          </div>
          <div className="text-xs text-ipi-700/70">BE Players/Day = Daily Golf Spend ÷ Green Fee</div>
          <div className="mt-1 text-xs text-ipi-700/50">
            Capacity Band shown is the first 10% band where BE is crossed.
          </div>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Cart BE Assumption
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-ipi-700/70">
            <li>{formatRupeesCompact(CART_CAPEX)} per cart (capital recovery)</li>
            <li>{formatRupees(CART_REVENUE_PER_ROUND)} per round</li>
            <li>{ROUNDS_PER_CART_PER_DAY} rounds/cart/day</li>
            <li>{formatNumber(cartBE.daysToRecoverCapital)} playable days</li>
          </ul>
        </div>
        <div className="rounded-xl border border-hairline bg-white p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
            Operating Assumptions
          </div>
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-ipi-700/70">
            <li>{BASE_PLAYERS_PER_DAY} players/day (100% capacity)</li>
            <li>{PLAYERS_PER_CART} players per cart</li>
            <li>{ROUNDS_PER_CART_PER_DAY} rounds per cart per day</li>
            <li>{formatNumber(PLAYABLE_DAYS_PER_YEAR)} playable days</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 rounded-xl bg-ipi-900 px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-white">
        <span>More players. More rounds. More revenue.</span>
        <span className="text-white/40">|</span>
        <span>Sustainable golf business.</span>
      </div>
    </div>
  )
}
