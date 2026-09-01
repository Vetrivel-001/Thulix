import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CursorGlow from './components/layout/CursorGlow'
import ScrollProgress from './components/layout/ScrollProgress'
import SmoothScroll from './components/layout/SmoothScroll'
import ChatWidget from './components/layout/ChatWidget'
import Hero from './components/sections/Hero'
import Placeholder from './components/pages/Placeholder'
import { getLenis } from './lib/smooth-scroll'

// Auth pages
import Login from './pages/Login'
import GetStarted from './pages/GetStarted'
import LearnerRegister from './pages/LearnerRegister'
import TrainerRegister from './pages/TrainerRegister'
import RecruiterRegister from './pages/RecruiterRegister'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyPage from './pages/VerifyPage'
import ApprovalStatusPage from './pages/ApprovalStatusPage'
import Unauthorized from './pages/Unauthorized'
import AdminDashboard from './pages/AdminDashboard'
import DashboardPlaceholder from './components/auth/DashboardPlaceholder'
import { ProtectedRoute, RoleGuard, RequireLoggedIn } from './auth/guards'

const TrustLogos = lazy(() => import('./components/sections/TrustLogos'))
const Problem = lazy(() => import('./components/sections/Problem'))
const Ecosystem = lazy(() => import('./components/sections/Ecosystem'))
const ExperienceScroll = lazy(() => import('./components/sections/ExperienceScroll'))
const Journey = lazy(() => import('./components/sections/Journey'))
const AIAssistant = lazy(() => import('./components/sections/AIAssistant'))
const Features = lazy(() => import('./components/sections/Features'))
const SuccessStories = lazy(() => import('./components/sections/SuccessStories'))
const Stats = lazy(() => import('./components/sections/Stats'))
const About = lazy(() => import('./components/sections/About'))
const FAQ = lazy(() => import('./components/sections/FAQ'))
const FinalCTA = lazy(() => import('./components/sections/FinalCTA'))

function Loader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="loader" />
    </div>
  )
}

function ScrollManager() {
  const { pathname } = useLocation()
  useEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<Loader />}>
        <TrustLogos />
        <Problem />
        <Ecosystem />
        <ExperienceScroll />
        <Journey />
        <AIAssistant />
        <Features />
        <SuccessStories />
        <Stats />
        <About />
        <FAQ />
        <FinalCTA />
      </Suspense>
    </>
  )
}

// Routes that render the full standalone auth/dashboard shell (no Navbar/Footer/ChatWidget).
const STANDALONE_PATHS = [
  '/login',
  '/get-started',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-phone',
  '/unauthorized',
  '/learner',
  '/trainer',
  '/recruiter',
  '/admin',
]

function isStandalone(pathname) {
  return STANDALONE_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export default function App() {
  const location = useLocation()
  const standalone = isStandalone(location.pathname)

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      {!standalone && <ChatWidget />}
      <ScrollManager />
      {!standalone && <Navbar />}

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />

            {/* Auth routes */}
            <Route path="/login" element={<RequireLoggedIn><Login /></RequireLoggedIn>} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="/register/learner" element={<LearnerRegister />} />
            <Route path="/register/trainer" element={<TrainerRegister />} />
            <Route path="/register/recruiter" element={<RecruiterRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyPage />} />
            <Route path="/verify-phone" element={<VerifyPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Approval status pages (authenticated) */}
            <Route path="/trainer/pending" element={<ProtectedRoute><ApprovalStatusPage variant="pending" role="trainer" /></ProtectedRoute>} />
            <Route path="/trainer/rejected" element={<ProtectedRoute><ApprovalStatusPage variant="rejected" role="trainer" /></ProtectedRoute>} />
            <Route path="/recruiter/pending" element={<ProtectedRoute><ApprovalStatusPage variant="pending" role="recruiter" /></ProtectedRoute>} />
            <Route path="/recruiter/rejected" element={<ProtectedRoute><ApprovalStatusPage variant="rejected" role="recruiter" /></ProtectedRoute>} />

            {/* Role dashboards */}
            <Route
              path="/learner/dashboard"
              element={
                <RoleGuard role="learner">
                  <DashboardPlaceholder />
                </RoleGuard>
              }
            />
            <Route
              path="/trainer/dashboard"
              element={
                <RoleGuard role="trainer">
                  <DashboardPlaceholder />
                </RoleGuard>
              }
            />
            <Route
              path="/recruiter/dashboard"
              element={
                <RoleGuard role="recruiter">
                  <DashboardPlaceholder />
                </RoleGuard>
              }
            />

            {/* Admin dashboard */}
            <Route
              path="/admin/dashboard"
              element={
                <RoleGuard role="admin">
                  <AdminDashboard />
                </RoleGuard>
              }
            />

            {/* Catch-all for marketing pages only */}
            <Route path="/:page" element={<Placeholder />} />
            <Route path="*" element={<Placeholder />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!standalone && <Footer />}
    </>
  )
}
