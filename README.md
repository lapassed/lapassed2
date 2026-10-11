# Handoff : site vitrine La Passe D

## Overview
Site vitrine one-page de **La Passe D**, association qui organise des tournois de basket 3x3 à Strasbourg et en Alsace (partenaire : Le Basket Center). Objectif : donner envie de s'inscrire au prochain tournoi / s'abonner à l'alerte email. Public majoritairement mobile, venant d'Instagram et TikTok.

Cible technique : **HTML/CSS/JS statique, sans framework, hébergé sur GitHub Pages** (domaine lapassed.fr). Mobile-first, bon score Core Web Vitals.

## About the Design Files
`reference/La Passe D.dc.html` est une **référence de design créée en HTML** (prototype qui montre le rendu et le comportement attendus), pas du code de production. Il tourne sur un petit runtime React interne (`support.js`) — **ne pas le réutiliser**. La tâche : **recréer ce design en HTML/CSS/JS vanilla statique** (`index.html` + `styles.css` + `main.js`), avec tout le texte important écrit en dur dans le HTML (SEO), le JS ne servant qu'aux animations et interactions.

Pour voir le prototype : servir le dossier `reference/` en local (`npx serve reference`) et ouvrir `La Passe D.dc.html`. Toute la logique d'animation est dans la classe `Component` en bas du fichier — c'est la source de vérité pour les courbes et timings.

## Fidelity
**High-fidelity.** Couleurs, typo, espacements, copy et animations sont finaux. Reproduire fidèlement.

## Structure de la page (ordre)
1. Nav fixe · 2. Hero · 3. Notre mission (+ compteurs) · 4. Highlights (galerie horizontale) · 5. Prochains événements · 6. Le 3x3 en bref · 7. Partenaires · 8. FAQ · 9. Alerte email (+ panier) · 10. Footer.
Ancres : `#accueil #association #galerie #tournois #format #partenaires #faq #alerte #contact`.

Conteneur : `max-width:1440px; margin:0 auto; padding-inline: clamp(20px,5vw,64px)`. Padding vertical des sections : ~`clamp(80px,10vw,150px)`.

### 1. Navigation (fixe, z 60)
- Logo (gauche, hauteur 44px) : `Logo v3.PNG` en mode clair, `logo blanc.png` en mode sombre.
- Desktop (≥900px) : liens L'Association, Galerie, Tournois, Partenaires, FAQ (15px/500) + bouton pilule « Nous contacter » (46px de haut, bg `--strong`, texte `--onStrong`, 700) → `#contact` + bouton rond 46px mode clair/sombre (icône cercle à moitié plein).
- Mobile (<900px) : toggle thème + burger rond 46px → overlay plein écran `#121822`, liens 42px/800 uppercase, CTA « Nous contacter » bas d'écran (`#99DAFF`). Fermer au clic sur un lien.
- Au scroll > 30px : fond `--navbg` + `backdrop-filter: blur(14px)` + `box-shadow: 0 1px 0 var(--line)` (transition .35s).

### 2. Hero (min-height 100svh, contenu aligné en bas)
- Ligne mono 12px, tracking .16em, uppercase : « ● Basket 3x3 · Strasbourg · Alsace · Loisir / Elite ».
- **H1 (garder exactement ce texte)** : « La Passe D – Tournois de basket 3x3 à Strasbourg ».
  - « La Passe D – » : bloc, `clamp(15px,1.5vw,22px)`, 700, tracking .1em, couleur `--accentText`.
  - « Tournois de basket 3x3 » : Outfit 900 uppercase, `clamp(44px,10.4vw,172px)`, line-height .88, letter-spacing -.035em, max-width 13ch. « 3x3 » surligné : bg `#6EA4E6`, texte `#121822`, padding 0 .1em.
  - « à Strasbourg » : texte transparent, `-webkit-text-stroke: clamp(1.2px,.16vw,2.4px) var(--ink)`.
- Sous-titre (`clamp(19px,1.8vw,24px)`, 300) : « Organisateur de tournois de basket 3x3. **L'accès à la culture basketball pour tous.** » (partie en gras 800).
- Boutons (58px, pilule, 17px) : « Voir les tournois → » (bg `#6EA4E6`, texte `#121822`, 800) → `#tournois` ; « Découvrir l'asso » (bordure 1.5px `--ink`) → `#association`.
- Bloc prochain tournoi (à droite, passe à la ligne sur mobile) :
  - **Aucune date (état actuel)** : label mono « Prochain tournoi » + « ● BIENTÔT... » (`clamp(40px,5.2vw,76px)` 900 uppercase, pastille 14px `#6EA4E6` avec halo) + « Active l'alerte pour être prévenu en premier → », le tout lien vers `#alerte`.
  - **Date définie** : label « Le prochain tournoi commence dans » + compte à rebours J/H/Min/Sec. Chaque chiffre est une tuile (`clamp(30px,4vw,50px)` × `clamp(46px,5.8vw,72px)`, bg `--tile`, texte `--tileInk`, radius 6, 800 tabular-nums, ligne de séparation au milieu `rgba(255,255,255,.16)`). Quand un chiffre change, il bascule : `rotateX(-95deg)→0`, opacity .3→1, .55s `cubic-bezier(.2,.8,.2,1)`, transform-origin haut.
  - Prévoir une config simple en haut de `main.js` : `const NEXT_EVENT = { date: null, title, partner, link }`. `date: null` → état « Bientôt... ».
- Indicateur « — SCROLL » mono 11px en bas.

### 3. Notre mission
- H2 « Notre / mission » (`clamp(52px,9vw,148px)` 900 uppercase, lh .86 ; « mission » en contour). À droite : « Plus qu'un sport, **un état d'esprit.** ».
- 3 cartes (grid `repeat(auto-fit,minmax(300px,1fr))`, gap 16, radius 18, min-height 340, padding `clamp(26px,3vw,40px)`). En haut une ligne mono numéro/label, en bas le titre (`clamp(30px,3vw,40px)` 800) + le texte (17px/1.55) :
  - 01 TOURNOIS — **Tournois 3x3** — « Des événements compétitifs et conviviaux en plein cœur de la ville, pour tous les niveaux. Rejoins le grind. »
  - 02 CULTURE — **Culture basket** — « Art, musique et lifestyle. On célèbre tout ce qui gravite autour de la balle orange. » (carte pleine `#6EA4E6`, texte `#121822`)
  - 03 COMMUNAUTÉ — **Communauté** — « Créer du lien, échanger et partager la passion du basket avec une communauté soudée et bienveillante. »
- Compteurs (bordure haute 1.5px `--ink`, grid auto-fit 220px) : nombre `clamp(64px,7vw,104px)` 900 + label 16px `--ink2`. **⚠ VALEURS PROVISOIRES à remplacer par les vraies** : 2 Student Nights organisées · 48 équipes inscrites · 96 matchs joués · 170 joueurs et joueuses.

### 4. Nos highlights (galerie horizontale pilotée par le scroll)
- Section de hauteur `100vh + (largeurPiste − largeurViewport)`, enfant `position:sticky; top:0; height:100svh`.
- Header : H2 « Nos highlights » (`clamp(44px,7vw,112px)`) + « L'intensité du 3x3 en images. »
- Piste flex, gap `clamp(14px,2vw,28px)`, 5 `<figure>` de tailles alternées (voir proto, ex. `clamp(260px,40vw,600px)` × `clamp(300px,56vh,600px)`), radius 6, légendes mono « 01 — LE DUNK », « 02 — L'ENVOL », « 03 — LE SHOOT », « 04 — LA TEAM », « 05 — STREETBALL ».
- Images `loading="lazy" decoding="async"`, avec width/height, `object-fit:cover`, `filter: contrast(1.12) saturate(1.05)`. Alts : reprendre ceux du site actuel (voir proto).
- Scroll : `translateX(-progression × longueurPiste)`. Pour chaque carte : `offset = (centreCarte − centreViewport)/largeurViewport` ; carte `scale(1 − min(|offset|,1)×0.08)` ; image `translateX(−offset×9%) scale(1.18)` (parallaxe).
- Chaque carte se révèle par masque (`clip-path: inset(100% 0 0 0) → inset(0)`, 1.2s).

### 5. Prochains événements
- H2 « Prochains / événements » + « Survole une carte (ou touche-la sur mobile) pour voir l'envers du décor. »
- Grid `repeat(auto-fill,minmax(290px,1fr))`, gap 16, cartes de 420px, radius 18.
- **Cartes retournées** (perspective 1400px, `transform-style:preserve-3d`, `rotateY(180deg)` en .8s `cubic-bezier(.2,.8,.2,1)`, faces avec `backface-visibility:hidden`). Desktop : au survol. Tactile : au tap (sauf sur un lien).
  1. **Prochain tournoi** — si pas de date : carte pleine `#6EA4E6` (pas de retournement), « PROCHAIN TOURNOI », « BIENTÔT... » (`clamp(56px,6vw,80px)` 900), « La date n'est pas encore annoncée. Sois le premier au courant. », bouton « M'alerter → » (`#121822`) → `#alerte`. Si date définie : recto bleu avec jour (88px), mois/année, titre, partenaire ; verso `#121822` avec « Catégories Loisir et Elite / Équipes de 3 ou 4 / Places limitées » + bouton « S'inscrire → » (`#99DAFF`).
  2. **Sondage** — recto : badge « SONDAGE », « Aide-nous à préparer le prochain tournoi ! », « On prépare notre premier grand tournoi 3x3 à Strasbourg. Donne ton avis en 3 minutes. » ; verso : « 3 MINUTES », « Format, horaires, catégories, ambiance : **ton avis construit l'événement idéal.** », bouton « Donner mon avis → » → https://forms.gle/GD2G6Wc5VQ66uXCr9
  3. **Student Night Easter** — 2 avril 2026 — avec Le Basket Center — badge « PASSÉ ». Image `gallery-3.jpg` (180px de haut, `grayscale(1) contrast(1.3)`). Verso : « Merci à toutes les équipes. Retrouve les meilleurs moments en images. » → `#galerie`.
  4. **Student Night: The Last Dance** — 20 mai 2026 — avec Le Basket Center — « PASSÉ ». Image `gallery-5.jpg`. Verso : « La dernière de la saison. Rendez-vous au prochain tip-off. » → `#alerte`.

### 6. Le 3x3 en bref (bande pleine largeur `#6EA4E6`, texte `#121822`, dans les deux thèmes)
- Gauche : H2 « Le 3x3 / en bref » + SVG de demi-terrain (viewBox `0 0 600 440`, trait `#121822` 3px, chemins dans le proto) avec 6 joueurs (3 ronds pleins `#121822` r15, 3 ronds blancs r13).
- Droite : 4 lignes séparées par des bordures de 2px : **3** « contre 3, plus un remplaçant si tu veux » · **½** « terrain, pour un jeu rapide et intense » · **1** « seul panier, aucune pause » · **2021** « discipline olympique depuis Tokyo ».
- Animation à l'entrée dans le viewport : chaque chemin se trace (`pathLength=1`, dashoffset 1→0, 1.3s, décalage 140ms), puis les joueurs apparaissent (scale 0→1.25→1, décalage 110ms) ; les chiffres comptent (2021 part de 1990).

### 7. Partenaires
- H2 « Partenaires » + « Ils font vivre le 3x3 à Strasbourg avec nous. »
- Bandeau qui défile entre deux filets de 1.5px : « LE BASKET CENTER • TA MARQUE ICI • … » (`clamp(36px,5vw,72px)` 900 ; « Ta marque ici » en contour), contenu dupliqué, `translateX(0 → -50%)` en boucle sur 32s, ralenti (×0.3) au survol. **Remplacer par les vrais logos** quand ils seront disponibles.
- Bloc CTA (bg `--strong`, radius 18) : « Devenir partenaire » + « Associe ta marque à la scène 3x3 strasbourgeoise et touche une communauté jeune, active et passionnée. » + bouton « Écris-nous → » → `mailto:lapassed52@gmail.com?subject=Devenir partenaire de La Passe D`.

### 8. FAQ (accordéon, un seul ouvert à la fois, le 1er ouvert par défaut)
Utiliser `<button aria-expanded>` dans un `<h3>`. L'ouverture anime `grid-template-rows: 0fr → 1fr` (.5s). Icône « + » dans un cercle de 36px dont la barre verticale tourne de 90° quand l'item est ouvert.
Questions/réponses (identiques au JSON-LD) :
1. Comment inscrire mon équipe à un tournoi ? — Les inscriptions se font entièrement en ligne via les liens de la section « Prochains événements ». Attention, les places sont limitées !
2. Faut-il forcément une équipe de 4 (3+1) ? — Non, tu peux venir à 3. Mais en cas de blessure, ton équipe devra finir le tournoi à 2 ou déclarer forfait. Un remplaçant, c'est plus sûr.
3. Quel est le niveau attendu ? — Tous les passionnés sont les bienvenus, du pur amateur au joueur confirmé. Nos tournois sont découpés en catégories Loisir et Elite pour que chaque match soit équilibré.
4. Où se déroulent les tournois ? — À Strasbourg et en Alsace, notamment avec notre partenaire Le Basket Center. Le lieu exact est indiqué sur chaque événement.
5. Comment connaître la date du prochain tournoi ? — Active l'alerte email en bas de page et suis-nous sur Instagram et TikTok (@lapassed_off). Le compte à rebours apparaît en haut du site dès qu'une date est fixée.
6. C'est quoi le 3x3 ? — Du basket à 3 contre 3 sur un demi-terrain, avec un seul panier. Rapide, intense et spectaculaire, c'est une discipline olympique depuis les Jeux de Tokyo en 2021.

### 9. Alerte email
- H2 « Ne manque pas le prochain tournoi ! » + « Inscris-toi à l'alerte email et sois le premier averti de l'ouverture des inscriptions. »
- Formulaire : input email (60px, pilule, bordure 1.5px `--ink`, label masqué « Ton adresse email ») + bouton « M'alerter ». Validation : `type=email required`. Succès : pastille `#99DAFF` « C'est noté ! Tu seras le premier averti. » (`role="status"`).
- **À brancher** : le proto ne fait rien côté serveur. Utiliser un service compatible avec un site statique (Brevo, Formspree, Mailchimp embed…).
- Mention : « Tes données ne seront jamais revendues et servent uniquement à t'avertir de nos événements. »
- À droite, le **panier** (décoratif, `aria-hidden`) : panneau `min(300px,70vw)`, ratio 1.6, bordure 5px `--ink`, radius 8, carré intérieur ; cercle `#DE6A24` (46% de largeur, 12px de haut, ombre `0 3px 0 #9E410E`, **z-index 36**) ; filet (42% × 96px, trapèze en `clip-path`, losanges en `repeating-linear-gradient` ±62°, **z-index 35**, au-dessus du ballon) ; texte « Swish. » qui apparaît quand le ballon passe dans le cercle.
- ⚠ Ne mettre aucun transform/opacity animé sur les ancêtres du panier : cela casserait l'ordre d'empilement avec le ballon fixe.

### 10. Footer (`#121822`, id `contact`)
Logo blanc + « Organisation de tournois de basket 3x3 à Strasbourg et en Alsace. » · LIENS RAPIDES (L'Association, Tournois, FAQ, Avis tournoi 3x3 → formulaire Google) · CONTACT `lapassed52@gmail.com` · RÉSEAUX : Instagram https://www.instagram.com/lapassed_off, TikTok https://www.tiktok.com/@lapassed_off, LinkedIn https://www.linkedin.com/company/la-passe-d-off. Wordmark géant « LA PASSE D » en contour (`clamp(64px,17vw,280px)`, stroke `rgba(153,218,255,.55)`, aria-hidden). Ligne finale : « © 2026 La Passe D. Tous droits réservés. » + « Retour en haut ↑ ».

## Interactions & animations (cœur du projet)
Toutes les animations scrollées passent par **une seule boucle `requestAnimationFrame` déclenchée par le scroll** (listener `passive`), qui n'anime que `transform` et `opacity`. Mesures recalculées au resize, au chargement des polices, à `load` et via `ResizeObserver`.

### A. Le parcours du ballon (fil rouge du début à la fin)
Un seul ballon `position:fixed` (div de base 200×200, positionné par `translate3d(x−100, y−100) scale(taille/200)`), avec une couche de coutures qui tourne (`rotate(scrollY × 0.32deg)`) sous une couche d'ombrage fixe. Le dégradé et les coutures sont en CSS (voir proto). Positions-clés, interpolées en easeInOut sauf mention contraire (W/H = viewport, `mob` = W<900) :
| # | scrollY | x | y (viewport) | taille | opacité |
|---|---|---|---|---|---|
| 0 | 0 | 0.75W (mob 0.78W) | 0.42H (mob 0.27H) | min(0.32W,470) (mob min(0.52W,260)) | 1 |
| 1 | haut mission − 0.45H | 0.5W | 0.5H | hypot(W,H)×1.35 (**le ballon grossit jusqu'à remplir l'écran**) | 0.08 |
| 2 | bas mission − 1.05H | idem | idem | idem | 0.08 |
| 3 | haut galerie | 56 (mob 28) | H−68 | 54 (mob 34) | 1 |
| 4 | haut galerie + longueur piste | W−56 | H−68 | 54 | 1 (x linéaire : le ballon roule sous la galerie) |
| 5 | haut événements | W−45 | 0.62H | 54 | 1 — **dribble** entre 5 et 6 : `y −= |sin((scrollY−y5)/85)| × 84 (mob 46) × sin(π·t)` |
| 6 | k7 − 320 | centre du cercle − 240 (mob −120) | doc : cercle − 280 | 0.74 × largeur du cercle | 1 |
| 7 | k7 = min(centre du cercle − 0.55H, maxScroll − 200) | centre du cercle | doc : centre du cercle − 0.2×taille | idem | 1 (x easeOut, y easeIn : trajectoire de tir) |
| 8 | k7 + 180 | centre du cercle | doc : cercle + 1.05×taille | ×0.96 | 1 (y easeIn : traverse le filet) |
« doc : » = coordonnée dans la page (y_viewport = y_doc − scrollY), pour que le ballon reste accroché au panier puis défile avec la page.
- z-index : **−1** (derrière le contenu) quand taille > 320px ou scrollY < 0.85H (dans le hero il ne doit jamais masquer le H1) ; sinon **30** (au-dessus du contenu, sous le filet du panier).
- Au franchissement de k7 vers le bas : le filet fait `scale(1,1)→(.86,1.28)→(1.04,.94)→1` (650ms) et « Swish. » apparaît puis disparaît (1.6s).
- Arrivée au chargement : le ballon tombe d'en haut avec rebonds amortis et écrasement (1.6s, offsets 0/.5/.66/.8/.9/1, voir `intro()`).

### B. Demi-terrain tracé à la craie en fond
SVG `position:fixed`, centré, `width:min(150vw,1500px)`, top 9vh, z −2, trait `--chalk` 2.6px. 7 chemins (`pathLength=1`, dasharray 1). Avec p = scrollY/maxScroll, chemin j : `dashoffset = 1 − clamp((p×1.15 − j/7×0.55)/0.3)`. Le terrain se dessine donc progressivement sur toute la page.

### C. Titre lettre par lettre
Au chargement, découper le H1 en mots (`inline-block; nowrap`) puis en lettres (`inline-block`). Mettre `aria-label` avec le texte complet sur le H1 et `aria-hidden` sur les spans. Chaque lettre : `opacity 0, translateY(.55em) rotate(6deg), blur(6px) → normal`, 760ms, délai 250 + i×26ms. Ensuite, la ligne d'infos, le sous-titre/les boutons et le compte à rebours arrivent en fondu (délai 900 + i×140ms). Parallaxe du hero au scroll : `translateY(scrollY×0.18)`, opacité `1 − 0.9×clamp(scrollY/0.9H)`.

### D. Apparitions au scroll
IntersectionObserver (threshold .12, rootMargin bas −6%), uniquement pour les éléments sous la ligne de flottaison : `up` = opacity 0 + translateY(56px) → 0 (900ms) ; `mask` = clip-path (1200ms). Easing commun `cubic-bezier(.2,.8,.2,1)`, délais échelonnés de 80 à 300ms.

### E. Compteurs
De 0 (ou `data-from`) jusqu'à la cible, en 1.7s easeOutQuart, quand 50% visible. La valeur finale reste écrite dans le HTML.

### F. Boutons magnétiques + ripple
`[data-magnetic]` : sur pointeur fin, translate de (pointeur − centre) × (0.28, 0.4), retour en .35s. Au `pointerdown` : cercle `currentColor` à .3 d'opacité qui part du point de clic, scale 0→1 en 650ms puis disparaît (aussi sur mobile).

### G. Curseur ballon (desktop uniquement)
Seulement si `(pointer:fine)` et sans reduced-motion. Ballon de 26px qui suit la souris avec un lissage (lerp 0.22) et tourne selon la vitesse horizontale. Il grossit ×1.9 sur les liens, boutons, champs et cartes. Masquer le curseur natif (sauf dans les inputs).

### H. Thème clair / sombre
Variables CSS sur `html[data-theme]`. **Le sombre est le thème par défaut.** Choix mémorisé dans `localStorage('lpd-theme')`. Appliquer le thème avant le premier rendu (petit script inline dans `<head>`) pour éviter un flash.

### prefers-reduced-motion
Pas de découpage en lettres, d'apparitions, de compteurs, de marquee, de magnétisme ni de curseur. Ballon statique dans le hero qui disparaît en fondu ; terrain dessiné d'office. Galerie en scroll horizontal natif (`overflow-x:auto`, sans sticky). Les retournements de cartes et l'accordéon restent.

### Mobile / performance
Animations uniquement en `transform`/`opacity`, avec `will-change` limité au ballon, à la piste et au hero. Pas de layout dans la boucle, sauf la lecture des 5 rects de la galerie. Grain : SVG `feTurbulence` fixe à .07 d'opacité (envisager une petite PNG en tuile si le mobile rame). Polices : précharger Outfit (300–900) et JetBrains Mono (400, 600), avec `display=swap`.

## Design tokens
Polices : **Outfit** (titres 800–900 uppercase, letter-spacing −.02 à −.04em, line-height .85–.9 ; texte 300–700) + **JetBrains Mono** 400/600 pour les labels (11–13px, tracking .12–.2em, uppercase).

| Token | Clair | Sombre (défaut) |
|---|---|---|
| --bg | #FFFFFF | #0F172A |
| --bg2 | #F2F5F9 | #121822 |
| --ink | #121822 | #FFFFFF |
| --ink2 | #465266 | #AAB6C8 |
| --line | rgba(18,24,34,.13) | rgba(255,255,255,.13) |
| --chalk | rgba(18,24,34,.11) | rgba(255,255,255,.12) |
| --card | #FFFFFF | #121822 |
| --accentText | #2C68B0 | #99DAFF |
| --navbg | rgba(255,255,255,.84) | rgba(15,23,42,.82) |
| --tile / --tileInk | #121822 / #FFF | #1C2536 / #99DAFF |
| --strong / --onStrong | #121822 / #FFF | #99DAFF / #121822 |

Couleurs de marque : bleu nuit `#121822`, bleu `#6EA4E6`, bleu clair `#99DAFF`, blanc. Ballon : `#F2A15C → #DE6A24 → #9E410E`, coutures `#3B1806`.
Rayons : 6 (photos, tuiles), 8 (panneau), 18 (cartes), 999 (boutons). Easing principal : `cubic-bezier(.2,.8,.2,1)`.
Texte sur `#6EA4E6` : toujours `#121822` (jamais du blanc, contraste insuffisant).

## SEO (obligatoire)
- `<title>La Passe D – Tournois de basket 3x3 à Strasbourg et en Alsace</title>`
- H1 exact : « La Passe D – Tournois de basket 3x3 à Strasbourg ».
- Meta description, canonical, Open Graph et Twitter card, puis JSON-LD **SportsOrganization** et **FAQPage** : tout est déjà dans le `<head>` du proto, à recopier tel quel.
- Tout le contenu écrit en dur dans le HTML. `lang="fr"`.

## Assets
Tous sur le site actuel (à copier dans `/assets/images/` du repo) :
- `https://lapassed.fr/assets/images/Logo%20v3.PNG` (logo pour le thème clair) et `logo%20blanc.png` (logo pour le thème sombre, nav mobile, footer).
- `gallery-1.jpg` … `gallery-5.jpg` (galerie, cartes d'événements, og:image). Les convertir en WebP/AVIF avec `srcset` (≈ 600/1200w).
Aucune icône : tout est en CSS.

## Contenus encore à fournir
- Vrais chiffres des compteurs.
- Date, titre et lien d'inscription du prochain tournoi (« Bientôt... » d'ici là).
- Logos partenaires.
- Service d'envoi pour l'alerte email.

## Files
- `reference/La Passe D.dc.html` : prototype complet (balisage, styles inline, et classe `Component` qui contient toute la logique d'animation : `measure()`, `update()`, `split()`, `reveals()`, `counters()`, `draws()`, `pointer()`, `marquee()`, `intro()`, `countdown()`).
- `reference/support.js` : runtime du prototype uniquement, à ne pas réutiliser.
