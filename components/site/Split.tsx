import { Fragment, type ElementType } from "react";

/** Titre découpé en mots pour une apparition ligne par ligne (rendu serveur). */
export function Split({
  text,
  as: Tag = "h2",
  className,
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} id={id} data-split aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="w-i" style={{ ["--d" as string]: i }}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Lettres animées une à une au chargement (nom du hero). */
export function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-hidden="true" className="letters">
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          <span key={i}> </span>
        ) : (
          <span key={i} className="ch" style={{ ["--c" as string]: i + delay }}>
            {ch}
          </span>
        )
      )}
    </span>
  );
}
