import LandingNav from '../components/landing/LandingNav'
import Hero from '../components/landing/Hero'
import StatsBand from '../components/landing/StatsBand'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import FinalCta from '../components/landing/FinalCta'
import LandingFooter from '../components/landing/LandingFooter'

export default function Landing() {
  return (
    <div className="min-h-dvh bg-base">
      <a
        href="#landing-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-indigo-500 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <LandingNav />

      <main id="landing-main">
        <Hero />
        <StatsBand />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>

      <LandingFooter />
    </div>
  )
}
