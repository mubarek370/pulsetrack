import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CtaLink from './CtaLink'
import HeroPreview from './HeroPreview'
import Reveal from './Reveal'

export default function Hero() {
  const { user } = useAuth()

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-0 size-96 rounded-full bg-purple-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-28 lg:pt-24">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500 dark:text-indigo-300">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Habits and workouts, finally in one place
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-base-color sm:text-5xl lg:text-6xl">
            Build habits that stick.{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Train with purpose.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-muted-color">
            PulseTrack turns daily check-ins, workout logs, and progress charts into one clean dashboard, so you
            can see your consistency compound.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to={user ? '/app' : '/signup'}>
              {user ? 'Open the app' : 'Get started free'}
              <ArrowRight className="size-4" aria-hidden="true" />
            </CtaLink>
            <CtaLink href="#features" variant="secondary">
              See features
            </CtaLink>
          </div>

          <p className="mt-4 text-sm text-subtle-color">
            {user ? 'Welcome back. Your streaks are waiting.' : 'No credit card. No install. Just open and go.'}
          </p>
        </Reveal>

        <Reveal delay={2}>
          <HeroPreview />
        </Reveal>
      </div>
    </section>
  )
}
