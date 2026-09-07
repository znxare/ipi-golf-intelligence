import { useEffect, useState } from 'react'
import { Icon } from './components/ui'
import type { Lead, LeadAction, LeadCategory } from './domain/lead'
import { formatRupeesCompact } from './format'
import {
  CATEGORY_DOT,
  CATEGORY_LABEL,
  HEALTH_DOT,
  HEALTH_LABEL,
  RATING_DOT,
} from './LeadDetail'
import { LEAD_ACTION_LABEL } from './LeadsList'
import { leadStore } from './store/leadStore'

const ICON_USERS =
  'M8 11a3 3 0 100-6 3 3 0 000 6zM3 20a5 5 0 0110 0M17 11a3 3 0 100-6 3 3 0 000 6zM13.2 14.2a5 5 0 016.8 5.8'
const ICON_BAR = 'M4 20V11M10 20V4M16 20v-8M3 20h18'
const ICON_TARGET =
  'M3 12a9 9 0 1018 0 9 9 0 10-18 0M7 12a5 5 0 1010 0 5 5 0 10-10 0M11 12a1 1 0 102 0 1 1 0 10-2 0'
const NEUTRAL_COLOR = '#c7d2cb'

const CATEGORY_COLOR: Record<LeadCategory, string> = {
  growth: 'var(--color-ipi-700)',
  operational: 'var(--color-mint-600)',
  developing: '#aebdb4',
}

const CARD_ACCENT = {
  category: 'var(--color-ipi-700)',
  unqualified: 'var(--color-amber-600)',
  certify: 'var(--color-ipi-900)',
  health: 'var(--color-mint-600)',
  process: 'var(--color-ipi-800)',
} as const

const STAGE_TAB_CLASS: Record<'lead' | LeadAction, string> = {
  lead: 'bg-white border border-hairline text-ipi-800',
  qualify: 'bg-sky-100 text-sky-700',
  quantify: 'bg-mint-100 text-mint-600',
  verify: 'bg-amber-100 text-amber-600',
  certify: 'bg-rose-500 text-white',
}

const STAGE_BADGE_CLASS: Record<LeadAction, string> = {
  qualify: 'bg-sky-100 text-sky-700',
  quantify: 'bg-mint-100 text-mint-600',
  verify: 'bg-amber-100 text-amber-600',
  certify: 'bg-rose-100 text-rose-600',
}

const STAGE_DEFS: { key: LeadAction; label: string }[] = [
  { key: 'qualify', label: 'Qualify' },
  { key: 'quantify', label: 'Quantify' },
  { key: 'verify', label: 'Verify' },
  { key: 'certify', label: 'Certify' },
]

const CARD_CLASS =
  'rounded-2xl border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(14,31,23,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(14,31,23,0.07)]'

interface DonutSegment {
  key: string
  label: string
  value: number
  color: string
}

/** Small uppercase card header with a colored accent dot — used across every dashboard card for a consistent premium look. */
function CardHeader({ accent, children }: { accent: string; children: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ background: accent }} />
      <span className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">{children}</span>
    </div>
  )
}

/** Lightweight SVG donut — no chart library — segments are clickable and dim when a sibling is selected. */
function Donut({
  segments,
  size = 176,
  thickness = 26,
  selected,
  onSelect,
  centerLabel,
  centerSublabel,
}: {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  selected: string | null
  onSelect: (key: string) => void
  centerLabel: string
  centerSublabel?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let cursor = 0

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="flex-none overflow-visible">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-hairline)" strokeWidth={thickness} />
      {total > 0 && (
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ filter: 'drop-shadow(0 1px 1.5px rgba(14,31,23,0.12))' }}>
          {segments.map((seg) => {
            if (seg.value <= 0) return null
            const frac = seg.value / total
            const dash = Math.max(frac * circumference - 2, 0)
            const gapStart = cursor
            cursor += frac * circumference
            const isDim = selected !== null && selected !== seg.key
            return (
              <circle
                key={seg.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeLinecap="round"
                strokeWidth={selected === seg.key ? thickness + 6 : thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-gapStart}
                className="cursor-pointer transition-all duration-150"
                style={{ opacity: isDim ? 0.3 : 1 }}
                onClick={() => onSelect(seg.key)}
              />
            )
          })}
        </g>
      )}
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" className="fill-ink font-data text-[22px] font-semibold">
        {centerLabel}
      </text>
      {centerSublabel && (
        <text
          x="50%"
          y="62%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-ipi-700/60 text-[9px] font-semibold uppercase tracking-wide"
        >
          {centerSublabel}
        </text>
      )}
    </svg>
  )
}

function DonutLegend({
  segments,
  total,
  selected,
  onSelect,
}: {
  segments: DonutSegment[]
  total: number
  selected: string | null
  onSelect: (key: string) => void
}) {
  return (
    <div className="flex flex-1 flex-col gap-1">
      {segments.map((seg) => {
        const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
        return (
          <button
            key={seg.key}
            type="button"
            onClick={() => onSelect(seg.key)}
            className={`flex flex-col gap-1 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
              selected === seg.key ? 'bg-ipi-50' : 'hover:bg-ipi-50/60'
            }`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-ipi-700/80">
                <span className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: seg.color }} />
                {seg.label}
              </span>
              <span className="font-data tabular-nums text-ink">
                {seg.value} <span className="text-ipi-700/40">({pct}%)</span>
              </span>
            </span>
            <span className="h-1 overflow-hidden rounded-full bg-ipi-50">
              <span className="block h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: seg.color }} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  sublabel,
  emphasis = false,
}: {
  icon: string
  label: string
  value: string
  sublabel?: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-[0_1px_2px_rgba(14,31,23,0.04)] transition-shadow hover:shadow-[0_4px_16px_rgba(14,31,23,0.09)] ${
        emphasis ? 'border-ipi-800 bg-ipi-900' : 'border-hairline bg-white'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
            emphasis ? 'bg-white/15 text-white' : 'bg-mint-100 text-mint-600'
          }`}
        >
          <Icon path={icon} />
        </span>
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${emphasis ? 'text-white/60' : 'text-ipi-700/60'}`}>
          {label}
        </span>
      </div>
      <div className={`font-data text-2xl font-semibold tabular-nums ${emphasis ? 'text-white' : 'text-ink'}`}>{value}</div>
      {sublabel && <div className={`mt-0.5 text-xs ${emphasis ? 'text-white/60' : 'text-ipi-700/60'}`}>{sublabel}</div>}
    </div>
  )
}

/**
 * Portfolio dashboard — LOA pipeline rolled up from every saved Lead. The
 * Transaction Process tabs and both donuts write into the same filter state
 * (stage + category), so any combination drives the table beneath them.
 */
export function Dashboard({ onOpenLead }: { onOpenLead: (lead: Lead) => void }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [stageFilter, setStageFilter] = useState<'all' | 'lead' | LeadAction>('all')
  const [categoryFilter, setCategoryFilter] = useState<LeadCategory | null>(null)

  useEffect(() => {
    leadStore.list().then(setLeads)
  }, [])

  if (leads.length === 0) {
    return (
      <div>
        <DashboardHero />
        <div className="rounded-2xl border border-dashed border-hairline p-10 text-center">
          <div className="text-sm font-medium text-ink">No leads yet</div>
          <div className="mt-1 text-sm text-ipi-700/60">Add a golf course under Leads to start seeing pipeline numbers here.</div>
        </div>
      </div>
    )
  }

  const existingCount = leads.filter((l) => l.customerType === 'existing').length
  const leadCount = leads.length - existingCount
  const notYetQualified = leads.filter((l) => l.action === 'qualify')

  const potentialTotal = leads.reduce((s, l) => s + l.potentialValue, 0)
  const actualTotal = leads.reduce((s, l) => s + l.actualValue, 0)
  const actualPct = potentialTotal > 0 ? Math.round((actualTotal / potentialTotal) * 100) : 0

  const certifyLeads = leads.filter((l) => l.action === 'certify')
  const certifyValue = certifyLeads.reduce((s, l) => s + l.potentialValue, 0)

  const stageStats = STAGE_DEFS.map((s) => {
    const rows = leads.filter((l) => l.action === s.key)
    return { ...s, count: rows.length, value: rows.reduce((sum, l) => sum + l.potentialValue, 0) }
  })

  function categoryBreakdown(rows: Lead[]): DonutSegment[] {
    const totals: Record<LeadCategory, number> = { growth: 0, operational: 0, developing: 0 }
    for (const l of rows) totals[l.category] += 1
    return (['growth', 'operational', 'developing'] as LeadCategory[]).map((c) => ({
      key: c,
      label: CATEGORY_LABEL[c],
      value: totals[c],
      color: CATEGORY_COLOR[c],
    }))
  }

  const certifySegments: DonutSegment[] = [
    { key: 'certify', label: 'At Certify', value: certifyLeads.length, color: CARD_ACCENT.certify },
    { key: 'rest', label: 'Earlier Stages', value: leads.length - certifyLeads.length, color: NEUTRAL_COLOR },
  ]

  const healthCounts = { on_track: 0, needs_attention: 0, stuck: 0 }
  for (const l of leads) healthCounts[l.health] += 1

  function toggleStage(key: 'lead' | LeadAction) {
    setStageFilter((cur) => (cur === key ? 'all' : key))
  }

  function handleCertifySelect(key: string) {
    if (key !== 'certify') {
      if (stageFilter === 'certify') setStageFilter('all')
      return
    }
    toggleStage('certify')
  }

  /** Customer Category donut — combines with whatever stage is already selected, if any. */
  function toggleCategoryOnly(key: LeadCategory) {
    setCategoryFilter((cur) => (cur === key ? null : key))
  }

  /** "Not yet qualified" donut owns the stage filter too, so a slice scopes the table to the Lead stage. */
  function toggleUnqualified(key: LeadCategory) {
    if (categoryFilter === key && stageFilter === 'lead') {
      setCategoryFilter(null)
      setStageFilter('all')
    } else {
      setCategoryFilter(key)
      setStageFilter('lead')
    }
  }

  function clearFilters() {
    setStageFilter('all')
    setCategoryFilter(null)
  }

  let filtered = leads
  if (stageFilter === 'lead') filtered = filtered.filter((l) => l.action === 'qualify')
  else if (stageFilter !== 'all') filtered = filtered.filter((l) => l.action === stageFilter)
  if (categoryFilter) filtered = filtered.filter((l) => l.category === categoryFilter)

  const filtersActive = stageFilter !== 'all' || categoryFilter !== null
  const sorted = [...filtered].sort((a, b) => b.potentialValue - a.potentialValue)
  const visibleRows = filtersActive ? sorted : sorted.slice(0, 4)

  const unqualifiedSelected = stageFilter === 'lead' ? categoryFilter : null
  const certifySelected = stageFilter === 'certify' ? 'certify' : null

  return (
    <div>
      <DashboardHero />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <StatTile icon={ICON_USERS} label="Total Customers" value={String(leads.length)} sublabel={`${leadCount} Leads · ${existingCount} Existing`} />
            <StatTile icon={ICON_BAR} label="Total Potential Opportunity" value={formatRupeesCompact(potentialTotal)} />
          </div>

          <div className={CARD_CLASS}>
            <CardHeader accent={CARD_ACCENT.process}>Transaction Process (LOA) — click a stage</CardHeader>
            <div className="overflow-x-auto pb-1">
              <div className="flex items-stretch gap-1.5">
                {(
                  [{ key: 'lead' as const, label: 'Lead', hint: 'Identify & capture' }, ...stageStats] as {
                    key: 'lead' | LeadAction
                    label: string
                    hint?: string
                    count?: number
                    value?: number
                  }[]
                ).flatMap((s, i, all) => {
                  const button = (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => toggleStage(s.key)}
                      className={`min-w-[108px] flex-1 rounded-xl px-3 py-3 text-left transition-all ${STAGE_TAB_CLASS[s.key]} ${
                        stageFilter === s.key ? 'shadow-md ring-2 ring-ipi-600 ring-offset-1 ring-offset-ipi-50' : 'hover:brightness-95'
                      }`}
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{s.label}</div>
                      {s.key === 'lead' ? (
                        <div className="mt-2.5 text-[11px] leading-tight opacity-70">{s.hint}</div>
                      ) : (
                        <>
                          <div className="mt-1 font-data text-xl font-semibold tabular-nums">{s.count}</div>
                          <div className="text-[11px] opacity-70">{formatRupeesCompact(s.value ?? 0)}</div>
                        </>
                      )}
                    </button>
                  )
                  if (i === all.length - 1) return [button]
                  return [
                    button,
                    <div key={`${s.key}-sep`} className="flex flex-none items-center text-ipi-700/25">
                      ›
                    </div>,
                  ]
                })}
              </div>
            </div>
            <div className="mt-2.5 text-[11px] text-ipi-700/45">
              → SAP (Accounts) owns final invoicing &amp; collections from Certify onward.
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_1px_2px_rgba(14,31,23,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2.5">
              <div className="text-xs text-ipi-700/60">
                Showing <span className="font-medium text-ink">{visibleRows.length}</span>
                {filtersActive ? ' matching opportunities' : ` of ${leads.length} — top by potential opportunity`}
              </div>
              {filtersActive && (
                <button type="button" onClick={clearFilters} className="text-xs font-medium text-ipi-600 hover:text-ipi-800">
                  Clear filters ×
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-xs">
                <thead>
                  <tr className="bg-ipi-50/60 text-left text-[10px] uppercase tracking-wide text-ipi-700/50">
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Customer / Project</th>
                    <th className="px-3 py-2 font-medium">Category</th>
                    <th className="px-3 py-2 text-right font-medium">Potential</th>
                    <th className="px-3 py-2 text-right font-medium">Actual</th>
                    <th className="px-3 py-2 text-center font-medium">Ability</th>
                    <th className="px-3 py-2 text-center font-medium">Maint.</th>
                    <th className="px-3 py-2 font-medium">Stage</th>
                    <th className="px-3 py-2 text-center font-medium">Health</th>
                    <th className="px-3 py-2 font-medium">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((lead, i) => (
                    <tr
                      key={lead.id}
                      onClick={() => onOpenLead(lead)}
                      className="cursor-pointer border-t border-hairline transition-colors hover:bg-ipi-50/60"
                    >
                      <td className="px-3 py-2 text-ipi-700/50">{i + 1}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5 font-medium text-ink">
                          <span
                            className={`h-2 w-2 flex-none rounded-full ${lead.customerType === 'existing' ? 'bg-mint-600' : 'bg-ipi-600'}`}
                          />
                          {lead.courseName || 'Untitled'}
                        </div>
                        {lead.nextAction && <div className="mt-0.5 text-[11px] text-ipi-700/50">{lead.nextAction}</div>}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5 text-ipi-700/70">
                          <span className={`h-2 w-2 flex-none rounded-full ${CATEGORY_DOT[lead.category]}`} />
                          {CATEGORY_LABEL[lead.category]}
                        </span>
                      </td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ink">{formatRupeesCompact(lead.potentialValue)}</td>
                      <td className="font-data px-3 py-2 text-right tabular-nums text-ipi-700/70">
                        {lead.actualValue > 0 ? formatRupeesCompact(lead.actualValue) : '—'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span title={lead.abilityToPay} className={`inline-block h-2.5 w-2.5 rounded-full ${RATING_DOT[lead.abilityToPay]}`} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          title={lead.maintenanceCommitment}
                          className={`inline-block h-2.5 w-2.5 rounded-full ${RATING_DOT[lead.maintenanceCommitment]}`}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STAGE_BADGE_CLASS[lead.action]}`}
                        >
                          {LEAD_ACTION_LABEL[lead.action]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span title={HEALTH_LABEL[lead.health]} className={`inline-block h-2.5 w-2.5 rounded-full ${HEALTH_DOT[lead.health]}`} />
                      </td>
                      <td className="px-3 py-2 text-ipi-700/60">
                        {lead.targetDate ? new Date(lead.targetDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <StatTile
            icon={ICON_TARGET}
            label="Total Actual Opportunity"
            value={formatRupeesCompact(actualTotal)}
            sublabel={`${actualPct}% of potential`}
          />

          <div className={CARD_CLASS}>
            <CardHeader accent={CARD_ACCENT.category}>Customer Category — All Opportunities</CardHeader>
            <div className="flex items-center gap-3">
              <Donut
                segments={categoryBreakdown(leads)}
                size={112}
                thickness={16}
                selected={categoryFilter}
                onSelect={(k) => toggleCategoryOnly(k as LeadCategory)}
                centerLabel={String(leads.length)}
                centerSublabel="Total"
              />
              <DonutLegend
                segments={categoryBreakdown(leads)}
                total={leads.length}
                selected={categoryFilter}
                onSelect={(k) => toggleCategoryOnly(k as LeadCategory)}
              />
            </div>
          </div>

          <div className={CARD_CLASS}>
            <CardHeader accent={CARD_ACCENT.unqualified}>Leads — Not Yet Qualified</CardHeader>
            <div className="flex items-center gap-3">
              <Donut
                segments={categoryBreakdown(notYetQualified)}
                size={112}
                thickness={16}
                selected={unqualifiedSelected}
                onSelect={(k) => toggleUnqualified(k as LeadCategory)}
                centerLabel={String(notYetQualified.length)}
                centerSublabel="Unqualified"
              />
              <DonutLegend
                segments={categoryBreakdown(notYetQualified)}
                total={notYetQualified.length}
                selected={unqualifiedSelected}
                onSelect={(k) => toggleUnqualified(k as LeadCategory)}
              />
            </div>
          </div>

          <div className={CARD_CLASS}>
            <CardHeader accent={CARD_ACCENT.certify}>At Certify</CardHeader>
            <div className="flex items-center gap-3">
              <Donut
                segments={certifySegments}
                size={112}
                thickness={16}
                selected={certifySelected}
                onSelect={handleCertifySelect}
                centerLabel={String(certifyLeads.length)}
                centerSublabel="Certify"
              />
              <DonutLegend segments={certifySegments} total={leads.length} selected={certifySelected} onSelect={handleCertifySelect} />
            </div>
            <div className="mt-1 text-center text-[11px] text-ipi-700/50">{formatRupeesCompact(certifyValue)} verified value</div>
          </div>

          <div className={CARD_CLASS}>
            <CardHeader accent={CARD_ACCENT.health}>Opportunity Health (All)</CardHeader>
            <div className="mb-2 font-data text-3xl font-semibold tabular-nums text-ink">{leads.length}</div>
            <div className="flex flex-col gap-2">
              {(
                [
                  { key: 'on_track', dot: HEALTH_DOT.on_track, count: healthCounts.on_track },
                  { key: 'needs_attention', dot: HEALTH_DOT.needs_attention, count: healthCounts.needs_attention },
                  { key: 'stuck', dot: HEALTH_DOT.stuck, count: healthCounts.stuck },
                ] as const
              ).map((h) => {
                const pct = leads.length > 0 ? Math.round((h.count / leads.length) * 100) : 0
                return (
                  <div key={h.key} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 flex-none rounded-full ${h.dot}`} />
                      <span className="flex-1 text-xs text-ipi-700/70">{HEALTH_LABEL[h.key]}</span>
                      <span className="font-data text-sm font-semibold tabular-nums text-ink">{h.count}</span>
                      <span className="w-9 text-right text-[11px] text-ipi-700/40">{pct}%</span>
                    </div>
                    <span className="h-1 overflow-hidden rounded-full bg-ipi-50">
                      <span className={`block h-full rounded-full transition-all duration-300 ${h.dot}`} style={{ width: `${pct}%` }} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardHero() {
  const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  return (
    <div className="mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-ipi-950 via-ipi-900 to-ipi-800 px-6 py-5 text-white shadow-[0_8px_24px_rgba(10,42,30,0.28)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">Lead Opportunity Action</div>
          <div className="mt-0.5 text-xl font-semibold">Dashboard</div>
          <div className="mt-1 text-sm text-white/60">From Lead to Certify. Focused opportunities. Stronger relationships.</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-wide text-white/40">Today</div>
          <div className="text-sm font-medium text-white/85">{today}</div>
        </div>
      </div>
    </div>
  )
}
