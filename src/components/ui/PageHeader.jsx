export default function PageHeader({ title, subtitle = '', action = null }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-base-color">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-color">{subtitle}</p>}
      </div>
      {action}
    </header>
  )
}
