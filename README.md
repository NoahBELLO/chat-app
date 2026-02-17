# Chat App – Jujutsu Kaisen

Projet réalisé par **Noah Bello** et **Lorenzo Cesana-Rale** dans le cadre du cours **Piscine JS**.

Ce projet est un **chatbot d’intelligence artificielle** inspiré de l’univers de **Jujutsu Kaisen**. L’IA adopte l’ambiance, le style et l’énergie du manga/anime, avec des réponses immersives et une interface pensée comme une discussion avec un exorciste jujutsu.

## Fonctionnalités principales

- Chat en temps réel avec une IA (API Groq)
- Historique des conversations sauvegardé en base de données (Firebase)
- Génération de CV, lettres de motivation, quiz, analyse de CV, etc.
- Authentification via Firebase
- Interface moderne avec React, TailwindCSS et composants personnalisés
- Conteneurisation complète avec Docker

## Technologies utilisées

- **Framework** : Next.js (App Router)
- **Langage** : JavaScript (pas de TypeScript)
- **Frontend** : React 19, TailwindCSS
- **Backend** : API Routes Next.js
- **Base de données** : Firebase
- **IA** : API Groq
- **Authentification** : Firebase / Firebase Admin
- **Containerisation** : Docker, Docker Compose

## Structure du projet

```
├── backend/                # Code backend (librairies, services, Prisma)
│   ├── lib/                # Librairies backend (connexion DB, Firebase admin)
│   ├── prisma/             # Schéma Prisma et migrations
│   └── services/           # Services métier (conversation, message, quiz)
├── data/                   # Dossier pour la base SQLite (app.db)
├── frontend/               # Code frontend (React, hooks, styles)
│   ├── components/         # Composants React (UI, chat, formulaires, etc.)
│   ├── hooks/              # Hooks personnalisés (API, auth, etc.)
│   ├── lib/                # Fonctions utilitaires frontend
│   ├── services/           # Services côté client
│   └── styles/             # Fichiers CSS (globals.css)
├── public/                 # Fichiers statiques (images, etc.)
├── src/app/                # Pages et routes API Next.js (App Router)
│   └── api/                # Routes API (chat, conversation, cv, quizz, etc.)
├── .env                    # Variables d’environnement (API keys, etc.)
├── Dockerfile              # Build et lancement de l’app en conteneur
├── docker-compose.yml      # Orchestration multi-conteneurs (ici, un seul service)
├── package.json            # Dépendances et scripts npm/pnpm
├── prisma.config.ts        # Configuration Prisma
└── server.js               # Serveur HTTP custom pour Next.js
```

## Installation & Lancement

### Prérequis

- Node.js 22+ (uniquement pour le développement local)
- pnpm (ou npm/yarn) (uniquement pour le développement local)
- Docker (recommandé pour exécuter l’application sans rien installer d’autre)

### 1. Cloner le dépôt

```bash
git clone <repo-url>
cd chat-app
```

### 2. Installer les dépendances (optionnel)

> ⚠️ **Si tu utilises uniquement Docker, tu peux ignorer cette étape :**
> L’installation locale des dépendances (`pnpm install` ou `npm install`) n’est nécessaire que si tu veux développer ou tester l’application sans Docker. Le conteneur Docker installe tout automatiquement lors du build.

```bash
pnpm install # ou npm install
```

### 3. Configurer les variables d’environnement

Copier le fichier `.env` fourni ou créer le vôtre à la racine :

```
GROQ_API_KEY=...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
MODEL_CHAT=openai/gpt-oss-20b
```

### 4. Générer le client Prisma et la base de données

```bash
npx prisma generate
npx prisma db push
```

### 5. Lancer en développement

```bash
pnpm dev # ou npm run dev
```

L’application sera disponible sur http://localhost:3000

### 6. Lancer en production (Docker)

```bash
docker compose up --build
```

L’application sera disponible sur http://localhost:3001

## Scripts utiles

- `pnpm dev` : Démarre le serveur Next.js en mode développement
- `pnpm build` : Build l’application pour la production
- `pnpm start` : Démarre le serveur Next.js en mode production
- `pnpm lint` : Lint le code avec ESLint

## Description des dossiers principaux

| Dossier/Fichier         | Rôle                                    |
|------------------------|------------------------------------------|
| `frontend/`            | Interface utilisateur React              |
| `backend/`             | Code backend, Prisma, services           |
| `src/app/api/`         | Routes API Next.js (chat, cv, quizz, etc)|
| `data/`                | Base de données SQLite                   |
| `public/`              | Fichiers statiques (images, etc.)        |
| `.env`                 | Variables d’environnement                |
| `Dockerfile`           | Build et exécution Docker                |
| `docker-compose.yml`   | Orchestration Docker Compose             |
| `server.js`            | Serveur HTTP custom pour Next.js         |

## Auteurs

- Noah Bello
- Lorenzo Cesana-Rale

## Licence

Projet réalisé dans un cadre pédagogique. Utilisation libre à des fins d’apprentissage.