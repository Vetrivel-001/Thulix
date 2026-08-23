import { motion } from 'framer-motion'
import { Target, Heart, Lightbulb, Users, Globe, Shield } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

const values = [
  { icon: Target, title: 'Mission-Driven', text: 'We believe every learner deserves a clear path from curiosity to career. Education should end in opportunity.', color: '#06B6D4', tags: ['Vision', 'Impact'] },
  { icon: Heart, title: 'People First', text: 'Built by educators, engineers and recruiters who lived the problem — not just observed it.', color: '#EC4899', tags: ['Culture', 'Empathy'] },
  { icon: Lightbulb, title: 'AI-Augmented', text: 'AI doesn\'t replace mentors — it amplifies them. Every feature is designed to multiply human potential.', color: '#F59E0B', tags: ['AI', 'Innovation'] },
  { icon: Users, title: 'Community-Led', text: 'Learners teach learners. Trainers build audiences. Recruiters find proof, not promises.', color: '#10B981', tags: ['Community', 'Growth'] },
  { icon: Globe, title: 'Global Access', text: 'Quality career guidance shouldn\'t depend on postcode. Thulix works anywhere, for anyone.', color: '#3B82F6', tags: ['Remote', 'Scale'] },
  { icon: Shield, title: 'Trust & Transparency', text: 'Verified skills, real projects, honest outcomes. No black boxes, no gatekeeping.', color: '#8B5CF6', tags: ['Security', 'Trust'] },
]

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '100K+', label: 'Users' },
  { value: '50+', label: 'Team' },
  { value: '12', label: 'Countries' },
]

function ValueCard({ v }) {
  return (
    <motion.div
      variants={fadeUp(0)}
      className="skew-card"
      style={{ '--card-glow': `${v.color}20`, '--card-accent': v.color, '--card-accent-2': `${v.color}80` }}
    >
      <div className="skew-card-dots">
        <span className="skew-card-dot skew-card-dot-red" />
        <span className="skew-card-dot skew-card-dot-yellow" />
        <span className="skew-card-dot skew-card-dot-green" />
      </div>
      <div className="skew-card-content">
        <div className="skew-card-header">
          <span>Thulix Values</span>
        </div>
        <span
          className="skew-card-icon"
          style={{ background: `${v.color}14`, color: v.color }}
        >
          <v.icon size={20} />
        </span>
        <h3 className="skew-card-title">{v.title}</h3>
        <p className="skew-card-text">{v.text}</p>
        <div className="skew-card-footer">
          {v.tags.map((tag) => (
            <span key={tag} className="skew-card-tag">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-abyss py-16 lg:py-24">
      <div aria-hidden="true" className="orb right-[-8%] top-[10%] h-[400px] w-[400px] bg-electric/6" />
      <div aria-hidden="true" className="orb left-[-10%] bottom-[15%] h-[350px] w-[350px] bg-neon/5" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="About Thulix"
          title="We're Building the Bridge"
          highlight="Between Skills & Opportunity"
          description="Thulix was born from a simple observation: the gap between learning and earning shouldn't exist. We're a team of educators, engineers and recruiters fixing the broken loop."
        />

        <motion.div
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((v) => (
            <ValueCard key={v.title} v={v} />
          ))}
        </motion.div>

        <motion.div
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-abyss-3/[0.65] p-8 sm:p-10 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp(0)} className="text-center">
              <p className="font-heading text-3xl font-bold text-gradient sm:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-sm text-mist">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp(0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-16 max-w-3xl mx-auto text-center"
        >
          <blockquote className="font-heading text-xl font-semibold leading-relaxed text-snow sm:text-2xl">
            "We don't just want to teach people skills — we want to make sure those skills <span className="text-gradient-animate">actually lead somewhere</span>."
          </blockquote>
          <p className="mt-4 text-sm text-mist">— Thulix founding team</p>
        </motion.div>
      </div>
    </section>
  )
}
