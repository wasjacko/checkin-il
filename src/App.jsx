import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Stats from './components/Stats.jsx';
import Ultima from './components/Ultima.jsx';
import Picks from './components/Picks.jsx';
import Alternating from './components/Alternating.jsx';
import EveryRoom from './components/EveryRoom.jsx';
import Submit from './components/Submit.jsx';
import Testimonial from './components/Testimonial.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';

import { useReveal } from './hooks/useReveal.js';
import { useParallax } from './hooks/useParallax.js';
import { useHeroZoom } from './hooks/useHeroZoom.js';
import { useIsMobile } from './hooks/useIsMobile.js';

export default function App() {
  useReveal();
  useParallax();
  useHeroZoom();
  const isMobile = useIsMobile();

  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Ultima />
      {/* Desktop keeps the frozen /goal order; mobile uses the redesigned flow. */}
      {isMobile ? (
        <>
          <EveryRoom />
          <Alternating />
          <Testimonial />
          <Picks />
          <Submit />
        </>
      ) : (
        <>
          <Alternating />
          <EveryRoom />
          <Submit />
          <Testimonial />
          <Picks />
        </>
      )}
      <Faq />
      <Footer />
    </>
  );
}
