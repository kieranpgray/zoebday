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
  primaryImageRef,
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
      !primaryImageRef.current ||
      !stackedImageRef.current
    ) {
      return
    }

    const ctx = gsap.context(() => {
      const scrollDistance = window.innerWidth < 768 ? 1700 : 2200
      const isMobile = window.innerWidth < 768
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const panelAmount = isMobile ? 0.88 : 1
      const playerLift = isMobile ? 64 : 86

      gsap.set(playerRef.current, {
        y: playerLift,
        autoAlpha: 0,
        scale: 0.84,
        zIndex: 0,
        force3D: true,
      })
      gsap.set(primaryImageRef.current, {
        autoAlpha: 1,
        y: 30,
        scale: 0.95,
        force3D: true,
      })
      gsap.set(stackedImageRef.current, {
        y: 90,
        x: 18,
        scale: 0.95,
        autoAlpha: 0,
        force3D: true,
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
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${scrollDistance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1.2,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onComplete: () => onRevealComplete?.(),
          onReverseComplete: () => onRevealReverse?.(),
        },
      })

      timeline
        .addLabel('ribbonClear', 0)
        .addLabel('topOpen', 0.6)
        .addLabel('sideDrop', 1.35)
        .addLabel('frontRearFold', 2.02)
        .addLabel('playerReveal', 2.5)
        .addLabel('playerSettle', 3.38)
        .addLabel('stackedReveal', 4.32)
        .to(bowRef.current, { autoAlpha: 0, scale: 0.78, y: -10, duration: 0.62 }, 'ribbonClear')
        .to(ribbonHRef.current, { scaleX: 0.04, y: -12, autoAlpha: 0, duration: 0.58 }, 'ribbonClear')
        .to(ribbonVRef.current, { scaleY: 0.04, y: -16, autoAlpha: 0, duration: 0.58 }, 'ribbonClear+=0.08')

      if (prefersReducedMotion) {
        timeline
          .to(
            [lidRef.current, flapLeftRef.current, flapRightRef.current, flapFrontRef.current, flapRearRef.current],
            { autoAlpha: 0, duration: 0.95 },
            'topOpen',
          )
          .to(boxBodyRef.current, { autoAlpha: 0.22, y: 8, duration: 0.9 }, 'sideDrop')
          .set(playerRef.current, { zIndex: 7 }, 'playerReveal')
          .to(playerRef.current, { y: isMobile ? 16 : 18, autoAlpha: 1, scale: 1, duration: 0.95 }, 'playerReveal')
          .to(primaryImageRef.current, { y: 12, autoAlpha: 1, scale: 1, duration: 0.7 }, 'playerReveal+=0.08')
          .to(playerRef.current, { y: isMobile ? 12 : 14, duration: 0.72 }, 'playerSettle')
          .to(
            stackedImageRef.current,
            { y: 30, x: isMobile ? 8 : 12, scale: 0.97, autoAlpha: 1, duration: 0.88 },
            'stackedReveal',
          )
      } else {
        timeline
          .to(
            lidRef.current,
            {
              rotateX: -106,
              y: -74 * panelAmount,
              z: -4,
              duration: 0.84,
            },
            'topOpen',
          )
          .to(
            flapLeftRef.current,
            {
              rotateY: -94,
              x: -16 * panelAmount,
              z: 8,
              duration: 0.92,
            },
            'sideDrop',
          )
          .to(
            flapRightRef.current,
            {
              rotateY: 94,
              x: 16 * panelAmount,
              z: 8,
              duration: 0.92,
            },
            'sideDrop+=0.06',
          )
          .to(
            flapFrontRef.current,
            {
              rotateX: 94,
              y: 18 * panelAmount,
              z: 8,
              duration: 0.86,
            },
            'frontRearFold',
          )
          .to(
            flapRearRef.current,
            {
              rotateX: -94,
              y: -18 * panelAmount,
              z: -8,
              duration: 0.86,
            },
            'frontRearFold+=0.04',
          )
          .to(boxBodyRef.current, { opacity: 0.22, y: 8, duration: 1.02 }, 'frontRearFold+=0.08')
          .set(playerRef.current, { zIndex: 7 }, 'playerReveal')
          .to(playerRef.current, { y: 18, autoAlpha: 1, scale: 1, duration: 1.02 }, 'playerReveal')
          .to(primaryImageRef.current, { y: 10, autoAlpha: 1, scale: 1, duration: 0.84 }, 'playerReveal+=0.14')
          .to(playerRef.current, { y: 14, duration: 0.8 }, 'playerSettle')
          .to(
            stackedImageRef.current,
            { y: 28, x: 10, scale: 0.97, autoAlpha: 1, duration: 1.02 },
            'stackedReveal',
          )
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
    primaryImageRef,
    stackedImageRef,
    onRevealComplete,
    onRevealReverse,
  ])
}
