# Volta Studio — site web

Site vitrine statique : **HTML + CSS + JavaScript natif**, aucune dépendance à installer,
aucun outil de build. Tous les chemins sont **relatifs** — le dossier fonctionne tel quel,
où qu'il soit placé.

## Structure

```
mon-site/
├── index.html          Page unique (toutes les sections)
├── style.css           Styles complets
├── script.js           Interactions & motion design
├── README.md           Ce fichier
└── assets/
    ├── images/         Logo, favicon, logos clients
    └── fonts/          Voir README.txt (polices en local, optionnel)
```

## Lancer en local

Double-cliquez sur `index.html`. Pour un rendu identique à la production
(éviter les restrictions du protocole `file://`), servez le dossier :

```bash
cd mon-site
python3 -m http.server 8000     # puis ouvrez http://localhost:8000
```

## Mettre en ligne

Déposez le contenu du dossier `mon-site/` à la racine de votre hébergement.
Compatible sans configuration avec Netlify, Vercel, GitHub Pages, OVH, o2switch, Infomaniak…

## Modifier le contenu

| Quoi | Où |
|---|---|
| Textes, titres, sections | `index.html` |
| Couleurs, espacements, typo | `style.css` |
| Animations, carrousel, compteurs | `script.js` |
| Logos clients, favicon | `assets/images/` |

**Couleurs principales** — violet `#6E34DE`, violet clair `#9D6BFF`,
fond sombre `#0A0711`, fond clair `#FAFAFB`.

**Liens de contact** — les boutons pointent vers
`https://calendly.com/florent-voltastudio` (recherchez `calendly` dans `index.html`).

## Ajouter un logo client

1. Placez l'image dans `assets/images/`
2. Dans `index.html`, dupliquez un bloc dans `#logostrack` :

```html
<div class="logo-item"><div class="logo-c"><img src="assets/images/mon-logo.png" alt="Nom"></div></div>
```

Pour un logo **blanc**, ajoutez la classe `dark` : `<div class="logo-c dark">`.

## Notes techniques

- Aucun chemin absolu ni référence à un disque local — uniquement des chemins relatifs.
- Les deux canvas (préchargeur et hero) sont dessinés en JavaScript natif, sans librairie.
- Animations désactivables : supprimez l'appel correspondant dans la fonction `init()` de `script.js`.
