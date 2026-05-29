export default function Alternating() {
  // One layout for every viewport: the desktop alternating rows. They already
  // collapse to a single stacked column under 820px, so mobile matches desktop
  // (legible text on white + image parallax). `label`/`copy`/`img` are used;
  // `title`/`location` are retained in the data but no longer rendered.
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
        {rows.map((r, i) => (
          <div key={i} className={'alt-row' + (r.reverse ? ' reverse' : '')}>
            <div className="alt-text">
              <span className="alt-label">{r.label}</span>
              <h3>{r.copy}</h3>
            </div>
            <div className="alt-image" data-parallax="1">
              <img src={r.img} alt={r.alt} loading="lazy" decoding="async" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
