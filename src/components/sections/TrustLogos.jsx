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
    <div className="flex shrink-0 items-center gap-2.5 opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
      {Logo ? <Logo size={26} aria-hidden="true" /> : null}
      <span className="whitespace-nowrap font-heading text-lg font-semibold text-snow/70">{name}</span>
    </div>
  )
}

export default function TrustLogos() {
  return (
    <section id="trust" className="relative border-y border-gray-200 bg-gray-50/50 py-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-mist">
          Trusted by teams hiring from the SkillBridge talent pool
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
