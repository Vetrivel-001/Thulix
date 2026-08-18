import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

export default function Counter({ value, suffix = '', duration = 2.2, className = '' }) {
  const ref = useRef(null)
  const { inView } = useInView({ threshold: 0.4, triggerOnce: true, rootMargin: '0px 0px -40px 0px' })

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          end={value}
          duration={duration}
          suffix={suffix}
          separator=","
          enableScrollSpy
          scrollSpyDelay={80}
        />
      ) : (
        <span>0{suffix}</span>
      )}
    </span>
  )
}
