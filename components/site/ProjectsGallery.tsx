"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import type { Projet } from "@/lib/types";
import { ArrowUpRight, ChevronLeft, ChevronRight, Close } from "./Icons";

const ALL = "Tous";

/** next/image only optimises local files and Supabase Storage (see next.config.ts). */
function canOptimize(src: string) {
  if (src.startsWith("/")) return true;
  try {
    return new URL(src).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

export default function ProjectsGallery({ projects }: { projects: Projet[] }) {
  const [filter, setFilter] = useState(ALL);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const filtered = useRef(false);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) counts.set(p.cat, (counts.get(p.cat) ?? 0) + 1);
    return [[ALL, projects.length] as const, ...counts.entries()];
  }, [projects]);

  const visible = useMemo(
    () => (filter === ALL ? projects : projects.filter((p) => p.cat === filter)),
    [projects, filter]
  );

  const current = openIndex !== null ? visible[openIndex] : null;
  const images = useMemo(
    () => (current ? [current.src, ...(current.gallery ?? [])].filter(Boolean) : []),
    [current]
  );

  // Après un changement de filtre, les nouvelles cartes s'affichent directement
  // (l'animation est alors assurée par la View Transition).
  useLayoutEffect(() => {
    if (!filtered.current) return;
    listRef.current?.querySelectorAll("li").forEach((li) => li.classList.add("is-visible"));
  }, [filter]);

  const changeFilter = (cat: string) => {
    if (cat === filter) return;
    filtered.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) {
      document.startViewTransition(() => flushSync(() => setFilter(cat)));
    } else {
      setFilter(cat);
    }
  };

  // Inclinaison 3D légère qui suit la souris
  const onTilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -6).toFixed(2));
    e.currentTarget.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2));
  };
  const resetTilt = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty("--rx", "0");
    e.currentTarget.style.setProperty("--ry", "0");
  };

  const open = (i: number) => {
    setOpenIndex(i);
    setImageIndex(0);
  };

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (current && !d.open) {
      d.showModal();
      window.__lenis?.stop();
    }
    if (!current && d.open) d.close();
    if (!current) window.__lenis?.start();
  }, [current]);

  const step = useCallback(
    (dir: 1 | -1) => setImageIndex((i) => (i + dir + images.length) % images.length),
    [images.length]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (images.length < 2) return;
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  };

  return (
    <>
      {categories.length > 2 && (
        <div className="filters" role="group" aria-label="Filtrer les réalisations">
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              type="button"
              className="filter"
              aria-pressed={filter === cat}
              onClick={() => changeFilter(cat)}
            >
              {cat}
              <span className="filter__count">{count}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="works" ref={listRef}>
        {visible.map((p, i) => (
          <li
            key={p.id ?? p.titre}
            data-reveal
            style={{
              ["--d" as string]: i % 3,
              viewTransitionName: `work-${projects.indexOf(p)}`,
            }}
          >
            <button
              type="button"
              className="work"
              onClick={() => open(i)}
              onPointerMove={onTilt}
              onPointerLeave={resetTilt}
              aria-haspopup="dialog"
            >
              <Image
                src={p.src}
                alt=""
                fill
                sizes="(min-width: 1100px) 50vw, (min-width: 700px) 50vw, 100vw"
                unoptimized={!canOptimize(p.src)}
              />
              <span className="work__arrow" aria-hidden="true">
                <ArrowUpRight />
              </span>
              <span className="work__body">
                <span className="work__cat">{p.cat}</span>
                <h3 className="work__title">{p.titre}</h3>
                <span className="work__desc">{p.desc}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="modal"
        aria-labelledby="modal-title"
        onClose={() => setOpenIndex(null)}
        onClick={(e) => e.target === e.currentTarget && setOpenIndex(null)}
        onKeyDown={onKeyDown}
      >
        {current && (
          <>
            <button type="button" className="icon-btn modal__close" onClick={() => setOpenIndex(null)} aria-label="Fermer">
              <Close />
            </button>
            <div className="modal__grid">
              <div className="modal__media">
                <Image
                  key={images[imageIndex]}
                  src={images[imageIndex]}
                  alt={`${current.titre}${images.length > 1 ? ` — image ${imageIndex + 1} sur ${images.length}` : ""}`}
                  fill
                  sizes="(min-width: 860px) 600px, 100vw"
                  unoptimized={!canOptimize(images[imageIndex])}
                />
                {images.length > 1 && (
                  <>
                    <button type="button" className="icon-btn modal__nav modal__nav--prev" onClick={() => step(-1)} aria-label="Image précédente">
                      <ChevronLeft />
                    </button>
                    <button type="button" className="icon-btn modal__nav modal__nav--next" onClick={() => step(1)} aria-label="Image suivante">
                      <ChevronRight />
                    </button>
                  </>
                )}
              </div>
              <div className="modal__info">
                <span className="modal__cat">{current.cat}</span>
                <h2 id="modal-title" className="modal__title">{current.titre}</h2>
                <p style={{ margin: 0, color: "var(--on-night-2)" }}>{current.desc}</p>
                {(current.tags ?? []).length > 0 && (
                  <ul className="chips">
                    {current.tags.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                )}
                {images.length > 1 && (
                  <div className="modal__thumbs">
                    {images.map((src, i) => (
                      <button
                        key={src + i}
                        type="button"
                        className="modal__thumb"
                        aria-current={i === imageIndex}
                        aria-label={`Afficher l'image ${i + 1}`}
                        onClick={() => setImageIndex(i)}
                      >
                        <Image src={src} alt="" fill sizes="64px" unoptimized={!canOptimize(src)} />
                      </button>
                    ))}
                  </div>
                )}
                {current.lien && (
                  <a href={current.lien} target="_blank" rel="noopener noreferrer" className="btn btn--amber" style={{ alignSelf: "flex-start", marginTop: "auto" }}>
                    {current.lienLabel || "Voir le projet"} <ArrowUpRight />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
