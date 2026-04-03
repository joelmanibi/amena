# AMENA CONSULTING

Plateforme web AMENA CONSULTING avec :
- `frontend` : Next.js 15 / React 19
- `backend` : Express / Sequelize / MySQL

## Documentation complémentaire

- Mise en production : `README-PRODUCTION.md`

## Prérequis

- Node.js 20+
- MySQL
- npm

## Installation

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
npm install
```

## Commandes utiles

### Démarrer le frontend en développement

```bash
cd frontend
npm run dev
```

Site local : `http://localhost:3000`

### Build du frontend

```bash
cd frontend
npm run build
```

### Démarrer le frontend en production locale

```bash
cd frontend
npm run start
```

### Démarrer le backend

```bash
cd backend
npm start
```

### Démarrer le backend avec rechargement automatique

```bash
cd backend
npm run dev
```

### Seed de l’administrateur

```bash
cd backend
npm run seed:admin
```

## Variables d’environnement utiles

### Frontend (`frontend/.env.local`)

```env
API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Backend (`.env` à la racine du projet)

```env
PORT=5000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=amena_consulting
DB_USER=root
DB_PASSWORD=
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=1d
CORS_ORIGIN=http://localhost:3000
```

## Démarrage complet en local

### Terminal 1 — backend

```bash
cd backend
npm run dev
```

### Terminal 2 — frontend

```bash
cd frontend
npm run dev
```

## Notes

- Le backend écoute par défaut sur le port `5000`
- Le frontend écoute par défaut sur le port `3000`
- Les formations visibles publiquement doivent être au statut `published`
- Le backend lit ses variables depuis le fichier `.env` à la racine du projet