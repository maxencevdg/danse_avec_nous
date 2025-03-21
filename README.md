# 🔥 DANSE AVEC NOUS 🔥

Ce projet est une application web interactive qui utilise la reconnaissance de poses pour permettre aux utilisateurs de danser en suivant des mouvements prédéfinis. L'application utilise TensorFlow.js et Teachable Machine pour la reconnaissance des poses.

## Structure du projet

```
index.html
css/
  style.css
js/
  script.js
my_model/
  metadata.json
  model.json
  weights.bin
video/
  timecodes.json
  video2.mp4
```

- `index.html` : Le fichier HTML principal qui structure la page web.
- `css/style.css` : Le fichier CSS pour le style de la page.
- `js/script.js` : Le fichier JavaScript principal qui contient la logique de l'application.
- `my_model/` : Contient les fichiers du modèle de reconnaissance de poses.
  - `metadata.json` : Métadonnées du modèle.
  - `model.json` : Topologie du modèle.
  - `weights.bin` : Poids du modèle.
- `video/` : Contient les fichiers vidéo et les timecodes.
  - `timecodes.json` : Timecodes des poses attendues.
  - `video2.mp4` : Vidéo de danse.

## Installation

1. Clonez le dépôt :
   ```sh
   git clone <URL_DU_DEPOT>
   ```
2. Ouvrez le fichier `index.html` dans votre navigateur.

## Utilisation

1. Cliquez sur le bouton "Start" pour démarrer la vidéo et la reconnaissance de poses.
2. Suivez les mouvements indiqués dans la vidéo.
3. Le score sera mis à jour en fonction de la précision de vos poses.

## Auteur

- [Maxence](https://github.com/maxencevdg)
- [Guillaume](https://github.com/guigzlsx)
- [Jeff](https://github.com/26jeff)
- [Lionel](https://github.com/Lionel78570)
