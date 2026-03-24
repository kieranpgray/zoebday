import Hero from './components/Hero.jsx'
import PersonalMessage from './components/PersonalMessage.jsx'
import GiftReveal from './components/GiftReveal/GiftReveal.jsx'
import Footer from './components/Footer.jsx'
import { useLenis } from './hooks/useLenis.js'

export default function App() {
  useLenis()

  return (
    <>
      <Hero />
      <PersonalMessage />
      <GiftReveal />
      <Footer />
    </>
  )
}
