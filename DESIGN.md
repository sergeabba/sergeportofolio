# Design system — « Les mots & les chiffres »

Portfolio éditorial d'un profil double : rédacteur web **et** data analyst.

- **Fond** : papier chaud `#f7f4ee` (sombre : `#111113`), encre `#17161a`.
- **Deux accents à égalité** : terracotta `--word` pour la rédaction, bleu `--data` pour l'analyse.
- **Typographie** : Fraunces (serif, titres), Inter (texte), JetBrains Mono (dates, étiquettes).
- **Composants** : boutons pilule (`.btn--ink`, `.btn--ghost`), puces (`.chip`), cartes `.pillar`, frise `.entry`.
- **Animations** : apparition douce au défilement (`[data-reveal]`), désactivée avec `prefers-reduced-motion`
  et sans JavaScript (le contenu reste visible).
- Tous les jetons sont dans `app/globals.css` ; les alias `--bg`, `--text`, `--revo-blue`… servent à l'admin.
