import { useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Presentation, Briefcase, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout, { AuthBrand } from '../components/auth/AuthLayout'
import RoleCard from '../components/auth/RoleCard'
import { EASE } from '../lib/animations'

const ROLES = [
  {
    key: 'learner',
    title: 'Learner',
    desc: 'Learn skills, build your career path, get hired.',
    icon: GraduationCap,
    accent: '#8B5CF6',
    features: ['AI Roadmaps', 'Courses', 'Projects'],
    to: '/register/learner',
  },
  {
    key: 'trainer',
    title: 'Trainer',
    desc: 'Teach, earn and build your audience.',
    icon: Presentation,
    accent: '#06B6D4',
    features: ['Create Courses', 'Live Classes', 'Mentorship'],
    to: '/register/trainer',
  },
  {
    key: 'recruiter',
    title: 'Recruiter',
    desc: 'Discover and hire verified talent.',
    icon: Briefcase,
    accent: '#10B981',
    features: ['Post Jobs', 'Talent Search', 'Hiring'],
    to: '/register/recruiter',
  },
]

export default function GetStarted() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const continueFlow = () => {
    if (!selected) return
    navigate(selected.to)
  }

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <AuthBrand
          eyebrow="Join Thulix"
          title="Choose your role"
          sub="Thousands of learners, trainers and recruiters build their future on Thulix. Select how you'll use the platform."
        />

        <div className="space-y-3">
          {ROLES.map((r, i) => (
            <motion.div
              key={r.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.08 }}
            >
              <RoleCard
                title={r.title}
                desc={r.desc}
                icon={r.icon}
                accent={r.accent}
                features={r.features}
                selected={selected?.key === r.key}
                onSelect={() => setSelected(r)}
              />
            </motion.div>
          ))}
        </div>

        <div className="mt-7">
          <button
            type="button"
            onClick={continueFlow}
            disabled={!selected}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-mist">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-electric hover:text-snow">
            Sign In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
