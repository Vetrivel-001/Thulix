import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Flame, Zap, Award, Users, Wallet, Star, MousePointerClick, Filter, CalendarClock, Handshake } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip, CartesianGrid } from 'recharts'
import { STUDENT_FEATURES, TRAINER_FEATURES, RECRUITER_FEATURES } from '../../lib/data'
import { Icon } from '../../lib/icons'

gsap.registerPlugin(ScrollTrigger)

const weekly = [
  { w: 'W1', v: 32 }, { w: 'W2', v: 45 }, { w: 'W3', v: 41 }, { w: 'W4', v: 58 },
  { w: 'W5', v: 66 }, { w: 'W6', v: 63 }, { w: 'W7', v: 78 }, { w: 'W8', v: 91 },
]

const revenue = [
  { m: 'Jan', v: 2.1 }, { m: 'Feb', v: 3.4 }, { m: 'Mar', v: 2.8 }, { m: 'Apr', v: 4.6 },
  { m: 'May', v: 5.1 }, { m: 'Jun', v: 6.4 }, { m: 'Jul', v: 7.2 }, { m: 'Aug', v: 8.9 },
]

const pipeline = [
  { stage: 'Applied', value: 340, color: '#059669', pct: 100 },
  { stage: 'Screened', value: 182, color: '#10B981', pct: 53 },
  { stage: 'Interview', value: 74, color: '#06B6D4', pct: 22 },
  { stage: 'Offered', value: 28, color: '#34D399', pct: 8 },
]

const hiringTrend = [
  { m: 'Jan', hired: 4, pipeline: 18 }, { m: 'Feb', hired: 6, pipeline: 24 },
  { m: 'Mar', hired: 5, pipeline: 20 }, { m: 'Apr', hired: 9, pipeline: 32 },
  { m: 'May', hired: 8, pipeline: 28 }, { m: 'Jun', hired: 12, pipeline: 38 },
  { m: 'Jul', hired: 11, pipeline: 35 }, { m: 'Aug', hired: 15, pipeline: 45 },
]

const candidates = [
  { name: 'Ananya S.', skill: 'React', match: 94, status: 'Interview', c: '#059669' },
  { name: 'Rohan M.', skill: 'Data Science', match: 91, status: 'Review', c: '#10B981' },
  { name: 'Priya K.', skill: 'AI/ML', match: 89, status: 'Shortlisted', c: '#06B6D4' },
  { name: 'Arun T.', skill: 'Full Stack', match: 86, status: 'New', c: '#34D399' },
]

const skillLevels = [
  { skill: 'React', level: 94, color: '#10B981' },
  { skill: 'JavaScript', level: 88, color: '#059669' },
  { skill: 'CSS/Tailwind', level: 82, color: '#06B6D4' },
  { skill: 'Node.js', level: 71, color: '#34D399' },
]

function PanelShell({ id, title, gradient, kicker, text, children }) {
  return (
    <section className="flex h-screen w-screen shrink-0 items-center px-5 lg:px-8" id={id} aria-label={title}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-animate className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-snow">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: gradient[0] }} aria-hidden="true" />
            {kicker}
          </span>
          <h2 className="mt-5 font-heading text-4xl font-bold leading-[1.1] text-snow sm:text-5xl xl:text-6xl">
            <span className="text-snow">{title.split(' ')[0]}</span>{' '}
            <span className="text-gradient-animate">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed text-mist sm:text-lg">{text}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {children}
          </div>
        </div>
        <div data-animate>{gradient && <RoleDashboard gradient={gradient} />}</div>
      </div>
    </section>
  )
}

function RoleDashboard({ gradient }) {
  return (
    <div className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-2xl border border-border glass p-5 shadow-xl shadow-black/20 sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-[0.06]" style={{ background: gradient[0] }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full blur-2xl opacity-[0.04]" style={{ background: gradient[1] }} aria-hidden="true" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: `linear-gradient(120deg, ${gradient[0]}, ${gradient[1]})` }}>
            <Icon name={gradient[2]} size={18} />
          </span>
          <div>
            <p className="font-heading text-sm font-bold text-snow">{gradient[3]}</p>
            <p className="text-[11px] text-mist">{gradient[4]}</p>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[10px] font-semibold text-mint">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint" aria-hidden="true" /> LIVE
        </span>
      </div>
      <div className="mt-5">{gradient[5]}</div>
    </div>
  )
}

const STUDENT_DASHBOARD = {
  gradient: ['#059669', '#10B981', 'dashboard', 'Student Workspace', 'ananya.s — Frontend track', (
    <>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekly} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="w" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              cursor={{ stroke: 'rgba(5,150,105,0.2)' }}
              contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 12, fontSize: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fill="url(#sFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: 'Streak', value: '42d', color: '#F59E0B' },
          { icon: Zap, label: 'XP', value: '12.4k', color: '#059669' },
          { icon: Award, label: 'Badges', value: '8', color: '#10B981' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-abyss-2 p-3 text-center">
            <I size={16} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-base font-bold text-snow">{value}</p>
            <p className="text-[10px] text-mist">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-mist">Skill Progress</p>
        <div className="space-y-2">
          {skillLevels.map(({ skill, level, color }) => (
            <div key={skill} className="flex items-center gap-2.5">
              <span className="w-16 text-[10px] text-mist">{skill}</span>
              <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-abyss-3">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                />
              </div>
              <span className="w-7 text-right text-[10px] font-semibold" style={{ color }}>{level}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          { text: 'Advanced React — on track', dot: 'bg-mint' },
          { text: 'Portfolio project — reviewed A+', dot: 'bg-electric' },
          { text: 'Mock interview — scheduled Fri', dot: 'bg-golden' },
        ].map(({ text, dot }) => (
          <div key={text} className="flex items-center gap-2.5 rounded-xl border border-border bg-abyss-2 px-3 py-2.5">
            <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
            <p className="text-xs text-snow">{text}</p>
          </div>
        ))}
      </div>
    </>
  )],
}

const TRAINER_DASHBOARD = {
  gradient: ['#10B981', '#06B6D4', 'presentation', 'Trainer Studio', 'arun.t — React Academy', (
    <>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenue} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis hide />
            <Bar dataKey="v" radius={[6, 6, 0, 0]}>
              {revenue.map((_, i) => (
                <Cell key={i} fill={i % 2 ? '#10B981' : '#06B6D4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Students', value: '2.4k', color: '#059669' },
          { icon: Wallet, label: 'Revenue', value: '$18k', color: '#10B981' },
          { icon: Star, label: 'Rating', value: '4.9', color: '#F59E0B' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-abyss-2 p-3 text-center">
            <I size={16} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-base font-bold text-snow">{value}</p>
            <p className="text-[10px] text-mist">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {['React Advanced — 92% completion', 'Live class — 340 attending tonight', 'New quiz — auto-published by AI'].map((t) => (
          <div key={t} className="flex items-center gap-2.5 rounded-xl border border-border bg-abyss-2 px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-electric" aria-hidden="true" />
            <p className="text-xs text-snow">{t}</p>
          </div>
        ))}
      </div>
    </>
  )],
}

const RECRUITER_DASHBOARD = {
  gradient: ['#06B6D4', '#10B981', 'recruiter', 'Recruiter Console', 'talent@northwind.co', (
    <>
      <div className="mb-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-mist">Hiring Pipeline</p>
        <div className="space-y-2">
          {pipeline.map((d, i) => (
            <div key={d.stage} className="flex items-center gap-2.5">
              <span className="w-16 text-[10px] text-mist">{d.stage}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded-md bg-abyss-3">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-md flex items-center justify-end pr-2"
                  style={{ background: `linear-gradient(90deg, ${d.color}30, ${d.color})` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${d.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.12 }}
                >
                  <span className="text-[9px] font-bold text-white">{d.value}</span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-28 w-full">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-mist">Hiring Trend</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hiringTrend} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="hHired" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="hPipeline" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              cursor={{ stroke: 'rgba(6,182,212,0.2)' }}
              contentStyle={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 11, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area type="monotone" dataKey="pipeline" stroke="#06B6D4" strokeWidth={1.5} fill="url(#hPipeline)" />
            <Area type="monotone" dataKey="hired" stroke="#10B981" strokeWidth={2} fill="url(#hHired)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: Filter, label: 'Open roles', value: '12', color: '#059669' },
          { icon: CalendarClock, label: 'Interviews', value: '28', color: '#10B981' },
          { icon: Handshake, label: 'Hired', value: '9', color: '#06B6D4' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-abyss-2 p-2.5 text-center">
            <I size={14} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-sm font-bold text-snow">{value}</p>
            <p className="text-[9px] text-mist">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 space-y-1.5">
        {candidates.map((c) => (
          <div key={c.name} className="flex items-center gap-2.5 rounded-xl border border-border bg-abyss-2 px-3 py-2">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: c.c }}>
              {c.name.split(' ').map((w) => w[0]).join('')}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-[11px] font-semibold text-snow">{c.name}</p>
                <span className="text-[9px] font-bold text-mint">{c.match}%</span>
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-[9px] text-mist">{c.skill}</span>
                <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${
                  c.status === 'Interview' ? 'bg-mint/15 text-mint' :
                  c.status === 'Shortlisted' ? 'bg-electric/15 text-electric' :
                  c.status === 'Review' ? 'bg-golden/15 text-golden' :
                  'bg-abyss-3 text-mist'
                }`}>{c.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )],
}

const ROLES = [
  { ...STUDENT_DASHBOARD, id: 'student', kicker: 'For Students', title: 'Your Personal Launchpad', text: 'AI-crafted roadmaps, a live dashboard, projects that prove skills and a portfolio that sells you before the interview even starts.', features: STUDENT_FEATURES },
  { ...TRAINER_DASHBOARD, id: 'trainer', kicker: 'For Trainers', title: 'Teach. Inspire. Earn.', text: 'A complete studio to create courses, run live classes and mentor - with revenue analytics and AI that helps your students succeed.', features: TRAINER_FEATURES },
  { ...RECRUITER_DASHBOARD, id: 'recruiter', kicker: 'For Recruiters', title: 'Hire Proven Talent, Not Keywords', text: 'Discover verified candidates with real projects, filter by demonstrated skill, schedule interviews and manage offers - all in one console.', features: RECRUITER_FEATURES },
]

function Chip({ label, color }) {
  return (
    <span className="rounded-full border border-border bg-abyss-3/[0.8] px-3 py-1.5 text-xs font-medium text-snow transition-colors duration-300 hover:border-electric/20 hover:bg-abyss-3">
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  )
}

export default function ExperienceScroll() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    mm.add('(min-width: 1024px)', () => {
      const track = trackRef.current
      const ctx = gsap.context(() => {
        if (prefersReduced) return

        const getDist = () => track.scrollWidth - window.innerWidth

        const tween = gsap.to(track, {
          x: () => -getDist(),
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${getDist()}`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const panels = track.querySelectorAll('[data-panel]')
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll('[data-animate]'),
            { opacity: 0, y: 70, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: 'left 70%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        })
      }, sectionRef)
      return () => ctx.revert()
    })

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)

    return () => {
      mm.revert()
      window.removeEventListener('load', onLoad)
      clearTimeout(t)
    }
  }, [])

  return (
    <section id="careers" ref={sectionRef} className="relative overflow-hidden bg-abyss-2" aria-label="Experience by role">
      <div ref={trackRef} className="flex w-max">
        <section data-panel className="flex h-screen w-screen shrink-0 items-center px-5 lg:px-8" aria-label="Introduction">
          <div className="mx-auto w-full max-w-7xl">
            <div data-animate className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-border glass px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-snow">
                <MousePointerClick size={13} className="text-electric" aria-hidden="true" />
                <span className="text-gradient">Keep Scrolling</span>
              </span>
              <h2 className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-snow sm:text-6xl xl:text-7xl">
                One Ecosystem.
                <br />
                <span className="text-gradient-animate">Three Perspectives.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Drag through the experience of every user on Thulix - and see how the same intelligence powers them all.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm text-mist">
                <span className="rounded-full border border-border bg-abyss-3/[0.8] px-4 py-2 shadow-sm">Swipe - explore</span>
              </div>
            </div>
          </div>
        </section>

        {ROLES.map((role) => (
          <PanelShell
            key={role.id}
            id={role.id}
            title={role.title}
            gradient={role.gradient}
            kicker={role.kicker}
            text={role.text}
          >
            {role.features.map((f) => (
              <Chip key={f.label} label={f.label} color={f.color} />
            ))}
          </PanelShell>
        ))}

        <section data-panel className="flex h-screen w-screen shrink-0 items-center px-5 lg:px-8" aria-label="Explore more">
          <div className="mx-auto w-full max-w-7xl">
            <div data-animate className="max-w-2xl rounded-2xl border border-border glass p-10 shadow-xl shadow-black/20 lg:p-14">
              <h3 className="font-heading text-4xl font-bold leading-tight text-snow sm:text-5xl">
                Ready to see it from <span className="text-gradient-animate">your seat?</span>
              </h3>
              <p className="mt-4 text-mist">Every role gets its own intelligent workspace - powered by the same AI engine.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#" onClick={(e) => e.preventDefault()} className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#059669,#10B981)] px-7 py-3.5 text-sm font-semibold text-white">
                  Create your workspace <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}
