import { Check } from 'lucide-react'
import Reveal from './Reveal'
import { LANDING_FEATURES } from '../../data/landingContent'

function FeatureCard({ icon: Icon, title, description, points, accent }) {
  return (
    <article className="h-full rounded-2xl border border-base bg-surface p-6 transition-colors duration-200 hover:border-strong">
      <span className={`flex size-11 items-center justify-center rounded-xl ${accent.bg} ${accent.text}`}>
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-base-color">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-color">{description}</p>
      <ul className="mt-5 space-y-2">
        {points.map((point) => (
          <li key={point} className="flex items-center gap-2 text-sm text-base-color">
            <Check className={`size-4 shrink-0 ${accent.text}`} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  )
}

export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400">Features</p>
          <h2 id="features-heading" className="mt-2 text-3xl font-semibold tracking-tight text-base-color sm:text-4xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="mt-4 text-muted-color">
            Four focused tools that work together, so tracking feels like a two-minute habit, not a chore.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {LANDING_FEATURES.map((feature, i) => (
            <li key={feature.id}>
              <Reveal delay={i % 2 === 0 ? 0 : 1} className="h-full">
                <FeatureCard {...feature} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
