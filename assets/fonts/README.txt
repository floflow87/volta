DOSSIER POLICES
===============

Le site utilise deux familles :

1. Helvetica Neue / Helvetica / Arial  (titres et corps de texte)
   -> polices systeme, aucun fichier a fournir.

2. IBM Plex Mono  (labels, chiffres, terminal)
   -> chargee depuis Google Fonts via le <link> dans index.html.

POUR HEBERGER LES POLICES EN LOCAL (site 100% autonome, sans appel externe) :

1. Telechargez IBM Plex Mono ici : https://fonts.google.com/specimen/IBM+Plex+Mono
   (graisses necessaires : 400, 500, 600)
2. Placez les fichiers .woff2 dans ce dossier :
      assets/fonts/IBMPlexMono-Regular.woff2
      assets/fonts/IBMPlexMono-Medium.woff2
      assets/fonts/IBMPlexMono-SemiBold.woff2
3. Supprimez les 3 lignes <link> vers fonts.googleapis.com dans index.html
4. Ajoutez ceci EN HAUT de style.css :

@font-face{font-family:'IBM Plex Mono';src:url('assets/fonts/IBMPlexMono-Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'IBM Plex Mono';src:url('assets/fonts/IBMPlexMono-Medium.woff2') format('woff2');font-weight:500;font-display:swap}
@font-face{font-family:'IBM Plex Mono';src:url('assets/fonts/IBMPlexMono-SemiBold.woff2') format('woff2');font-weight:600;font-display:swap}
