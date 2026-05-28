import { useIsMobile } from '../hooks/useIsMobile.js';

export default function Alternating() {
  const isMobile = useIsMobile();

  // Unified data: desktop (/goal) uses `label` + `reverse`; mobile redesign
  // uses `title` + `location`. Copy / image / alt are shared.
  const rows = [
    {
      label: 'Tel-Aviv',
      title: 'The Neve Tzedek Apartment',
      location: 'Tel-Aviv, Israel',
      copy: 'The flat above the bakery. Eight steps from the sea, three flights up, where the city finally goes quiet.',
      img: '/telaviv.jpg',
      alt: 'The Neve Tzedek Apartment, Tel-Aviv',
      reverse: false,
    },
    {
      label: 'Herzliya · Apollonia',
      title: 'Villa Apollonia',
      location: 'Herzliya, Israel',
      copy: 'A low stone house above the cliff and the ruins. Salt air, late light, a pool that keeps the sky long after the sun.',
      img: '/appolonia.jpeg',
      alt: 'Villa Apollonia in Herzliya',
      reverse: true,
    },
    {
      label: 'Caesarea',
      title: 'The Caesarea House',
      location: 'Caesarea, Israel',
      copy: 'A villa beside the harbour Herod built. Two thousand years of light, polished into one long, white room.',
      img: '/caesarea.jpg',
      alt: 'The Caesarea House',
      reverse: false,
    },
    {
      label: 'Nazareth',
      title: 'Beit Al-Karmel',
      location: 'Nazareth, Israel',
      copy: 'An old courtyard high on the hill. Olive trees, cool tiles, and the town opening beneath you at dusk.',
      img: '/nazareth.jpg',
      alt: 'Residence in Nazareth',
      reverse: true,
    },
  ];

  return (
    <section className="alternating" id="alternating">
      <div className="wrap">
        {isMobile ? (
          <div className="alt-stack">
            {rows.map((r, i) => (
              <article key={i} className="alt-card reveal">
                <div className="alt-card-media" data-parallax="1">
                  <img src={r.img} alt={r.alt} loading="lazy" />
                </div>
                <div className="alt-card-overlay">
                  <h3 className="alt-card-title">{r.title}</h3>
                  <p className="alt-card-location">{r.location}</p>
                </div>
                <p className="alt-card-copy">{r.copy}</p>
              </article>
            ))}
          </div>
        ) : (
          rows.map((r, i) => (
            <div key={i} className={'alt-row' + (r.reverse ? ' reverse' : '')}>
              <div className="alt-text">
                <span className="alt-label">{r.label}</span>
                <h3>{r.copy}</h3>
              </div>
              <div className="alt-image" data-parallax="1">
                <img src={r.img} alt={r.alt} loading="lazy" />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
