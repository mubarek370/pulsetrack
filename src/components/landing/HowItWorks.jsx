import Reveal from './Reveal'
import { LANDING_STEPS } from '../../data/landingContent'

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="scroll-mt-20 border-t border-base bg-surface py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400">How it works</p>
          <h2 id="how-heading" className="mt-2 text-3xl font-semibold tracking-tight text-base-color sm:text-4xl">
            Three steps to a better routine
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {LANDING_STEPS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={Math.min(i, 3)}>
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-sm font-semibold text-indigo-500 dark:text-indigo-300"
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-base-color">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-color">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
