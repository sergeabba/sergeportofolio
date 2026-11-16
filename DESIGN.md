# Design system — « Nuit & signal »

Portfolio immersif d'un profil double : rédacteur web **et** data analyst.

- **Couleurs** : bleu nuit `#0e1126` pour le hero et les panneaux, surface claire `#eceef6`.
  Deux signaux : ambre `#ffb547` (rédaction) et ciel `#74c3ff` (data).
- **Typographie** : Fraunces très gras pour les titres, Plus Jakarta Sans pour le texte,
  JetBrains Mono pour les étiquettes techniques (outils, dates).
- **Structure** : navigation en pilule flottante ; hero en mosaïque de réalisations avec le nom en
  très grand ; grands panneaux sombres aux coins arrondis, illustrations isométriques (`components/site/Art.tsx`).
- **Mouvement** : une seule séquence au chargement (tuiles puis nom), apparition douce des sections,
  tout désactivé avec `prefers-reduced-motion`.
- Les jetons sont dans `app/globals.css` ; les alias `--bg`, `--text`, `--revo-blue`… servent à l'admin.
