export default function Picks() {
  const set1 = [
    { src: '/slider1.png', wide: false },
    { src: '/slider2.png', wide: true },
    { src: '/slider3.png', wide: false },
    { src: '/slider4.png', wide: false },
    { src: '/slider6.jpg', wide: false },
    { src: '/slider7.jpg', wide: true },
    { src: '/slider8.jpg', wide: false },
    { src: '/slider9.jpg', wide: false },
  ];
  return (
    <section className="picks" id="picks">
      <div className="picks-header reveal">
        <div className="stats-eyebrow stats-eyebrow--invert">
          <span className="line"></span>
          <span>Take a look at</span>
          <span className="line"></span>
        </div>
        <h2 className="picks-title">CHECKIN&rsquo;S PICKS</h2>
      </div>
      <div className="picks-marquee reveal reveal-d1">
        <div className="picks-row">
          {set1.map((it, i) => (
            <div key={'a' + i} className={'picks-item' + (it.wide ? ' picks-item-wide' : '')}>
              <img src={it.src} alt="Featured residence" loading="lazy" />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {set1.map((it, i) => (
            <div key={'b' + i} className={'picks-item' + (it.wide ? ' picks-item-wide' : '')} aria-hidden="true">
              <img src={it.src} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
