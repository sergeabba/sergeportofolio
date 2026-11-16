import Image from "next/image";
import Nav from "@/components/site/Nav";
import Reveal from "@/components/site/Reveal";
import ProjectsGallery from "@/components/site/ProjectsGallery";
import ContactForm from "@/components/ContactForm";
import { ArrowRight, ArrowUpRight, Bars, Download } from "@/components/site/Icons";
import { getProfile, getProjects, getSkills } from "@/lib/content";
import {
  CONTACT_LINKS, CROSSOVER, CV_LINK, EXPERIENCES, FULL_NAME, LANGUAGES,
  NAV_LINKS, PILLARS, SOCIAL_GAMING,
} from "@/lib/data";

// Rendu statique, régénéré au plus tard toutes les 10 min
// (et immédiatement après chaque modification dans l'admin).
export const revalidate = 600;

const KEYWORDS = [
  "Rédaction web", "Power BI", "SEO", "Python", "Réseaux sociaux", "SQL",
  "Storytelling", "Tableaux de bord", "Annonces", "Big Data", "Infographies", "Excel",
];

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([getProfile(), getProjects(), getSkills()]);
  const work = EXPERIENCES.filter((e) => e.type === "work");
  const education = EXPERIENCES.filter((e) => e.type === "education");

  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Nav />
      <Reveal />

      <main id="main">
        {/* ── HERO ── */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div>
              <p className="status">
                <span className="status__dot" aria-hidden="true" />
                Rédacteur web chez Marketing Sambe · Dakar
              </p>
              <h1 id="hero-title" className="h-display">
                Des <em className="t-word">mots</em> qui se lisent,
                <br /> des <em className="t-data">chiffres</em> qui prouvent.
              </h1>
              <p className="lead">
                Je suis {FULL_NAME}, rédacteur web et data analyst. J&apos;écris des contenus clairs,
                pensés pour le référencement, et j&apos;analyse les données pour savoir ce qui fonctionne
                vraiment.
              </p>
              <div className="hero__ctas">
                <a href="#contact" className="btn btn--ink">
                  Travaillons ensemble <ArrowRight />
                </a>
                <a href={CV_LINK} className="btn btn--ghost" download>
                  <Download /> Télécharger mon CV
                </a>
              </div>
              <dl className="hero__facts">
                <div>
                  <dt>Aujourd&apos;hui</dt>
                  <dd>Rédaction web &amp; community management</dd>
                </div>
                <div>
                  <dt>Formation</dt>
                  <dd>Master Big Data &amp; Data Stratégie</dd>
                </div>
                <div>
                  <dt>Basé à</dt>
                  <dd>Dakar, Sénégal</dd>
                </div>
              </dl>
            </div>

            <figure className="portrait" style={{ margin: 0 }}>
              <div className="portrait__frame">
                {profile.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={`Portrait de ${FULL_NAME}`}
                    fill
                    priority
                    sizes="(min-width: 960px) 440px, 90vw"
                  />
                ) : (
                  <span className="portrait__monogram" aria-hidden="true">AS</span>
                )}
              </div>
              <div className="portrait__note portrait__note--word" aria-hidden="true">
                <span className="portrait__glyph">¶</span>
                <span>Rédaction<small>contenus · SEO</small></span>
              </div>
              <div className="portrait__note portrait__note--data" aria-hidden="true">
                <span className="portrait__glyph"><Bars width={18} height={18} /></span>
                <span>Data<small>analyse · reporting</small></span>
              </div>
            </figure>
          </div>
        </section>

        <div className="strip" aria-hidden="true">
          <div className="strip__track">
            {[0, 1].map((k) => (
              <ul key={k}>
                {KEYWORDS.map((w) => <li key={w}>{w}</li>)}
              </ul>
            ))}
          </div>
        </div>

        {/* ── EXPERTISES ── */}
        <section id="expertises" className="section" aria-labelledby="expertises-title">
          <div className="container">
            <header className="section-head section-head--split" data-reveal>
              <div>
                <span className="kicker">Expertises</span>
                <h2 id="expertises-title" className="h-section" style={{ marginTop: 16 }}>
                  Deux métiers, une même exigence : <em>être clair</em>.
                </h2>
              </div>
              <p className="lead">
                Un bac littéraire, puis l&apos;informatique, puis la data : j&apos;ai toujours eu un pied
                dans les mots et l&apos;autre dans les chiffres. Aujourd&apos;hui, je mets les deux au service
                des mêmes objectifs.
              </p>
            </header>

            <div className="pillars">
              {PILLARS.map((p, i) => (
                <article
                  key={p.id}
                  className={`pillar pillar--${p.id === "redaction" ? "word" : "data"}`}
                  data-reveal
                  style={{ ["--delay" as string]: `${i * 120}ms` }}
                >
                  <span className="pillar__kicker">{p.kicker}</span>
                  <h3 className="h-card">{p.title}</h3>
                  <p className="pillar__lead">{p.lead}</p>
                  <ul className="pillar__list">
                    {p.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                  <ul className="chips pillar__tools" aria-label="Outils">
                    {p.tools.map((t) => <li key={t} className="chip">{t}</li>)}
                  </ul>
                </article>
              ))}
            </div>

            <div className="crossover" data-reveal>
              <div>
                <span className="crossover__mark">01 + 02</span>
                <h3 className="h-card">{CROSSOVER.title}</h3>
              </div>
              <div>
                <p>{CROSSOVER.text}</p>
                <ul className="chips">
                  {CROSSOVER.points.map((pt) => <li key={pt} className="chip">{pt}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── PARCOURS ── */}
        <section id="parcours" className="section" aria-labelledby="parcours-title">
          <div className="container">
            <header className="section-head" data-reveal>
              <span className="kicker">Parcours</span>
              <h2 id="parcours-title" className="h-section">Du tableau de bord à la page web.</h2>
            </header>

            <div className="timeline-group">
              <h3 className="timeline-group__title">Expérience</h3>
              <ol className="timeline">
                {work.map((e) => (
                  <li key={e.title + e.org} className="entry" data-reveal>
                    <div className="entry__date">
                      {e.date}
                      {e.current && (
                        <>
                          <br />
                          <span className="entry__badge">En poste</span>
                        </>
                      )}
                    </div>
                    <div>
                      <h4 className="entry__title">{e.title}</h4>
                      <p className="entry__org">
                        <strong>{e.org}</strong>
                        {e.place && ` · ${e.place}`}
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

            <div className="timeline-group">
              <h3 className="timeline-group__title">Formation</h3>
              <ol className="timeline">
                {education.map((e) => (
                  <li key={e.title} className="entry" data-reveal>
                    <div className="entry__date">{e.date}</div>
                    <div>
                      <h4 className="entry__title">{e.title}</h4>
                      <p className="entry__org">
                        <strong>{e.org}</strong>
                        {e.place && ` · ${e.place}`}
                      </p>
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
          </div>
        </section>

        {/* ── COMPÉTENCES ── */}
        <section id="competences" className="section" aria-labelledby="competences-title">
          <div className="container">
            <header className="section-head section-head--split" data-reveal>
              <div>
                <span className="kicker">Compétences</span>
                <h2 id="competences-title" className="h-section" style={{ marginTop: 16 }}>
                  La boîte à outils.
                </h2>
              </div>
              <p className="lead">
                Ce que j&apos;utilise au quotidien pour écrire, analyser, mettre en forme et publier.
              </p>
            </header>
            <div className="skills" data-reveal>
              {skills.map((cat, i) => (
                <div key={cat.id ?? cat.title} className="skill">
                  <span className="skill__num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{cat.title}</h3>
                  <ul className="chips">
                    {cat.tags.map((t) => <li key={t.label} className="chip">{t.label}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <p className="languages">
              {LANGUAGES.map((l) => (
                <span key={l.label}>
                  <strong>{l.label}</strong>
                  {l.level}
                </span>
              ))}
            </p>
          </div>
        </section>

        {/* ── RÉALISATIONS ── */}
        <section id="realisations" className="section" aria-labelledby="realisations-title">
          <div className="container">
            <header className="section-head section-head--split" data-reveal>
              <div>
                <span className="kicker">Réalisations</span>
                <h2 id="realisations-title" className="h-section" style={{ marginTop: 16 }}>
                  Quelques créations.
                </h2>
              </div>
              <p className="lead">
                Visuels, miniatures, sites communautaires et expériences en IA générative. Cliquez sur
                une réalisation pour la voir en détail.
              </p>
            </header>
            <ProjectsGallery projects={projects} />
          </div>
        </section>

        {/* ── À PROPOS ── */}
        <section id="apropos" className="section" aria-labelledby="apropos-title">
          <div className="container">
            <header className="section-head" data-reveal>
              <span className="kicker">À propos</span>
              <h2 id="apropos-title" className="h-section">Un parcours entre lettres et données.</h2>
            </header>
            <div className="about">
              <div className="about__text" data-reveal>
                <p>
                  Après un bac littéraire à N&apos;Djamena, je suis parti à Dakar étudier
                  l&apos;informatique de gestion à l&apos;ISM, puis le Big Data et la stratégie data à
                  Digital Campus.
                </p>
                <p>
                  Chez Wemoov, j&apos;ai appris à faire parler les données : consommation des véhicules,
                  chiffre d&apos;affaires, performance des chauffeurs, le tout réuni dans des tableaux de
                  bord utiles aux décisions.
                </p>
                <p>
                  Chez Marketing Sambe, entré en stage puis recruté, j&apos;ai retrouvé mon premier amour :
                  écrire. Pour être lu, compris et trouvé. Mon atout, c&apos;est de pouvoir mesurer ce que
                  j&apos;écris et d&apos;expliquer simplement ce que je mesure.
                </p>
              </div>
              <div data-reveal style={{ ["--delay" as string]: "120ms" }}>
                <dl className="facts">
                  <div><dt>Poste</dt><dd>Rédacteur web &amp; community manager</dd></div>
                  <div><dt>Diplôme</dt><dd>Master Big Data &amp; Data Stratégie</dd></div>
                  <div><dt>Ville</dt><dd>Dakar, Sénégal</dd></div>
                  <div>
                    <dt>Langues</dt>
                    <dd>{LANGUAGES.map((l) => `${l.label} (${l.level.toLowerCase()})`).join(" · ")}</dd>
                  </div>
                </dl>
                <div className="side-card">
                  <span className="kicker">À côté</span>
                  <h3>The Legend of Don</h3>
                  <p>
                    Ma chaîne gaming : vidéos, miniatures et visuels, et un terrain d&apos;essai pour les
                    outils d&apos;IA générative.
                  </p>
                  <div className="link-list">
                    {SOCIAL_GAMING.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">
                        {s.label} <ArrowUpRight />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <div className="container contact__grid">
            <div data-reveal>
              <span className="kicker">Contact</span>
              <h2 id="contact-title" className="h-section" style={{ marginTop: 16 }}>
                Un texte à écrire, des chiffres à faire parler ?
              </h2>
              <p className="lead" style={{ marginTop: 24 }}>
                Mission de rédaction, besoin d&apos;analyse ou opportunité de poste : écrivez-moi, je
                réponds rapidement.
              </p>
              <ul className="contact__links">
                {CONTACT_LINKS.map((c) => {
                  const external = c.href.startsWith("http");
                  return (
                    <li key={c.label}>
                      <a href={c.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        <span>{c.label}</span>
                        <span>{c.value}</span>
                        <ArrowUpRight width={18} height={18} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="form-card" data-reveal style={{ ["--delay" as string]: "120ms" }}>
              <h3>Envoyer un message</h3>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} {FULL_NAME}</span>
          <nav aria-label="Liens de pied de page">
            {NAV_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`}>{l.label}</a>
            ))}
            <a href={CV_LINK} download>CV</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
