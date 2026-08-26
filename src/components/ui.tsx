import type { ReactNode } from 'react'
import { formatEditableNumber, parseEditableNumber } from '../format'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-hairline bg-white p-4 shadow-[0_1px_2px_rgba(14,31,23,0.04)] ${className}`}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  sublabel,
  emphasis = false,
}: {
  label: string
  value: string
  sublabel?: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-lg p-3 ${
        emphasis
          ? 'border-l-2 border-ipi-600 bg-ipi-100'
          : 'border border-hairline bg-white'
      }`}
    >
      <div className={`text-xs ${emphasis ? 'text-ipi-800' : 'text-ipi-700/70'}`}>{label}</div>
      <div
        className={`font-data tabular-nums ${
          emphasis ? 'text-xl font-semibold text-ipi-950' : 'text-lg font-medium text-ink'
        }`}
      >
        {value}
      </div>
      {sublabel && <div className="mt-0.5 text-xs text-ipi-700/60">{sublabel}</div>}
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  suffix?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ipi-700/70">{label}</span>
      <span className="flex items-center gap-1 rounded-lg border border-hairline bg-white px-2 py-1.5 transition-colors focus-within:border-ipi-600">
        <input
          type="text"
          inputMode="decimal"
          value={formatEditableNumber(value)}
          onChange={(e) => onChange(parseEditableNumber(e.target.value))}
          className="font-data w-full tabular-nums outline-none"
        />
        {suffix && <span className="text-xs text-ipi-700/50">{suffix}</span>}
      </span>
    </label>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ipi-700/70">{label}</span>
      <span className="flex items-center rounded-lg border border-hairline bg-white px-2 py-1.5 transition-colors focus-within:border-ipi-600">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none placeholder:text-ipi-700/30"
        />
      </span>
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  options: number[]
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-ipi-700/70">{label}</span>
      <span className="flex items-center rounded-lg border border-hairline bg-white px-2 py-1.5 transition-colors focus-within:border-ipi-600">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="font-data w-full bg-transparent tabular-nums outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </span>
    </label>
  )
}

export function FixedField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="block">
      <span className="mb-1 block text-xs text-ipi-700/70">{label}</span>
      <span className="flex items-center justify-between rounded-lg border border-dashed border-hairline bg-ipi-50/60 px-2 py-1.5">
        <span className="font-data tabular-nums text-ipi-700/80">{value}</span>
        <span className="text-[10px] uppercase tracking-wide text-ipi-700/40">Fixed</span>
      </span>
    </div>
  )
}

export function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d={path} />
    </svg>
  )
}

export function StatBar({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-5 overflow-hidden rounded-xl border border-hairline">
      <div className="bg-ipi-900 py-2.5 text-center text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </div>
      <div className="flex flex-wrap bg-white">{children}</div>
    </div>
  )
}

export function BarStat({
  icon,
  label,
  value,
  sublabel,
  first = false,
  emphasis = false,
  editable,
  onClick,
}: {
  icon: string
  label: string
  value: string
  sublabel?: string
  first?: boolean
  emphasis?: boolean
  editable?: { value: number; onChange: (value: number) => void }
  onClick?: () => void
}) {
  const body = (
    <>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            emphasis ? 'bg-ipi-100 text-ipi-700' : 'bg-mint-100 text-mint-600'
          }`}
        >
          <Icon path={icon} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-ipi-700/60">{label}</span>
      </div>
      {editable ? (
        <input
          type="text"
          inputMode="decimal"
          value={formatEditableNumber(editable.value)}
          onChange={(e) => editable.onChange(parseEditableNumber(e.target.value))}
          className="font-data w-full border-b border-dashed border-hairline bg-transparent text-2xl font-semibold tabular-nums text-ink outline-none focus:border-ipi-600"
        />
      ) : (
        <div className="font-data text-2xl font-semibold tabular-nums text-ink">{value}</div>
      )}
      {sublabel && <div className="mt-0.5 text-xs text-ipi-700/50">{sublabel}</div>}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex-1 px-4 py-4 text-left transition-colors hover:bg-ipi-50 ${first ? '' : 'border-l border-hairline'} ${emphasis ? 'bg-ipi-50' : ''}`}
      >
        {body}
      </button>
    )
  }

  return (
    <div className={`flex-1 px-4 py-4 ${first ? '' : 'border-l border-hairline'} ${emphasis ? 'bg-ipi-50' : ''}`}>
      {body}
    </div>
  )
}

export function BarDivider({ symbol = '=' }: { symbol?: string }) {
  return (
    <div className="flex flex-none items-center justify-center border-l border-hairline px-4">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ipi-900 text-sm font-semibold text-white">
        {symbol}
      </span>
    </div>
  )
}

export function IntelRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-hairline py-2 text-sm last:border-b-0">
      <span className="text-ipi-700/70">{label}</span>
      <span className={`text-right font-medium text-ink ${mono ? 'font-data tabular-nums' : ''}`}>{value}</span>
    </div>
  )
}

export function PotentialActualRow({
  label,
  potential,
  actual,
}: {
  label: string
  potential: ReactNode
  actual: ReactNode
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-hairline py-2 text-sm last:border-b-0">
      <span className="text-ipi-700/70">{label}</span>
      <span className="font-data w-28 text-right font-medium tabular-nums text-ink">{potential}</span>
      <span className="font-data w-28 text-right font-medium tabular-nums text-ink">{actual}</span>
    </div>
  )
}

const BADGE_VARIANT: Record<'neutral' | 'positive' | 'muted' | 'warning', string> = {
  neutral: 'bg-ipi-50 text-ipi-700/70',
  positive: 'bg-ipi-100 text-ipi-900',
  muted: 'bg-ipi-50 text-ipi-700/50',
  warning: 'bg-amber-100 text-amber-600',
}

export function Badge({
  children,
  variant = 'neutral',
}: {
  children: ReactNode
  variant?: 'neutral' | 'positive' | 'muted' | 'warning'
}) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${BADGE_VARIANT[variant]}`}>
      {children}
    </span>
  )
}

export function PageHeader({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: string
  title: ReactNode
  actions?: ReactNode
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-ipi-700/50">
            {eyebrow}
          </div>
        )}
        <div className="text-base font-semibold text-ink">{title}</div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
        active ? 'bg-ipi-900 text-white' : 'text-ipi-700/70 hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 rounded-lg bg-ipi-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ipi-800 disabled:opacity-40 disabled:hover:bg-ipi-900"
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-ipi-900 transition-colors hover:border-ipi-600 hover:bg-ipi-50"
    >
      {children}
    </button>
  )
}

export function StepProgress({
  steps,
  currentStep,
}: {
  steps: { key: string; label: string; index: number }[]
  currentStep: string
}) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)
  return (
    <div className="mb-5 flex items-center">
      {steps.map((step, i) => {
        const isDone = i < currentIndex
        const isCurrent = i === currentIndex
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div
              className={`flex items-center gap-1.5 text-sm ${
                isCurrent || isDone ? 'font-medium text-ipi-900' : 'text-ipi-700/40'
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors ${
                  isCurrent
                    ? 'bg-ipi-900 text-white ring-2 ring-ipi-100'
                    : isDone
                      ? 'bg-ipi-600 text-white'
                      : 'border border-hairline text-ipi-700/50'
                }`}
              >
                {isDone ? '✓' : step.index}
              </span>
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-px flex-1 transition-colors ${isDone ? 'bg-ipi-600' : 'bg-hairline'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
