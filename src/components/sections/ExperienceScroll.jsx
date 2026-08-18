import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Flame, Zap, Award, Users, Wallet, Star, MousePointerClick, Filter, CalendarClock, Handshake } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
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
  { stage: 'Applied', value: 340, color: '#2563EB' },
  { stage: 'Screened', value: 182, color: '#4F46E5' },
  { stage: 'Interviewed', value: 74, color: '#06B6D4' },
  { stage: 'Offered', value: 28, color: '#10B981' },
]

const candidates = [
  { name: 'Ananya S.', skill: 'React - 94% match', c: '#2563EB' },
  { name: 'Rohan M.', skill: 'Data - 91% match', c: '#4F46E5' },
  { name: 'Priya K.', skill: 'AI/ML - 89% match', c: '#06B6D4' },
]

function PanelShell({ id, title, gradient, kicker, text, children }) {
  return (
    <section className="flex h-screen w-screen shrink-0 items-center px-5 lg:px-8" id={id} aria-label={title}>
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-animate className="max-w-xl">
          <span className="glass inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
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
    <div
      className="glass-card relative mx-auto w-full max-w-[480px] p-5 sm:p-6"
      style={{ background: `linear-gradient(165deg, ${gradient[1]}08, rgba(255,255,255,0.95) 45%, ${gradient[0]}06)` }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-15" style={{ background: gradient[0] }} aria-hidden="true" />
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
  gradient: ['#2563EB', '#4F46E5', 'dashboard', 'Student Workspace', 'ananya.s - Frontend track', (
    <>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekly} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="w" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Area type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={2} fill="url(#sFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Flame, label: 'Streak', value: '42d', color: '#F59E0B' },
          { icon: Zap, label: 'XP', value: '12.4k', color: '#2563EB' },
          { icon: Award, label: 'Badges', value: '8', color: '#10B981' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
            <I size={16} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-base font-bold text-snow">{value}</p>
            <p className="text-[10px] text-mist">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {['Advanced React - on track', 'Portfolio project - reviewed A+', 'Mock interview - scheduled Fri'].map((t, i) => (
          <div key={t} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-mint' : i === 1 ? 'bg-electric' : 'bg-golden'}`} aria-hidden="true" />
            <p className="text-xs text-snow">{t}</p>
          </div>
        ))}
      </div>
    </>
  )],
}

const TRAINER_DASHBOARD = {
  gradient: ['#4F46E5', '#06B6D4', 'presentation', 'Trainer Studio', 'arun.t - React Academy', (
    <>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenue} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="m" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} interval={1} />
            <YAxis hide />
            <Bar dataKey="v" radius={[6, 6, 0, 0]}>
              {revenue.map((_, i) => (
                <Cell key={i} fill={i % 2 ? '#4F46E5' : '#06B6D4'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Students', value: '2.4k', color: '#2563EB' },
          { icon: Wallet, label: 'Revenue', value: '$18k', color: '#10B981' },
          { icon: Star, label: 'Rating', value: '4.9', color: '#F59E0B' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
            <I size={16} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-base font-bold text-snow">{value}</p>
            <p className="text-[10px] text-mist">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {['React Advanced - 92% completion', 'Live class - 340 attending tonight', 'New quiz - auto-published by AI'].map((t) => (
          <div key={t} className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="h-2 w-2 rounded-full bg-neon" aria-hidden="true" />
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
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={pipeline} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="stage" width={72} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={16}>
              {pipeline.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {[
          { icon: Filter, label: 'Open roles', value: '12', color: '#2563EB' },
          { icon: CalendarClock, label: 'Interviews', value: '28', color: '#4F46E5' },
          { icon: Handshake, label: 'Hired', value: '9', color: '#10B981' },
        ].map(({ icon: I, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center">
            <I size={16} className="mx-auto" style={{ color }} aria-hidden="true" />
            <p className="mt-1 font-heading text-base font-bold text-snow">{value}</p>
            <p className="text-[10px] text-mist">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {candidates.map((c) => (
          <div key={c.name} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: c.c }}>
              {c.name.split(' ').map((w) => w[0]).join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-snow">{c.name}</p>
              <p className="text-[10px] text-mist">{c.skill}</p>
            </div>
            <span className="ml-auto text-[10px] font-bold text-mint">Match</span>
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
    <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-snow transition-colors duration-300 hover:border-gray-300">
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
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        const panels = track.querySelectorAll('[data-panel]')
        panels.forEach((panel) => {
          gsap.fromTo(
            panel.querySelectorAll('[data-animate]'),
            { opacity: 0, y: 70 },
            {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: 'left 65%',
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
    <section id="careers" ref={sectionRef} className="relative overflow-hidden bg-gray-50" aria-label="Experience by role">
      <div ref={trackRef} className="flex w-max">
        <section data-panel className="flex h-screen w-screen shrink-0 items-center px-5 lg:px-8" aria-label="Introduction">
          <div className="mx-auto w-full max-w-7xl">
            <div data-animate className="max-w-3xl">
              <span className="glass inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em]">
                <MousePointerClick size={13} className="text-electric" aria-hidden="true" />
                <span className="text-gradient">Keep Scrolling</span>
              </span>
              <h2 className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-snow sm:text-6xl xl:text-7xl">
                One Ecosystem.
                <br />
                <span className="text-gradient-animate">Three Perspectives.</span>
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
                Drag through the experience of every user on SkillBridge AI - and see how the same intelligence powers them all.
              </p>
              <div className="mt-8 flex items-center gap-3 text-sm text-mist">
                <span className="glass rounded-full border border-gray-200 px-4 py-2">Swipe - explore</span>
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
            <div data-animate className="glass-card max-w-2xl p-10 lg:p-14">
              <h3 className="font-heading text-4xl font-bold leading-tight text-snow sm:text-5xl">
                Ready to see it from <span className="text-gradient-animate">your seat?</span>
              </h3>
              <p className="mt-4 text-mist">Every role gets its own intelligent workspace - powered by the same AI engine.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href="#" onClick={(e) => e.preventDefault()} className="group inline-flex items-center gap-2 rounded-full bg-[linear-gradient(120deg,#2563EB,#4F46E5)] px-7 py-3.5 text-sm font-semibold text-white">
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
