import './PersonalMessage.css'

const FALLBACK_MESSAGE = `Zoe

Happy 38th my love. 
I love you more than I know how to say clearly
And no AI is going to craft that for me.
You are the incredible mother of my son
And a strong capable woman in everything you pursue
I adore you in so many ways
I’m so proud of how you mother, what you’ve achieved in your career, and how you always show up as my amazing wife no matter what
Thank you for all lifes beautiful adventures we get to share

Love you, 
Kieran.`

export default function PersonalMessage({ message = FALLBACK_MESSAGE }) {
  return (
    <section className="personal-message" aria-label="Personal birthday message">
      <div className="message-card">
        <span className="message-heart" aria-hidden="true">
          <svg viewBox="0 0 24 24" role="img" focusable="false">
            <path d="M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z" />
          </svg>
        </span>

        <div className="message-content">
          <p className="message-copy">{message}</p>
        </div>
      </div>
    </section>
  )
}
