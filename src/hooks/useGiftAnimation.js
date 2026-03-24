import { useLayoutEffect } from 'react'
import { gsap } from 'gsap'

export function useGiftAnimation({
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
  stackedImageRef,
  onRevealComplete,
  onRevealReverse,
}) {
  useLayoutEffect(() => {
    if (
      !containerRef.current ||
      !bowRef.current ||
      !ribbonHRef.current ||
      !ribbonVRef.current ||
      !flapLeftRef.current ||
      !flapRightRef.current ||
      !flapFrontRef.current ||
      !flapRearRef.current ||
      !lidRef.current ||
      !boxBodyRef.current ||
      !playerRef.current ||
      !stackedImageRef.current
    ) {
      return
    }

    const ctx = gsap.context(() => {
      const scrollDistance = window.innerWidth < 768 ? 1200 : 1600
      const isMobile = window.innerWidth < 768
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const panelAmount = isMobile ? 0.88 : 1

      gsap.set(playerRef.current, {
        y: 80,
        autoAlpha: 0,
        scale: 0.88,
        zIndex: 0,
      })
      gsap.set(stackedImageRef.current, {
        y: 48,
        autoAlpha: 0,
      })

      gsap.set([flapLeftRef.current, flapRightRef.current, flapFrontRef.current, flapRearRef.current], {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        z: 0,
        opacity: 1,
      })

      gsap.set(lidRef.current, {
        rotateX: 0,
        y: 0,
        z: 0,
        opacity: 1,
      })

      gsap.set(boxBodyRef.current, {
        opacity: 1,
        zIndex: 1,
      })

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onComplete: () => onRevealComplete?.(),
          onReverseComplete: () => onRevealReverse?.(),
        },
      })

      timeline
        .addLabel('ribbonClear', 0)
        .addLabel('topOpen', 0.45)
        .addLabel('sideDrop', 1.05)
        .addLabel('frontRearFold', 1.7)
        .addLabel('playerReveal', 2.1)
        .addLabel('stackedReveal', 2.9)
        .to(bowRef.current, { opacity: 0, scale: 0.7, duration: 0.5 }, 'ribbonClear')
        .to(ribbonHRef.current, { scaleX: 0, duration: 0.45 }, 'ribbonClear')
        .to(ribbonVRef.current, { scaleY: 0, duration: 0.45 }, 'ribbonClear+=0.05')

      if (prefersReducedMotion) {
        timeline
          .to(
            [lidRef.current, flapLeftRef.current, flapRightRef.current, flapFrontRef.current, flapRearRef.current],
            { autoAlpha: 0, duration: 0.95 },
            'topOpen',
          )
          .to(boxBodyRef.current, { autoAlpha: 0.2, duration: 0.9 }, 'sideDrop')
          .set(playerRef.current, { zIndex: 7 }, 'playerReveal')
          .to(playerRef.current, { y: 0, autoAlpha: 1, scale: 1, duration: 0.9 }, 'playerReveal')
          .to(stackedImageRef.current, { y: 0, autoAlpha: 1, duration: 0.85 }, 'stackedReveal')
      } else {
        timeline
          .to(
            lidRef.current,
            {
              rotateX: -118,
              y: -96 * panelAmount,
              z: -6,
              duration: 0.7,
            },
            'topOpen',
          )
          .to(
            flapLeftRef.current,
            {
              rotateY: -104,
              x: -12 * panelAmount,
              duration: 0.85,
            },
            'sideDrop',
          )
          .to(
            flapRightRef.current,
            {
              rotateY: 104,
              x: 12 * panelAmount,
              duration: 0.85,
            },
            'sideDrop+=0.05',
          )
          .to(
            flapFrontRef.current,
            {
              rotateX: 104,
              y: 20 * panelAmount,
              z: 8,
              duration: 0.75,
            },
            'frontRearFold',
          )
          .to(
            flapRearRef.current,
            {
              rotateX: -104,
              y: -20 * panelAmount,
              z: -8,
              duration: 0.75,
            },
            'frontRearFold+=0.05',
          )
          .to(boxBodyRef.current, { opacity: 0.35, duration: 0.9 }, 'frontRearFold+=0.1')
          .set(playerRef.current, { zIndex: 7 }, 'playerReveal')
          .to(playerRef.current, { y: 0, autoAlpha: 1, scale: 1, duration: 0.9 }, 'playerReveal')
          .to(stackedImageRef.current, { y: 0, autoAlpha: 1, duration: 0.95 }, 'stackedReveal')
      }
    }, containerRef)

    return () => ctx.revert()
  }, [
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
    stackedImageRef,
    onRevealComplete,
    onRevealReverse,
  ])
}
