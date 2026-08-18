import { motion } from 'framer-motion'
import { ArrowRight, Rocket } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import Particles from '../layout/Particles'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />
      <div aria-hidden="true" className="absolute inset-0">
        <div className="orb left-[10%] top-[-20%] h-[520px] w-[520px] animate-aurora-a bg-electric/8" />
        <div className="orb right-[5%] top-[10%] h-[440px] w-[440px] animate-aurora-b bg-neon/6" />
        <div className="orb bottom-[-25%] left-[40%] h-[500px] w-[500px] animate-aurora-c bg-mint/5" />
      </div>
      <div className="absolute inset-0">
        <Particles density={0.00005} />
      </div>

      <motion.div
        variants={stagger(0.14)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative z-10 mx-auto max-w-4xl px-5 text-center lg:px-8"
      >
        <motion.div variants={fadeUp(0)}>
          <span className="glass inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
            <Rocket size={14} className="text-electric" aria-hidden="true" />
            <span className="text-gradient">Start today - free forever tier</span>
          </span>
        </motion.div>

        <motion.h2 variants={fadeUp(0.05)} className="mt-7 font-heading text-5xl font-bold leading-[1.05] text-snow sm:text-6xl lg:text-7xl">
          Ready to Build
          <br />
          <span className="text-gradient-animate">Your Future?</span>
        </motion.h2>

        <motion.p variants={fadeUp(0.1)} className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
          Start your journey today with SkillBridge AI. Learn real skills, prove them with projects, and let AI walk you into your next opportunity.
        </motion.p>

        <motion.div variants={fadeUp(0.15)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton variant="primary">
            Start Free <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton variant="ghost">Explore Platform</MagneticButton>
        </motion.div>

        <motion.p variants={fadeUp(0.2)} className="mt-8 text-xs text-mist">
          No credit card required &middot; Cancel anytime &middot; Loved by 100,000+ learners
        </motion.p>
      </motion.div>

      <svg className="divider-curve absolute bottom-0 left-0 text-white" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,60 C360,120 1080,0 1440,60 L1440,90 L0,90 Z" fill="currentColor" />
      </svg>
    </section>
  )
}
