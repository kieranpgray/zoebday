import { useMemo } from 'react'
import './Hero.css'

const ORB_COUNT = 9
const ORB_COLOURS = [
  'var(--colour-lavender)',
  'var(--colour-purple-mid)',
  'var(--colour-rose-accent)',
  'var(--colour-gold-accent)',
]

function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

export default function Hero() {
  const orbs = useMemo(() => {
    return Array.from({ length: ORB_COUNT }, (_, index) => ({
      id: `orb-${index}`,
      top: `${randomBetween(4, 90)}%`,
      left: `${randomBetween(3, 95)}%`,
      size: `${randomBetween(8, 20)}px`,
      colour: ORB_COLOURS[Math.floor(Math.random() * ORB_COLOURS.length)],
      duration: `${randomBetween(20, 40).toFixed(2)}s`,
      delay: `${randomBetween(0, 15).toFixed(2)}s`,
    }))
  }, [])

  return (
    <section className="hero" aria-label="Birthday greeting">
      <div className="hero__content">
        <p className="hero__eyebrow">25th March 2026</p>
        <h1 className="hero__title">Happy 38th Birthday ❤️</h1>
      </div>

      <div className="hero__orbs" aria-hidden="true">
        {orbs.map((orb) => (
          <span
            key={orb.id}
            className="orb"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              background: orb.colour,
              '--duration': orb.duration,
              animationDelay: orb.delay,
            }}
          />
        ))}
      </div>
    </section>
  )
}
