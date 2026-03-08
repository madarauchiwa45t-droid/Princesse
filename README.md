# 🎵 Megan — Lecteur Futuriste Vidéos & Musiques

<p align="center">
  <img src="./assets/logo.png" width="120" alt="Megan Logo"/>
</p>

<p align="center">
  Application React Native / Expo SDK 51 — Lecteur multimédia futuriste avec thème néon,<br/>
  lecture audio en arrière-plan, vidéo plein écran, playlists, PWA et APK Android.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK%2051-blue?logo=expo" />
  <img src="https://img.shields.io/badge/React%20Native-0.74-green?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20Web-orange" />
  <img src="https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/megan/build-android.yml?label=CI%2FCD" />
</p>

---

## ✨ Fonctionnalités

| Fonctionnalité | Détail |
|---|---|
| 🎵 Lecteur Audio | Lecture en arrière-plan, navigation entre pistes |
| 🎬 Lecteur Vidéo | Plein écran, barre de progression interactive |
| 📋 Playlists | Création, persistance AsyncStorage |
| 🎨 Thèmes | 3 préréglages néon + image personnalisée + opacité |
| 🔍 Recherche | Filtrage en temps réel musique & vidéos |
| 📱 Android APK | Installable directement (minSDK 24+) |
| 🌐 PWA | Progressive Web App complète |

---

## 📦 Installation

```bash
# Cloner le repo
git clone https://github.com/YOUR_USERNAME/megan.git
cd megan

# Installer les dépendances
npm install
```

---

## 🚀 Lancer l'application

```bash
# Expo Go (développement rapide)
npm start

# Android (émulateur ou appareil connecté)
npm run android

# Web (PWA)
npm run web
```

---

## 📱 Construire l'APK Android (installable)

### Méthode 1 — EAS Build (recommandée, cloud)

**Prérequis :**
1. Créer un compte sur [expo.dev](https://expo.dev)
2. Installer EAS CLI :
   ```bash
   npm install -g eas-cli
   ```
3. Se connecter :
   ```bash
   eas login
   ```
4. Configurer votre projet (une seule fois) :
   ```bash
   eas build:configure
   ```
5. Mettre à jour `app.json` avec votre **projectId** Expo.

**Générer l'APK :**
```bash
# APK installable directement sur Android (recommandé pour le test)
npm run build:apk

# AAB pour le Google Play Store
npm run build:aab

# APK en local (nécessite Java + Android SDK)
npm run build:local
```

> ✅ La première fois, EAS vous demandera de configurer le **keystore Android**.
> Choisissez **"Let EAS manage it"** pour une gestion automatique et sécurisée.

---

### Méthode 2 — Build local (sans compte Expo)

**Prérequis :** Java 17, Android Studio, variable `ANDROID_HOME`.

```bash
# Générer le projet natif Android
npx expo prebuild --platform android --clean

# Compiler en APK debug
cd android && ./gradlew assembleDebug

# APK généré dans :
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🤖 GitHub Actions (CI/CD)

Le workflow `.github/workflows/build-android.yml` se déclenche automatiquement :
- Sur chaque push sur `main` ou `master`
- Manuellement via **Actions → Run workflow** (choix preview ou production)

**Configuration requise :**

Dans les **Settings → Secrets** de votre repo GitHub, ajouter :

| Secret | Valeur |
|--------|--------|
| `EXPO_TOKEN` | Token EAS depuis [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens) |

---

## 🗂️ Structure du projet

```
Megan/
├── .github/
│   └── workflows/
│       └── build-android.yml    # CI/CD GitHub Actions
├── App.tsx                       # Point d'entrée + SplashScreen
├── app.json                      # Config Expo SDK 51 (Android + iOS + Web)
├── eas.json                      # Config EAS Build (APK/AAB)
├── metro.config.js               # Config Metro bundler
├── babel.config.js               # Babel + reanimated plugin
├── tsconfig.json                 # TypeScript strict
├── webpack.config.js             # Config PWA webpack
├── .gitignore
├── public/
│   ├── manifest.json             # Manifest PWA
│   └── service-worker.js         # Service Worker
├── assets/
│   ├── logo.png
│   └── backgrounds/
│       ├── neon-blue.jpg
│       ├── cyber-violet.jpg
│       └── holo-cyan.jpg
├── navigation/
│   ├── RootNavigator.tsx         # Bottom Tabs
│   ├── MusicStackNavigator.tsx   # Stack Musique
│   └── VideoStackNavigator.tsx   # Stack Vidéos
├── screens/
│   ├── HomeScreen.tsx
│   ├── MusicScreen.tsx           # Pagination + Recherche
│   ├── NowPlayingScreen.tsx      # ✅ Seek + Visualiseur + isMounted fix
│   ├── VideoScreen.tsx           # Pagination + Recherche
│   ├── VideoPlayerScreen.tsx     # ✅ Barre de progression + Plein écran
│   ├── PlaylistsScreen.tsx       # Persistance AsyncStorage
│   └── SettingsScreen.tsx
├── components/
│   ├── MiniPlayer.tsx            # Lecteur mini avec play/pause
│   ├── EqualizerVisualizer.tsx   # 7 barres animées
│   └── BackgroundCustomizer.tsx  # Préréglages + Image + Opacité
├── services/
│   ├── playerAudio.ts            # ✅ InterruptionMode corrigé + resume()
│   └── asyncHelpers.ts           # AsyncStorage helpers
└── theme/
    └── ThemeContext.tsx           # Thème persistant typé
```

---

## 🔧 Améliorations v1.1.0

| Fichier | Correction |
|---------|-----------|
| `package.json` | Mise à jour Expo SDK 48 → **51**, TypeScript 5.3, types React |
| `app.json` | `FOREGROUND_SERVICE_MEDIA_PLAYBACK`, `minSdkVersion 24`, Hermes, `expo-av` plugin |
| `eas.json` | Node 20, `autoIncrement`, `credentialsSource`, meilleurs profils |
| `services/playerAudio.ts` | `InterruptionModeIOS.DoNotMix` / `InterruptionModeAndroid.DoNotMix` (enum correct) + `resume()` |
| `screens/NowPlayingScreen.tsx` | `isMountedRef` anti-fuite mémoire, dépendances `useEffect` corrigées |
| `screens/VideoPlayerScreen.tsx` | ✅ **Nouvelle barre de progression vidéo** avec seek |
| `metro.config.js` | Nouveau fichier, résolution assets |
| `tsconfig.json` | `strict`, `noImplicitAny`, exclusions build |
| `.gitignore` | Complet (node_modules, .expo, .env, keystore…) |
| `.github/workflows/` | ✅ **CI/CD GitHub Actions** — build APK automatique |

---

## 🌐 Déploiement Web (PWA)

```bash
# Exporter en PWA statique
npx expo export:web

# Déployer le dossier web-build/ sur :
# - Vercel : vercel deploy ./web-build
# - Netlify : netlify deploy --dir=web-build
# - GitHub Pages : voir ci-dessous
```

### GitHub Pages
```bash
npm install -g gh-pages
npx expo export:web
gh-pages -d web-build
```

---

## 📋 Permissions Android

| Permission | Utilité |
|-----------|---------|
| `READ_MEDIA_AUDIO` | Lire les fichiers audio (Android 13+) |
| `READ_MEDIA_VIDEO` | Lire les fichiers vidéo (Android 13+) |
| `READ_EXTERNAL_STORAGE` | Compatibilité Android < 13 |
| `FOREGROUND_SERVICE` | Lecture audio en arrière-plan |
| `FOREGROUND_SERVICE_MEDIA_PLAYBACK` | Service média Android 14+ |
| `WAKE_LOCK` | Empêcher la mise en veille pendant lecture |

---

## 🛠️ Scripts disponibles

```bash
npm start          # Expo Dev Server
npm run android    # Lancer sur Android
npm run web        # Lancer en web/PWA
npm run build:apk  # Build APK (EAS cloud)
npm run build:aab  # Build AAB production (EAS cloud)
npm run build:local # Build APK local
npm run type-check # Vérification TypeScript
```

---

## 📄 Licence

MIT © Megan Player
