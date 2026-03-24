import { forwardRef, useImperativeHandle, useRef } from 'react'

const RecordPlayer = forwardRef(function RecordPlayer({ isRevealed = false }, ref) {
  const wrapperRef = useRef(null)
  const primaryImageRef = useRef(null)
  const secondaryWrapperRef = useRef(null)
  const secondaryImageRef = useRef(null)

  useImperativeHandle(
    ref,
    () => ({
      wrapper: wrapperRef.current,
      primaryImage: primaryImageRef.current,
      secondaryWrapper: secondaryWrapperRef.current,
      secondaryImage: secondaryImageRef.current,
    }),
    [],
  )

  return (
    <div
      ref={wrapperRef}
      className={`record-player-wrapper${isRevealed ? ' revealed' : ''}`}
      aria-live="polite"
    >
      <img
        ref={primaryImageRef}
        className="record-player-image"
        src="/assets/turntable-front.png"
        alt="Audio-Technica LPW40WN record player"
        loading="lazy"
      />
      <div ref={secondaryWrapperRef} className="record-player-stack">
        <img
          ref={secondaryImageRef}
          className="record-player-image record-player-image--secondary"
          src="/assets/turntable-angle.png"
          alt="Audio-Technica LPW40WN record player with dust cover"
          loading="lazy"
        />
      </div>
    </div>
  )
})

export default RecordPlayer
