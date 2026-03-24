import { useCallback, useRef, useState } from 'react'
import GiftBox from './GiftBox.jsx'
import RecordPlayer from './RecordPlayer.jsx'
import { useGiftAnimation } from '../../hooks/useGiftAnimation.js'
import './GiftReveal.css'

export default function GiftReveal() {
  const [isRevealed, setIsRevealed] = useState(false)

  const containerRef = useRef(null)

  const bowRef = useRef(null)
  const ribbonHRef = useRef(null)
  const ribbonVRef = useRef(null)
  const flapLeftRef = useRef(null)
  const flapRightRef = useRef(null)
  const flapFrontRef = useRef(null)
  const flapRearRef = useRef(null)
  const lidRef = useRef(null)
  const boxBodyRef = useRef(null)
  const playerRef = useRef(null)
  const primaryImageRef = useRef(null)
  const stackedImageRef = useRef(null)

  const giftBoxInstanceRef = useRef(null)
  const recordPlayerInstanceRef = useRef(null)

  const assignGiftBoxRefs = useCallback((instance) => {
    giftBoxInstanceRef.current = instance
    bowRef.current = instance?.bow ?? null
    ribbonHRef.current = instance?.ribbonH ?? null
    ribbonVRef.current = instance?.ribbonV ?? null
    flapLeftRef.current = instance?.flapLeft ?? null
    flapRightRef.current = instance?.flapRight ?? null
    flapFrontRef.current = instance?.flapFront ?? null
    flapRearRef.current = instance?.flapRear ?? null
    lidRef.current = instance?.lid ?? null
    boxBodyRef.current = instance?.boxBody ?? null
  }, [])

  const assignRecordPlayerRef = useCallback((instance) => {
    recordPlayerInstanceRef.current = instance
    playerRef.current = instance?.wrapper ?? null
    primaryImageRef.current = instance?.primaryImage ?? null
    stackedImageRef.current = instance?.secondaryWrapper ?? null
  }, [])

  const handleRevealComplete = useCallback(() => {
    setIsRevealed(true)
  }, [])

  const handleRevealReverse = useCallback(() => {
    setIsRevealed(false)
  }, [])

  useGiftAnimation({
    containerRef,
    bowRef,
    ribbonHRef,
    ribbonVRef,
    flapLeftRef,
    flapRightRef,
    flapFrontRef,
    flapRearRef,
    lidRef,
    boxBodyRef,
    playerRef,
    primaryImageRef,
    stackedImageRef,
    onRevealComplete: handleRevealComplete,
    onRevealReverse: handleRevealReverse,
  })

  return (
    <section ref={containerRef} className="gift-reveal" aria-label="Gift reveal animation">
      <div className="gift-reveal__stage">
        <GiftBox ref={assignGiftBoxRefs} />
        <RecordPlayer ref={assignRecordPlayerRef} isRevealed={isRevealed} />
      </div>
    </section>
  )
}
