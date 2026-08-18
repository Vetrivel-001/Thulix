import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import MagneticButton from '../ui/MagneticButton'
import Particles from '../layout/Particles'

const copy = {
  login: { eyebrow: 'Welcome back', title: 'Sign in to SkillBridge', sub: 'Your intelligent workspace is waiting. Secure, seamless and ready when you are.' },
  'get-started': { eyebrow: 'Join the future', title: 'Create your free account', sub: 'Choose your role - learner, trainer or recruiter - and let AI build your workspace.' },
  platform: { eyebrow: 'The Platform', title: 'One ecosystem. Three superpowers.', sub: 'Learning, teaching and hiring converge into a single intelligent experience.' },
  features: { eyebrow: 'Features', title: 'Every tool you need to win', sub: '24 capabilities engineered to make your journey effortless.' },
  learning: { eyebrow: 'Learning', title: 'Paths that adapt to you', sub: 'AI-personalized roadmaps from first lesson to first offer.' },
  careers: { eyebrow: 'Careers', title: 'Skills become offers', sub: 'Verified talent, proven projects, real outcomes.' },
  'ai-assistant': { eyebrow: 'Aura', title: 'Your AI mentor, always online', sub: 'Resumes, roadmaps, mock interviews and guidance - 24/7.' },
  about: { eyebrow: 'About', title: 'Why we built SkillBridge', sub: 'Because education should end in opportunity - for everyone.' },
  contact: { eyebrow: 'Contact', title: "Let's build the future together", sub: 'Partnerships, press and hello@skillbridge.ai.' },
}

export default function Placeholder() {
  const { page = 'get-started' } = useParams()
  const c = copy[page] || copy['get-started']

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />
      <div aria-hidden="true" className="absolute inset-0">
        <div className="orb left-[-10%] top-[-5%] h-[460px] w-[460px] bg-electric/10" />
        <div className="orb right-[-10%] bottom-[-10%] h-[420px] w-[420px] bg-neon/8" />
      </div>
      <div className="absolute inset-0">
        <Particles density={0.00005} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto max-w-3xl px-5 text-center"
      >
        <span className="glass inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
          <Sparkles size={13} className="text-electric" aria-hidden="true" />
          <span className="text-gradient">{c.eyebrow}</span>
        </span>
        <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-snow sm:text-6xl">
          {c.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-mist">{c.sub}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton variant="primary">
            {page === 'login' ? 'Sign In' : 'Get Started Free'}
          </MagneticButton>
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-snow transition-all duration-300 hover:border-electric/40 hover:shadow-glow-electric"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true" />
            Back to Home
          </Link>
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.25em] text-mist">Full experience coming soon</p>
      </motion.div>
    </section>
  )
}
