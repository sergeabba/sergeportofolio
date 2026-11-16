import Image from "next/image";
import Nav from "@/components/site/Nav";
import Reveal from "@/components/site/Reveal";
import ProjectsGallery from "@/components/site/ProjectsGallery";
import ContactForm from "@/components/ContactForm";
import { DataArt, WritingArt } from "@/components/site/Art";
import { ArrowUpRight, Download } from "@/components/site/Icons";
import { getProfile, getProjects, getSkills } from "@/lib/content";
import {
  CONTACT_LINKS, CROSSOVER, CV_LINK, EXPERIENCES, FULL_NAME, LANGUAGES,
  NAV_LINKS, PILLARS, SOCIAL_GAMING,
} from "@/lib/data";

// Rendu statique, régénéré au plus tard toutes les 10 min
// (et immédiatement après chaque modification dans l'admin).
export const revalidate = 600;

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([getProfile(), getProjects(), getSkills()]);
  const wallImages = projects.map((p) => p.src).filter(Boolean).slice(0, 6);
  const [writing, data] = PILLARS;

  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Nav />
      <Reveal />

      <main id="main">
        {/* ── HERO : mur de réalisations ── */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero__wall" aria-hidden="true">
            {wallImages[0] && (
              <div className="hero__tile" style={{ ["--i" as string]: 0 }}>
                <Image src={wallImages[0]} alt="" fill sizes="(min-width: 760px) 25vw, 50vw" priority unoptimized={!canOptimize(wallImages[0])} />
              </div>
            )}
            <div className="hero__tile hero__tile--chart" style={{ ["--i" as string]: 1 }}>
              <svg viewBox="0 0 200 120" preserveAspectRatio="none">
                {[38, 62, 48, 90, 74, 108].map((h, k) => (
                  <rect key={k} x={6 + k * 33} y={120 - h} width={22} height={h} rx={4} fill={k === 5 ? "#ffb547" : "rgba(243,244,251,.75)"} />
                ))}
              </svg>
            </div>
            {wallImages[1] && (
              <div className="hero__tile" style={{ ["--i" as string]: 2 }}>
                <Image src={wallImages[1]} alt="" fill sizes="(min-width: 760px) 25vw, 50vw" priority unoptimized={!canOptimize(wallImages[1])} />
              </div>
            )}
            <div className="hero__tile hero__tile--text" style={{ ["--i" as string]: 3 }}>
              <p>Écrire pour être lu, compris et trouvé.</p>
              <span />
              <span />
              <span />
            </div>
            {wallImages.slice(2, 6).map((src, i) => (
              <div key={src} className="hero__tile hero__tile--extra" style={{ ["--i" as string]: i + 4 }}>
                <Image src={src} alt="" fill sizes="25vw" unoptimized={!canOptimize(src)} />
              </div>
            ))}
          </div>
          <div className="hero__shade" aria-hidden="true" />

          <div className="container hero__content">
            <p className="hero__first">Mbaitadjim</p>
            <h1 id="hero-title" className="display hero__name">
              <span className="sr-only">Mbaitadjim </span>Abba Serge
            </h1>
            <div className="hero__bottom">
              <div>
                <p className="hero__role">
                  <span className="w">Rédacteur web</span> &amp; <span className="d">Data analyst</span>
                </p>
                <p className="hero__status">En poste chez Marketing Sambe, à Dakar</p>
              </div>
              <div className="hero__ctas">
                <a href="#realisations" className="btn btn--amber">Voir mes réalisations</a>
                <a href="#contact" className="btn btn--outline-light">Me contacter</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── À PROPOS ── */}
        <section id="apropos" className="section" aria-labelledby="apropos-title">
          <div className="container about">
            <div className="about__photo" data-reveal>
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait de ${FULL_NAME}`}
                  fill
                  sizes="(min-width: 960px) 520px, 100vw"
                  unoptimized={!canOptimize(profile.photoUrl)}
                />
              ) : (
                <div className="about__monogram">
                  <Image src="/logo-dark-transparent.png" alt="" width={220} height={150} />
                </div>
              )}
            </div>
            <div data-reveal>
              <p className="tag">À propos</p>
              <h2 id="apropos-title" className="display h-section">Qui suis-je ?</h2>
              <p className="about__lead">
                Rédacteur web chez Marketing Sambe et diplômé d&apos;un Master Big Data, j&apos;écris des
                contenus qui se lisent et j&apos;analyse les chiffres qui disent s&apos;ils fonctionnent.
              </p>
              <div className="about__text">
                <p>
                  Après un bac littéraire à N&apos;Djamena, j&apos;ai étudié l&apos;informatique de gestion à
                  l&apos;ISM de Dakar, puis le Big Data et la stratégie data à Digital Campus.
                </p>
                <p>
                  Chez Wemoov, j&apos;ai construit des tableaux de bord sur la consommation des véhicules, le
                  chiffre d&apos;affaires et la performance des chauffeurs. Chez Marketing Sambe, entré en stage
                  puis recruté, j&apos;écris pour le site, le marketplace et les réseaux sociaux.
                </p>
              </div>
              <dl className="stats">
                <div><dt>métiers complémentaires</dt><dd>2</dd></div>
                <div><dt>Master Big Data &amp; Data Stratégie</dt><dd>Bac+5</dd></div>
                <div><dt>de stage en analyse de données</dt><dd>16 mois</dd></div>
                <div><dt>recruté comme rédacteur web</dt><dd>2026</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── EXPERTISES ── */}
        <section id="expertises" aria-labelledby="expertises-title">
          <div className="container section-head" data-reveal>
            <p className="tag">Expertises</p>
            <h2 id="expertises-title" className="display h-section">Ce que je fais</h2>
            <p className="intro">
              Deux métiers que je pratique au quotidien, et qui se renforcent l&apos;un l&apos;autre.
            </p>
          </div>

          <div className="panels">
            <article className="panel panel--amber on-night" data-reveal>
              <div className="panel__inner">
                <div>
                  <h3 className="display h-panel">{writing.title}</h3>
                  <p className="panel__lead">{writing.lead}</p>
                  <ul className="panel__list">
                    {writing.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  <ul className="chips">{writing.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                </div>
                <div className="panel__art"><WritingArt layers={writing.layers} /></div>
              </div>
            </article>

            <article className="panel panel--sky on-night" data-reveal>
              <div className="panel__inner">
                <div>
                  <h3 className="display h-panel">{data.title}</h3>
                  <p className="panel__lead">{data.lead}</p>
                  <ul className="panel__list">
                    {data.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  <ul className="chips">{data.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                </div>
                <div className="panel__art"><DataArt layers={data.layers} /></div>
              </div>
            </article>

            <article className="panel panel--cross on-night" data-reveal>
              <div className="panel__inner">
                <h3 className="display h-panel">{CROSSOVER.title}</h3>
                <p className="panel__lead" style={{ margin: 0 }}>{CROSSOVER.text}</p>
              </div>
              <div className="panel__inner" style={{ paddingTop: 0 }}>
                <div className="cross-points" style={{ gridColumn: "1 / -1", marginTop: 0 }}>
                  {CROSSOVER.points.map((pt) => (
                    <div key={pt.title}>
                      <strong>{pt.title}</strong>
                      <span>{pt.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── RÉALISATIONS ── */}
        <section id="realisations" className="section" aria-labelledby="realisations-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <p className="tag">Réalisations</p>
              <h2 id="realisations-title" className="display h-section">Mes réalisations</h2>
              <p className="intro">
                Miniatures, affiches, sites communautaires et créations en IA générative.
              </p>
            </div>
            <ProjectsGallery projects={projects} />
          </div>
        </section>

        {/* ── PARCOURS ── */}
        <section id="parcours" className="section" style={{ paddingTop: 0 }} aria-labelledby="parcours-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <p className="tag">Parcours</p>
              <h2 id="parcours-title" className="display h-section">Formation &amp; expérience</h2>
            </div>
            <ol className="timeline">
              {EXPERIENCES.map((e) => (
                <li key={e.title + e.org} className="entry" data-reveal>
                  <div className="entry__when">
                    {e.date}
                    <span className="entry__kind">{e.type === "work" ? "Expérience" : "Formation"}</span>
                    {e.current && <span className="entry__now">En poste</span>}
                  </div>
                  <div>
                    <h3 className="entry__title">{e.title}</h3>
                    <p className="entry__org">
                      {e.org}
                      {e.place && `, ${e.place}`}
                    </p>
                    {e.note && <p className="entry__note">{e.note}</p>}
                    {e.items && (
                      <ul className="entry__items">
                        {e.items.map((it) => <li key={it}>{it}</li>)}
                      </ul>
                    )}
                    {e.tags && (
                      <ul className="chips">
                        {e.tags.map((t) => <li key={t} className="chip">{t}</li>)}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── COMPÉTENCES ── */}
        <section id="competences" className="panels" aria-labelledby="competences-title">
          <div className="panel on-night" data-reveal>
            <div className="panel__inner" style={{ display: "block" }}>
              <h2 id="competences-title" className="display h-panel">Stack &amp; outils</h2>
              <p className="panel__lead" style={{ marginBottom: 0 }}>
                Ce que j&apos;utilise pour écrire, analyser, mettre en forme et publier.
              </p>
              <div className="skills">
                {skills.map((cat) => (
                  <div key={cat.id ?? cat.title} className="skill">
                    <h3>{cat.title}</h3>
                    <ul className="chips">
                      {cat.tags.map((t) => <li key={t.label} className="chip">{t.label}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="languages">
                {LANGUAGES.map((l) => (
                  <span key={l.label}><strong>{l.label}</strong>{l.level}</span>
                ))}
              </p>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="panels" style={{ marginTop: 18 }} aria-labelledby="contact-title">
          <div className="panel panel--amber on-night">
            <div className="panel__inner contact__grid" style={{ alignItems: "start" }}>
              <div data-reveal>
                <h2 id="contact-title" className="display h-section">Travaillons ensemble</h2>
                <p className="panel__lead">
                  Un texte à écrire, des chiffres à faire parler, ou un poste à pourvoir : écrivez-moi, je
                  réponds rapidement.
                </p>
                <ul className="contact__links">
                  {[...CONTACT_LINKS, SOCIAL_GAMING[0]].map((c) => {
                    const external = c.href.startsWith("http");
                    return (
                      <li key={c.label}>
                        <a href={c.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                          <span>
                            <small>{c.label === "YouTube" ? "YouTube gaming" : c.label}</small>
                            <strong>{c.value}</strong>
                          </span>
                          <ArrowUpRight />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="form-card" data-reveal>
                <h3>Envoyer un message</h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} {FULL_NAME}</span>
          <nav aria-label="Liens de pied de page">
            {NAV_LINKS.map((l) => <a key={l.id} href={`#${l.id}`}>{l.label}</a>)}
            <a href={CV_LINK} download><Download width={14} height={14} style={{ display: "inline", verticalAlign: "-2px" }} /> CV</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
