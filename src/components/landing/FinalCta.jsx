import { ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import CtaLink from './CtaLink'
import Reveal from './Reveal'

export default function FinalCta() {
  const { user } = useAuth()

  return (
    <section aria-labelledby="cta-heading" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <Reveal className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 via-surface to-purple-500/10 px-6 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-20 left-1/2 size-64 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl"
        />
        <h2 id="cta-heading" className="relative text-3xl font-semibold tracking-tight text-base-color sm:text-4xl">
          Ready to start your streak?
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-muted-color">
          Create your account in under a minute to start tracking your progress today.
        </p>
        <div className="relative mt-8 flex justify-center">
          <CtaLink to={user ? '/app' : '/signup'}>
            {user ? 'Open the app' : 'Create your account'}
            <ArrowRight className="size-4" aria-hidden="true" />
          </CtaLink>
        </div>
      </Reveal>
    </section>
  )
}
