import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShieldX, ArrowLeft } from 'lucide-react'
import AuthLayout from '../components/auth/AuthLayout'
import { EASE } from '../lib/animations'

export default function Unauthorized() {
  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center"
      >
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-3xl border border-blush/30 bg-blush/10 text-blush">
          <ShieldX size={40} aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">Access restricted</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-snow sm:text-4xl">Unauthorized</h1>
        <p className="mx-auto mt-4 max-w-md text-mist">
          You don't have permission to view this page. Your account needs to be signed in with the correct role to
          access the requested area.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(120deg,#06B6D4,#8B5CF6)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-neon/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neon/30"
          >
            <ArrowLeft size={16} /> Go to Sign In
          </Link>
        </div>
        <div className="mt-6 text-center text-sm text-mist">
          <Link to="/" className="font-semibold text-electric hover:text-snow">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}
