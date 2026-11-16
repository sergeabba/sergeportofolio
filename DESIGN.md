# Design system — « Clair »

Portfolio clair et épuré d'un profil double : rédacteur web **et** data analyst.

- **Couleurs** : blanc, noir `#0a0a0a`, gris neutres ; un seul accent, le dégradé bleu `#2563eb` → violet `#7c3aed`.
- **Typographie** : une seule police, Inter Tight (sans-serif), titres très serrés et très grands.
- **Formes** : cartes aux grands arrondis (36 px), boutons en pilule.
- **Animations pilotées par le défilement** (`components/site/Motion.tsx`, sans bibliothèque) :
  le cadre d'images du haut de page grandit jusqu'au plein écran, le texte « à propos » s'allume mot
  par mot, les cartes d'expertise s'empilent, les réalisations défilent à l'horizontale, la ligne du
  parcours se dessine, le bloc contact s'agrandit.
- Avec `prefers-reduced-motion` ou sans JavaScript, tout s'affiche normalement, sans animation.
- Les jetons sont dans `app/globals.css` ; les alias `--text`, `--border`, `--revo-blue`… servent à l'admin.
