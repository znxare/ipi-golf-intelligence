import { useState } from 'react'
import { Card, Field, PageHeader, PrimaryButton, SecondaryButton, SectionLabel, TextField } from './components/ui'
import {
  appendLeadActivity,
  type Lead,
  type LeadAction,
  type LeadCategory,
  type LeadCustomerType,
  type LeadHealth,
  type LeadRating,
} from './domain/lead'
import { LEAD_ACTION_LABEL } from './LeadsList'
import { leadStore } from './store'

const CUSTOMER_TYPE_OPTIONS: LeadCustomerType[] = ['non_existing', 'existing', 'new_build']
const CUSTOMER_TYPE_LABEL: Record<LeadCustomerType, string> = {
  non_existing: 'Non-existing',
  existing: 'Existing IPI',
  new_build: 'New build',
}
const ACTION_OPTIONS: LeadAction[] = ['qualify', 'quantify', 'verify', 'certify']

const CATEGORY_OPTIONS: LeadCategory[] = ['growth', 'operational', 'developing']
export const CATEGORY_LABEL: Record<LeadCategory, string> = {
  growth: 'Growth',
  operational: 'Operational',
  developing: 'Developing',
}
export const CATEGORY_DOT: Record<LeadCategory, string> = {
  growth: 'bg-ipi-700',
  operational: 'bg-mint-600',
  developing: 'bg-ipi-700/30',
}

const RATING_OPTIONS: LeadRating[] = ['green', 'yellow', 'red']
export const RATING_LABEL: Record<LeadRating, string> = { green: 'Good', yellow: 'Watch', red: 'At risk' }
export const RATING_DOT: Record<LeadRating, string> = {
  green: 'bg-mint-600',
  yellow: 'bg-amber-600',
  red: 'bg-risk-600',
}

const HEALTH_OPTIONS: LeadHealth[] = ['on_track', 'needs_attention', 'stuck']
export const HEALTH_LABEL: Record<LeadHealth, string> = {
  on_track: 'On track',
  needs_attention: 'Needs attention',
  stuck: 'Stuck',
}
export const HEALTH_DOT: Record<LeadHealth, string> = {
  on_track: 'bg-mint-600',
  needs_attention: 'bg-amber-600',
  stuck: 'bg-risk-600',
}

function RatingPicker<T extends string>({
  options,
  value,
  dot,
  label,
  onChange,
}: {
  options: T[]
  value: T
  dot: Record<T, string>
  label: Record<T, string>
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt ? 'bg-ipi-900 text-white' : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
          }`}
        >
          <span className={`h-2 w-2 flex-none rounded-full ${dot[opt]}`} />
          {label[opt]}
        </button>
      ))}
    </div>
  )
}

/** Update a lead's pipeline details and log free-text or stage-change updates to its own timeline. */
export function LeadDetail({ lead: initialLead, onBack }: { lead: Lead; onBack: () => void }) {
  const [lead, setLead] = useState(initialLead)
  const [note, setNote] = useState('')

  function persist(next: Lead) {
    setLead(next)
    leadStore.save(next)
  }

  function handleActionChange(action: LeadAction) {
    if (action === lead.action) return
    persist(appendLeadActivity({ ...lead, action }, `Moved to ${LEAD_ACTION_LABEL[action]}`))
  }

  function handleAddNote() {
    if (!note.trim()) return
    persist(appendLeadActivity(lead, note))
    setNote('')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Component 1 — Frozen Backend"
        title={lead.courseName || 'Untitled lead'}
        actions={<SecondaryButton onClick={onBack}>← Back to Leads</SecondaryButton>}
      />

      <SectionLabel>Lead details</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <TextField
          label="Golf course / account name"
          value={lead.courseName}
          onChange={(v) => persist({ ...lead, courseName: v })}
        />
        <TextField
          label="Contact name"
          value={lead.contactName}
          onChange={(v) => persist({ ...lead, contactName: v })}
        />
        <TextField label="Phone" value={lead.phone} onChange={(v) => persist({ ...lead, phone: v })} />
        <TextField label="Email" value={lead.email} onChange={(v) => persist({ ...lead, email: v })} />
        <TextField
          label="Source"
          value={lead.source}
          onChange={(v) => persist({ ...lead, source: v })}
          placeholder="Referral, cold call, event…"
        />
      </div>

      <SectionLabel>Customer type</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-2">
        {CUSTOMER_TYPE_OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => persist({ ...lead, customerType: c })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              lead.customerType === c
                ? 'bg-ipi-900 text-white'
                : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
            }`}
          >
            {CUSTOMER_TYPE_LABEL[c]}
          </button>
        ))}
      </div>

      <SectionLabel>Requirement &amp; competition</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <TextField
          label="Requirement"
          value={lead.requirement}
          onChange={(v) => persist({ ...lead, requirement: v })}
          placeholder="Toro, Elite/Yamaha…"
        />
        <TextField
          label="Competition"
          value={lead.competition}
          onChange={(v) => persist({ ...lead, competition: v })}
          placeholder="Competitor installed, or an offer already made…"
        />
      </div>

      <SectionLabel>Opportunity</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-4">
        {(
          [
            ['equipment', 'Equipment'],
            ['training', 'Training'],
            ['amc', 'AMC'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={lead.opportunity[key]}
              onChange={(e) => persist({ ...lead, opportunity: { ...lead.opportunity, [key]: e.target.checked } })}
              className="h-4 w-4 accent-[var(--color-ipi-600)]"
            />
            {label}
          </label>
        ))}
      </div>

      <SectionLabel>Pipeline scoring — feeds the Dashboard</SectionLabel>
      <div className="mb-5 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Customer category</div>
          <RatingPicker
            options={CATEGORY_OPTIONS}
            value={lead.category}
            dot={CATEGORY_DOT}
            label={CATEGORY_LABEL}
            onChange={(category) => persist({ ...lead, category })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Deal health</div>
          <RatingPicker
            options={HEALTH_OPTIONS}
            value={lead.health}
            dot={HEALTH_DOT}
            label={HEALTH_LABEL}
            onChange={(health) => persist({ ...lead, health })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Ability to pay</div>
          <RatingPicker
            options={RATING_OPTIONS}
            value={lead.abilityToPay}
            dot={RATING_DOT}
            label={RATING_LABEL}
            onChange={(abilityToPay) => persist({ ...lead, abilityToPay })}
          />
        </div>
        <div>
          <div className="mb-1.5 text-xs text-ipi-700/70">Commitment to maintain</div>
          <RatingPicker
            options={RATING_OPTIONS}
            value={lead.maintenanceCommitment}
            dot={RATING_DOT}
            label={RATING_LABEL}
            onChange={(maintenanceCommitment) => persist({ ...lead, maintenanceCommitment })}
          />
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <Field
          label="Potential opportunity (₹)"
          value={lead.potentialValue}
          onChange={(v) => persist({ ...lead, potentialValue: Number.isNaN(v) ? 0 : v })}
        />
        <Field
          label="Actual opportunity (₹)"
          value={lead.actualValue}
          onChange={(v) => persist({ ...lead, actualValue: Number.isNaN(v) ? 0 : v })}
        />
        <TextField label="Deal owner" value={lead.owner} onChange={(v) => persist({ ...lead, owner: v })} />
        <label className="block">
          <span className="mb-1 block text-xs text-ipi-700/70">Target date</span>
          <span className="flex items-center rounded-lg border border-hairline bg-white px-2 py-1.5 transition-colors focus-within:border-ipi-600">
            <input
              type="date"
              value={lead.targetDate}
              onChange={(e) => persist({ ...lead, targetDate: e.target.value })}
              className="w-full bg-transparent text-sm outline-none"
            />
          </span>
        </label>
        <div className="col-span-2">
          <TextField
            label="Next action"
            value={lead.nextAction}
            onChange={(v) => persist({ ...lead, nextAction: v })}
            placeholder="Draft SoW, Funding structure, Customer meeting…"
          />
        </div>
      </div>

      <SectionLabel>Action</SectionLabel>
      <div className="mb-5 flex flex-wrap gap-2">
        {ACTION_OPTIONS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => handleActionChange(a)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              lead.action === a
                ? 'bg-ipi-900 text-white'
                : 'border border-hairline text-ipi-700/70 hover:border-ipi-600'
            }`}
          >
            {LEAD_ACTION_LABEL[a]}
          </button>
        ))}
      </div>

      <SectionLabel>Notes</SectionLabel>
      <Card className="mb-5">
        <textarea
          value={lead.notes}
          onChange={(e) => persist({ ...lead, notes: e.target.value })}
          placeholder="General notes about this lead…"
          rows={3}
          className="w-full resize-none text-sm outline-none placeholder:text-ipi-700/30"
        />
      </Card>

      <SectionLabel>Timeline</SectionLabel>
      <div className="mb-3 flex gap-2">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
          placeholder="Log a call, email, or update…"
          className="flex-1 rounded-lg border border-hairline bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ipi-600"
        />
        <PrimaryButton onClick={handleAddNote}>Add</PrimaryButton>
      </div>

      <div className="mb-5">
        {[{ id: 'created', at: lead.createdAt, note: 'Lead created' }, ...lead.activity]
          .sort((a, b) => b.at.localeCompare(a.at))
          .map((entry, i, all) => (
            <div key={entry.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-ipi-600 ring-4 ring-ipi-100" />
                {i < all.length - 1 && <span className="w-px flex-1 bg-hairline" />}
              </div>
              <div className="min-w-0 flex-1 pb-4">
                <div className="text-xs text-ipi-700/60">{new Date(entry.at).toLocaleString()}</div>
                <div className="text-sm text-ink">{entry.note}</div>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-end">
        <SecondaryButton onClick={onBack}>← Back to Leads</SecondaryButton>
      </div>
    </div>
  )
}
