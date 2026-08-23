import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import { Icon } from '../../lib/icons'
import { PROBLEMS } from '../../lib/data'
import { fadeUp, stagger, viewportOnce } from '../../lib/animations'

function CyberCard({ accent, children }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -20
    const rotateY = ((x - centerX) / centerX) * 10
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg)'
  }, [])

  return (
    <div className="cyber-card-wrap" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="cyber-card" ref={cardRef}>
        <div className="cyber-card-glare" />
        <div className="cyber-lines"><span /><span /><span /><span /></div>
        <div className="cyber-corners"><span /><span /><span /><span /></div>
        <div className="cyber-scanline" />
        <div className="cyber-glow cyber-glow-tl" style={{ background: `radial-gradient(circle, ${accent}40, transparent 70%)` }} />
        <div className="cyber-glow cyber-glow-mr" style={{ background: `radial-gradient(circle, ${accent}30, transparent 70%)` }} />
        <div className="cyber-glow cyber-glow-bc" style={{ background: `radial-gradient(circle, ${accent}25, transparent 70%)` }} />
        <div className="cyber-particles"><span style={{ background: accent }} /><span style={{ background: accent }} /><span style={{ background: accent }} /><span style={{ background: accent }} /><span style={{ background: accent }} /><span style={{ background: accent }} /></div>
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Problem() {
  return (
    <section id="problem" className="relative overflow-hidden bg-abyss py-16 lg:py-20">
      <div aria-hidden="true" className="orb right-[-10%] top-[10%] h-[420px] w-[420px] bg-electric/10 blur-3xl" />
      <div aria-hidden="true" className="orb left-[-12%] bottom-[0%] h-[380px] w-[380px] bg-neon/10 blur-3xl" />
      <div aria-hidden="true" className="orb left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 bg-mint/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="The Problem"
          title="Education Should Lead"
          highlight="to Opportunity"
          description="Today the loop is broken. Knowledge is everywhere, yet the path from learning to earning remains fragmented across disconnected apps, spreadsheets and outdated portals."
        />
        <motion.div
          variants={stagger(0.16)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {PROBLEMS.map((p, i) => (
            <motion.div key={p.title} variants={fadeUp(0)} className={i === 1 ? 'md:translate-y-10' : ''}>
              <CyberCard accent={p.accent}>
                <div className="flex h-full flex-col p-8">
                  <div className="relative">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl border border-border"
                      style={{ background: `${p.accent}14`, color: p.accent }}
                    >
                      <Icon name={p.icon} size={26} />
                    </span>
                    <h3 className="mt-6 font-heading text-xl font-bold leading-snug text-snow">{p.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-mist">{p.body}</p>
                    <div className="mt-8 flex items-end gap-3 border-t border-border pt-5">
                      <span className="bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] bg-clip-text font-heading text-4xl font-bold text-transparent">
                        {p.stat}
                      </span>
                      <span className="pb-1.5 text-xs leading-tight text-mist">{p.statLabel}</span>
                    </div>
                  </div>
                </div>
              </CyberCard>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          variants={fadeUp(0, 0)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto mt-16 max-w-3xl text-center font-heading text-2xl font-semibold leading-snug sm:text-3xl"
        >
          <span className="text-snow">All three sides of the equation are </span>
          <span className="text-gradient-animate">stuck in the same broken loop</span>
          <span className="text-snow"> &mdash; Thulix closes it.</span>
        </motion.p>
      </div>
    </section>
  )
}
