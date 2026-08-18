import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, PlayCircle, Sparkles, Star, TrendingUp, GraduationCap, Briefcase, Bot, CheckCircle2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts'
import MagneticButton from '../ui/MagneticButton'
import Particles from '../layout/Particles'

const headline = ['Build', 'Skills.', 'Grow', 'Careers.', 'Shape', 'the', 'Future.']

const sparkData = [
  { m: 'J', v: 32 }, { m: 'F', v: 42 }, { m: 'M', v: 38 }, { m: 'A', v: 55 },
  { m: 'M', v: 48 }, { m: 'J', v: 66 }, { m: 'J', v: 61 }, { m: 'A', v: 78 },
  { m: 'S', v: 74 }, { m: 'O', v: 88 }, { m: 'N', v: 84 }, { m: 'D', v: 98 },
]

function HeroVisual({ px, py }) {
  const p1 = useTransform(px, (v) => v * -22)
  const p2 = useTransform(py, (v) => v * -18)
  const q1 = useTransform(px, (v) => v * 26)
  const q2 = useTransform(py, (v) => v * 20)
  const r1 = useTransform(px, (v) => v * -12)
  const r2 = useTransform(py, (v) => v * 10)

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-xl lg:h-[520px]">
      <div aria-hidden="true" className="orb left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 bg-electric/10" />
      <motion.div
        style={{ x: p1, y: p2 }}
        className="glass-card absolute left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2 p-5 sm:w-[380px]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-mist">Good evening, Ananya</p>
            <p className="font-heading text-lg font-bold text-snow">Career Readiness</p>
          </div>
          <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-bold text-mint">87%</span>
        </div>
        <div className="mt-4 h-28 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                cursor={{ stroke: 'rgba(37,99,235,0.2)' }}
                contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                labelStyle={{ color: '#64748B' }}
              />
              <Area type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={2} fill="url(#heroFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-electric/10 text-electric">
              <Sparkles size={15} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-snow">AI Roadmap &middot; Frontend</p>
              <p className="text-[11px] text-mist">Next: React Hooks &middot; Day 42 of 90</p>
            </div>
          </div>
          <TrendingUp size={17} className="text-mint" aria-hidden="true" />
        </div>
      </motion.div>
      <motion.div
        style={{ x: q1, y: q2 }}
        className="glass-card absolute -right-2 top-8 w-[190px] animate-float p-4 sm:right-0"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon">
            <PlayCircle size={20} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-tight text-snow">Advanced React Mastery</p>
            <p className="text-[11px] text-mist">4.9 &middot; 12,400 learners</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2563EB,#4F46E5)]"
            initial={{ width: 0 }}
            animate={{ width: '64%' }}
            transition={{ duration: 1.4, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-mint font-medium">64% complete</p>
      </motion.div>
      <motion.div
        style={{ x: r1, y: r2 }}
        className="glass-card absolute -left-2 bottom-16 w-[200px] animate-float-slow p-4 sm:left-0"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint/10 text-mint">
            <Briefcase size={17} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-snow">Frontend Intern</p>
            <p className="text-[11px] text-mist">Microsoft &middot; 94% match</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-golden">
            <Star size={12} fill="currentColor" aria-hidden="true" /> Verified profile
          </span>
          <span className="text-[11px] font-bold text-electric">Apply &rarr;</span>
        </div>
      </motion.div>
      <motion.div
        style={{ x: q1, y: q2 }}
        className="glass-card absolute bottom-0 left-1/2 w-[240px] -translate-x-1/2 animate-float-slower p-4"
      >
        <div className="flex items-center gap-2">
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-neon/15 text-neon">
            <Bot size={16} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-mint" />
          </span>
          <p className="text-xs font-semibold text-snow">Aura &middot; AI Mentor</p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-mist">
          Great progress! You're 4 days ahead of your React roadmap
        </p>
        <div className="mt-2 flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <GraduationCap size={13} className="text-electric" aria-hidden="true" />
          <span className="text-[11px] text-snow">Prepare for your mock interview?</span>
          <CheckCircle2 size={13} className="ml-auto text-mint" aria-hidden="true" />
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 50, damping: 20 })
  const py = useSpring(my, { stiffness: 50, damping: 20 })

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[85vh] items-center overflow-hidden pt-28 pb-16 lg:pt-36"
    >
      <div aria-hidden="true" className="absolute inset-0 grid-bg" />
      <div aria-hidden="true" className="absolute inset-0">
        <div className="orb left-[-10%] top-[-5%] h-[480px] w-[480px] animate-aurora-a bg-electric/10" />
        <div className="orb right-[-8%] top-[20%] h-[420px] w-[420px] animate-aurora-b bg-neon/8" />
        <div className="orb bottom-[-15%] left-[25%] h-[460px] w-[460px] animate-aurora-c bg-mint/6" />
      </div>
      <div className="absolute inset-0">
        <Particles />
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-radial-fade" />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-mint opacity-75 animate-ring-pulse" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
            </span>
            AI-Powered Career &amp; Learning Ecosystem
          </motion.div>
          <h1 className="mt-7 font-heading text-5xl font-bold leading-[1.05] tracking-tight text-snow sm:text-6xl xl:text-7xl">
            {headline.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
                <motion.span
                  className={`inline-block ${i === 1 || i === 3 || i === 5 ? 'text-gradient-animate' : ''}`}
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.08 }}
                >
                  {word}
                  {i < headline.length - 1 ? '\u00A0' : ''}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg lg:mx-0"
          >
            The next-generation AI-powered ecosystem where learning, mentoring, career development, and hiring come together in{' '}
            <span className="font-semibold text-snow">one intelligent platform</span>.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <MagneticButton variant="primary">
              Start Learning <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </MagneticButton>
            <MagneticButton variant="ghost">
              <PlayCircle size={17} aria-hidden="true" /> Explore Platform
            </MagneticButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#2563EB', '#4F46E5', '#06B6D4', '#10B981'].map((c, i) => (
                  <span
                    key={i}
                    className="grid h-9 w-9 place-items-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                    style={{ background: c }}
                  >
                    {['R', 'P', 'K', 'D'][i]}
                  </span>
                ))}
              </div>
              <p className="text-xs text-mist">
                <span className="font-bold text-snow">100,000+</span> learners already onboard
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex text-golden" aria-label="5 star rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                ))}
              </div>
              <p className="text-xs text-mist">4.9/5 from 12k reviews</p>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        >
          <HeroVisual px={px} py={py} />
        </motion.div>
      </div>
      <motion.a
        href="#trust"
        aria-label="Scroll down"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('trust')?.scrollIntoView({ behavior: 'smooth' })
        }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border-2 border-gray-300 p-1.5">
          <motion.span
            className="h-2.5 w-1 rounded-full bg-[linear-gradient(180deg,#2563EB,#4F46E5)]"
            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.a>
    </section>
  )
}
