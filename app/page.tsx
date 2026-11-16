import Image from "next/image";
import Nav from "@/components/site/Nav";
import Motion from "@/components/site/Motion";
import ProjectsGallery from "@/components/site/ProjectsGallery";
import ContactForm from "@/components/ContactForm";
import { ArrowUpRight } from "@/components/site/Icons";
import { getProfile, getProjects, getSkills } from "@/lib/content";
import {
  CONTACT_LINKS, CROSSOVER, CV_LINK, EXPERIENCES, FULL_NAME, LANGUAGES,
  NAV_LINKS, PILLARS, SOCIAL_GAMING,
} from "@/lib/data";

// Rendu statique, régénéré au plus tard toutes les 10 min
// (et immédiatement après chaque modification dans l'admin).
export const revalidate = 600;

const ABOUT_LEAD =
  "Rédacteur web chez Marketing Sambe et diplômé d'un Master Big Data, j'écris des contenus qui se lisent et j'analyse les chiffres qui disent s'ils fonctionnent.";

function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

/** Paragraphe dont les mots s'allument un à un au défilement. */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="words" data-words style={{ ["--n" as string]: words.length }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="wd" style={{ ["--i" as string]: i }}>
            {w}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}

export default async function Home() {
  const [profile, projects, skills] = await Promise.all([getProfile(), getProjects(), getSkills()]);
  const stageImages = projects.map((p) => p.src).filter(Boolean).slice(0, 3);
  const [writing, data] = PILLARS;

  return (
    <>
      <a href="#main" className="skip-link">Aller au contenu</a>
      <Nav />
      <Motion />

      <main id="main">
        {/* ── HERO ── */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="container">
            <p className="badge fade-in" style={{ ["--delay" as string]: "0s" }}>
              <i aria-hidden="true" />
              Rédacteur web chez Marketing Sambe, à Dakar
            </p>
            <h1 id="hero-title" className="h1">
              <span className="line"><span style={{ ["--l" as string]: 0 }}>Des mots.</span></span>
              <span className="line"><span className="grad" style={{ ["--l" as string]: 1 }}>Des chiffres.</span></span>
            </h1>
            <p className="lead fade-in" style={{ ["--delay" as string]: "0.55s" }}>
              {FULL_NAME}, rédacteur web et data analyst. J&apos;écris des contenus qui se lisent et
              j&apos;analyse ce qui fonctionne.
            </p>
            <div className="hero__ctas fade-in" style={{ ["--delay" as string]: "0.7s" }}>
              <a href="#realisations" className="btn btn--dark">Voir mes réalisations</a>
              <a href="#contact" className="btn btn--ghost">Me contacter</a>
            </div>
          </div>
        </section>

        {/* ── SCÈNE : le cadre d'images grandit jusqu'au plein écran ── */}
        <div className="stage-scene" data-stage>
          <div className="stage-pin">
            <div className="stage">
              {stageImages.map((src, i) => (
                <div key={src} className="stage__tile">
                  <Image src={src} alt="" fill priority={i === 0} sizes="(min-width: 700px) 40vw, 50vw" unoptimized={!canOptimize(src)} />
                </div>
              ))}
              <div className="stage__veil">
                <div className="stage__title">Créer, écrire, mesurer.</div>
                <p>Miniatures, affiches, sites communautaires et créations en IA générative.</p>
                <a href="#realisations" className="btn btn--light">Parcourir les réalisations</a>
              </div>
            </div>
          </div>
        </div>

        {/* ── À PROPOS ── */}
        <section id="apropos" className="section" aria-labelledby="apropos-title">
          <div className="container about">
            <div className="about__photo" data-reveal>
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={`Portrait de ${FULL_NAME}`}
                  fill
                  sizes="(min-width: 960px) 480px, 100vw"
                  unoptimized={!canOptimize(profile.photoUrl)}
                />
              ) : (
                <div className="about__mono">
                  <Image src="/logo-light-transparent.png" alt="" width={220} height={150} />
                </div>
              )}
            </div>
            <div>
              <h2 id="apropos-title" className="sr-only">À propos</h2>
              <Words text={ABOUT_LEAD} />
              <div className="about__text" data-reveal>
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
                <div data-reveal style={{ ["--d" as string]: 0 }}><dt>métiers complémentaires</dt><dd data-count="2">2</dd></div>
                <div data-reveal style={{ ["--d" as string]: 1 }}><dt>Master Big Data &amp; Data Stratégie</dt><dd data-count="Bac+5">Bac+5</dd></div>
                <div data-reveal style={{ ["--d" as string]: 2 }}><dt>de stage en analyse de données</dt><dd data-count="16 mois">16 mois</dd></div>
                <div data-reveal style={{ ["--d" as string]: 3 }}><dt>recruté comme rédacteur web</dt><dd data-count="2026">2026</dd></div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── EXPERTISES : cartes qui s'empilent ── */}
        <section id="expertises" aria-labelledby="expertises-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 id="expertises-title" className="h2">
                Deux métiers.<br />
                <span style={{ color: "var(--ink-3)" }}>Une même exigence : être clair.</span>
              </h2>
            </div>

            <div className="stack">
              <article className="scard" style={{ ["--i" as string]: 0 }}>
                <div>
                  <h3 className="h3">{writing.title}</h3>
                  <p className="lead">{writing.lead}</p>
                  <ul className="scard__list">{writing.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  <ul className="chips">{writing.tools.map((t) => <li key={t} className="chip" style={{ background: "#fff" }}>{t}</li>)}</ul>
                </div>
                <div className="scard__visual" data-reveal aria-hidden="true">
                  <div className="doc">
                    <b>Écrire pour être lu, compris et trouvé.</b>
                    {[100, 86, 94, 62, 90, 48].map((w, k) => (
                      <i key={k} className={k === 3 ? "hl" : ""} style={{ width: `${w}%`, ["--k" as string]: k }} />
                    ))}
                  </div>
                </div>
              </article>

              <article className="scard scard--dark on-dark" style={{ ["--i" as string]: 1 }}>
                <div>
                  <h3 className="h3">{data.title}</h3>
                  <p className="lead">{data.lead}</p>
                  <ul className="scard__list">{data.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  <ul className="chips">{data.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                </div>
                <div className="scard__visual" data-reveal aria-hidden="true">
                  <div className="bars">
                    {[30, 48, 40, 66, 58, 100].map((h, k) => (
                      <i key={k} style={{ ["--h" as string]: `${h}%`, ["--k" as string]: k }} />
                    ))}
                  </div>
                </div>
              </article>

              <article className="scard scard--grad on-dark" style={{ ["--i" as string]: 2 }}>
                <div>
                  <h3 className="h3">{CROSSOVER.title}</h3>
                  <p className="lead" style={{ marginBottom: 0 }}>{CROSSOVER.text}</p>
                </div>
                <div className="cross">
                  {CROSSOVER.points.map((pt) => (
                    <div key={pt.title}>
                      <strong>{pt.title}</strong>
                      <span>{pt.text}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ── RÉALISATIONS : défilement horizontal ── */}
        <section id="realisations" style={{ padding: "clamp(72px, 9vw, 120px) 0" }} aria-labelledby="realisations-title">
          <ProjectsGallery projects={projects} />
        </section>

        {/* ── PARCOURS ── */}
        <section id="parcours" className="section" style={{ paddingTop: 0 }} aria-labelledby="parcours-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 id="parcours-title" className="h2">Parcours</h2>
            </div>
            <ol className="timeline" data-line>
              {EXPERIENCES.map((e) => (
                <li key={e.title + e.org} className="entry" data-reveal>
                  <div className="entry__when">
                    <span>{e.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{e.type === "work" ? "Expérience" : "Formation"}</span>
                    {e.current && <span className="entry__now">En poste</span>}
                  </div>
                  <h3 className="h3">{e.title}</h3>
                  <p className="entry__org">
                    {e.org}
                    {e.place && `, ${e.place}`}
                  </p>
                  {e.note && <p className="entry__note">{e.note}</p>}
                  {e.items && (
                    <ul className="entry__items">{e.items.map((it) => <li key={it}>{it}</li>)}</ul>
                  )}
                  {e.tags && (
                    <ul className="chips">{e.tags.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── COMPÉTENCES ── */}
        <section id="competences" className="section" style={{ paddingTop: 0 }} aria-labelledby="competences-title">
          <div className="container">
            <div className="section-head" data-reveal>
              <h2 id="competences-title" className="h2">Compétences</h2>
              <p className="lead">Ce que j&apos;utilise pour écrire, analyser, mettre en forme et publier.</p>
            </div>
            <div className="skills">
              {skills.map((cat, i) => (
                <div key={cat.id ?? cat.title} className="skill" data-reveal style={{ ["--d" as string]: i % 2 }}>
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
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="contact" aria-labelledby="contact-title">
          <div className="contact__card" data-grow>
            <div className="container contact__grid">
              <div>
                <h2 id="contact-title" className="h2">Travaillons ensemble.</h2>
                <p className="lead">
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
              <div className="form-card">
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
            <a href={CV_LINK} download>CV</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
