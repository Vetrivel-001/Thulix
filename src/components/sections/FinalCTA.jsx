import { motion } from 'framer-motion'
import { ArrowRight, Mail, User, Briefcase } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'

const ctaWords = ['The', 'Future', 'of', 'Learning', '&', 'Hiring', 'Starts', 'Here']

function PricingCard({ t, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.85, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 + i * 0.12 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-abyss-3/[0.65] p-4 backdrop-blur-sm transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-2 hover:shadow-lg hover:shadow-black/20 sm:p-6"
    >
      <div aria-hidden="true" className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25" style={{ background: t.color }} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${t.color}40, transparent)` }} />
      <div aria-hidden="true" className="card-shimmer" />
      <div className="relative" style={{ transform: 'translateZ(2px)' }}>
        <t.icon size={22} className={`mx-auto transition-all duration-500 group-hover:scale-125 ${t.color}`} aria-hidden="true" />
        <p className="mt-2.5 text-xs font-semibold text-snow">{t.label}</p>
        <p className="mt-1 text-[11px] text-mist">{t.value}</p>
      </div>
    </motion.div>
  )
}

export default function FinalCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-abyss py-16 lg:py-24">
      <div aria-hidden="true" className="orb left-[30%] top-[10%] h-[500px] w-[500px] bg-electric/6" />
      <div aria-hidden="true" className="orb right-[20%] bottom-[10%] h-[400px] w-[400px] bg-neon/6" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-abyss-3/[0.8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-mist"
          >
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-electric" />
            </span>
            Limited Early Access
          </motion.div>

          <h2 className="mt-8 font-heading text-4xl font-bold leading-tight text-snow sm:text-5xl xl:text-6xl" style={{ perspective: 800 }}>
            {ctaWords.map((word, i) => {
              const isGradient = word === 'Future' || word === 'Learning' || word === 'Hiring' || word === 'Here'
              return (
                <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                  <motion.span
                    className={`inline-block ${isGradient ? 'text-gradient-animate' : ''}`}
                    variants={{
                      hidden: { y: '110%', rotateX: -30, opacity: 0 },
                      visible: { y: 0, rotateX: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {word}{i < ctaWords.length - 1 ? '\u00A0' : ''}
                  </motion.span>
                </span>
              )
            })}
          </h2>

          <motion.p
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-mist sm:text-lg"
          >
            Join the first generation of learners, educators and companies building the bridge between skills and opportunities - with AI at the core.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <MagneticButton variant="primary">
              Create your Account <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </MagneticButton>
            <MagneticButton variant="ghost">
              View Live Demo
            </MagneticButton>
          </motion.div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center sm:gap-8">
            {[
              { icon: User, label: 'Students', color: 'text-electric', value: 'Free forever' },
              { icon: Briefcase, label: 'Recruiters', color: 'text-accent-blue', value: 'First 3 months free' },
              { icon: Mail, label: 'Enterprises', color: 'text-neon', value: 'Custom pricing' },
            ].map((t, i) => (
              <PricingCard key={t.label} t={t} i={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
