import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-ipi-100 bg-white p-4 ${className}`}>
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-2 text-sm text-ipi-700/70">{children}</div>
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
      className={`rounded-lg p-3 ${emphasis ? 'bg-ipi-100' : 'bg-ipi-50'}`}
    >
      <div className={`text-xs ${emphasis ? 'text-ipi-800' : 'text-ipi-700/70'}`}>{label}</div>
      <div className={`text-lg font-medium ${emphasis ? 'text-ipi-900' : 'text-ink'}`}>{value}</div>
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
      <span className="flex items-center gap-1 rounded-lg border border-ipi-100 bg-white px-2 py-1.5">
        <input
          type="number"
          value={Number.isNaN(value) ? '' : value}
          onChange={(e) => onChange(e.target.valueAsNumber)}
          className="w-full outline-none"
        />
        {suffix && <span className="text-xs text-ipi-700/50">{suffix}</span>}
      </span>
    </label>
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
      className="flex items-center gap-1.5 rounded-lg bg-ipi-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
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
      className="rounded-lg border border-ipi-100 px-4 py-2 text-sm font-medium text-ipi-900"
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
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  isCurrent || isDone
                    ? 'bg-ipi-900 text-white'
                    : 'border border-ipi-100 text-ipi-700/50'
                }`}
              >
                {step.index}
              </span>
              {step.label}
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px flex-1 bg-ipi-100" />
            )}
          </div>
        )
      })}
    </div>
  )
}
