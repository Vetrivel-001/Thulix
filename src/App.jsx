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

export default function App() {
  const location = useLocation()

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <CursorGlow />
      <ChatWidget />
      <ScrollManager />
      <Navbar />

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
            <Route path="/:page" element={<Placeholder />} />
            <Route path="*" element={<Placeholder />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </>
  )
}
