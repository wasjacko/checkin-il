import { useIsMobile } from '../hooks/useIsMobile.js';

export default function EveryRoom() {
  const isMobile = useIsMobile();

  // Mobile-only redesign: three editorial blocks.
  const blocks = [
    {
      prefix: 'Homes with',
      title: 'Honest bones',
      body: 'Each residence is chosen for its architecture and soul — real materials, stood-still proportions, the kind of rooms that age well.',
    },
    {
      prefix: 'The art of',
      title: 'Quiet comfort',
      body: 'From the morning light to the bed you sink into at night, every detail is set in advance so nothing about your stay needs explaining.',
    },
    {
      prefix: 'A local',
      title: 'Invisible care',
      body: 'Our teams on the ground open doors most travellers never see, and stay out of sight until you need them.',
    },
  ];

  return (
    <section className="everyroom">
      <div className="wrap">
        {isMobile ? (
          <div className="everyroom-blocks">
            {blocks.map((b, i) => (
              <article key={i} className="everyroom-block reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="everyroom-block-prefix">{b.prefix}</div>
                <h3 className="everyroom-block-title">{b.title}</h3>
                <p className="everyroom-block-body">{b.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <>
            <div className="stats-eyebrow reveal">
              <span className="line"></span>
              <span>What we look for</span>
              <span className="line"></span>
            </div>
            <h2 className="everyroom-title reveal">
              Every room,
              <em>a sanctuary of its own</em>
            </h2>
            <ul className="everyroom-list reveal reveal-d1">
              <li><span className="roman">I</span>Architecture</li>
              <li><span className="roman">II</span>Lumière</li>
              <li><span className="roman">III</span>Confort</li>
              <li><span className="roman">IV</span>Emplacement</li>
              <li><span className="roman">V</span>Intimité</li>
              <li><span className="roman">VI</span>Service</li>
              <li><span className="roman">VII</span>Atmosphere</li>
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
