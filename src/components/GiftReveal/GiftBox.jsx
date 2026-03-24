import { forwardRef, useImperativeHandle, useRef } from 'react'

const GiftBox = forwardRef(function GiftBox(_, ref) {
  const wrapperRef = useRef(null)
  const boxBodyRef = useRef(null)
  const flapLeftRef = useRef(null)
  const flapRightRef = useRef(null)
  const flapFrontRef = useRef(null)
  const flapRearRef = useRef(null)
  const lidRef = useRef(null)
  const ribbonHRef = useRef(null)
  const ribbonVRef = useRef(null)
  const bowRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      wrapper: wrapperRef.current,
      boxBody: boxBodyRef.current,
      flapLeft: flapLeftRef.current,
      flapRight: flapRightRef.current,
      flapFront: flapFrontRef.current,
      flapRear: flapRearRef.current,
      lid: lidRef.current,
      ribbonH: ribbonHRef.current,
      ribbonV: ribbonVRef.current,
      bow: bowRef.current,
    }),
    [],
  )

  return (
    <div
      ref={wrapperRef}
      className="gift-box-wrapper"
      style={{ perspective: '900px' }}
      aria-hidden="true"
    >
      <div ref={boxBodyRef} className="box-body" />
      <div ref={flapLeftRef} className="flap-left" style={{ transformStyle: 'preserve-3d' }} />
      <div ref={flapRightRef} className="flap-right" style={{ transformStyle: 'preserve-3d' }} />
      <div ref={flapFrontRef} className="flap-front" style={{ transformStyle: 'preserve-3d' }} />
      <div ref={flapRearRef} className="flap-rear" style={{ transformStyle: 'preserve-3d' }} />
      <div ref={lidRef} className="box-lid" />
      <div ref={ribbonHRef} className="ribbon-h" />
      <div ref={ribbonVRef} className="ribbon-v" />
      <div ref={bowRef} className="bow">
        <div className="bow-loop bow-loop-left" />
        <div className="bow-loop bow-loop-right" />
      </div>
    </div>
  )
})

export default GiftBox
