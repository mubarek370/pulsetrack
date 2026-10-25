import Reveal from './Reveal'
import { LANDING_FACTS } from '../../data/landingContent'

export default function StatsBand() {
  return (
    <section aria-label="PulseTrack at a glance" className="border-y border-base bg-surface">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        {LANDING_FACTS.map((fact, i) => (
          <li key={fact.label}>
            <Reveal delay={Math.min(i, 3)} className="text-center">
              <p className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
                {fact.value}
              </p>
              <p className="mt-1 text-sm text-muted-color">{fact.label}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
