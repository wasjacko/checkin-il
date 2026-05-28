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

export default function App() {
  useReveal();
  useParallax();
  useHeroZoom();

  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Ultima />
      <Alternating />
      <EveryRoom />
      <Submit />
      <Testimonial />
      <Picks />
      <Faq />
      <Footer />
    </>
  );
}
