import { SiGoogle, SiInfosys, SiTcs, SiAccenture } from 'react-icons/si'
import Marquee from '../ui/Marquee'
import { TRUST_COMPANIES } from '../../lib/data'

const logoMap = {
  Google: SiGoogle,
  Microsoft: null,
  Amazon: null,
  Infosys: SiInfosys,
  TCS: SiTcs,
  IBM: null,
  Oracle: null,
  Adobe: null,
  Accenture: SiAccenture,
}

function LogoItem({ name }) {
  const Logo = logoMap[name]
  return (
    <div className="flex shrink-0 items-center gap-2.5 text-snow/30 grayscale transition-all duration-300 hover:text-snow/60 hover:grayscale-0">
      {Logo ? <Logo size={26} aria-hidden="true" /> : null}
      <span className="whitespace-nowrap font-heading text-lg font-semibold">{name}</span>
    </div>
  )
}

export default function TrustLogos() {
  return (
    <section id="trust" className="relative border-y border-border bg-abyss py-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.15), rgba(139,92,246,0.1), transparent)' }} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.1), rgba(6,182,212,0.15), transparent)' }} />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-mist/70">
          Trusted by teams hiring from the Thulix talent pool
        </p>
      </div>
      <Marquee speed={34}>
        {TRUST_COMPANIES.map((c) => (
          <LogoItem key={c.name} name={c.name} />
        ))}
      </Marquee>
      <div className="mx-auto mt-6 max-w-7xl px-5 lg:px-8">
        <Marquee reverse speed={40}>
          {[...TRUST_COMPANIES].reverse().map((c) => (
            <LogoItem key={c.name} name={c.name} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
