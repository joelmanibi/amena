# AMENA Consulting — Mise en production

Ce document décrit une mise en production simple et stable du projet **AMENA Consulting** avec :

- `frontend/` : **Next.js 15**
- `backend/` : **Express 5 + Sequelize + MySQL**
- reverse proxy : **Nginx**

## Fichiers fournis dans le dépôt

- `ecosystem.config.js` : configuration PM2 prête à lancer
- `deploy/nginx/amena-consulting.conf` : configuration Nginx avec SSL
- `deploy/VPS-CHECKLIST.md` : checklist pas à pas pour un VPS

## Architecture recommandée

- **Nginx** expose le site canonique sur `https://www.amena-consulting.com`
- **Nginx** redirige `https://amena-consulting.com` vers `https://www.amena-consulting.com`
- **Nginx** expose l’API sur `https://api.amena-consulting.com`
- **Frontend Next.js** écoute en local sur `127.0.0.1:3000`
- **Backend Express** écoute en local sur `127.0.0.1:5000`
- **MySQL** héberge les données applicatives

## 1. Prérequis serveur

- Ubuntu 22.04 LTS ou équivalent
- Node.js **20+**
- npm
- MySQL **8+**
- Nginx
- PM2 recommandé pour garder les processus actifs

## 2. Variables d’environnement

### Backend

Le backend lit ses variables depuis le fichier **`.env` à la racine du dépôt**.

> Important : le fichier `backend/.env.exemple` sert d’exemple, mais le code charge réellement `../../.env` depuis `backend/src/config/env.js`.

Exemple de `.env` à la racine du projet :

```env
PORT=5000
NODE_ENV=production
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=amena_consulting
DB_USER=amena_user
DB_PASSWORD=mot_de_passe_mysql_fort
DB_SYNC=true
JWT_SECRET=remplacer-par-une-cle-secrete-longue-et-unique
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://www.amena-consulting.com
SEED_ADMIN_NAME=Admin Amena Consulting
SEED_ADMIN_EMAIL=admin@amena-consulting.com
SEED_ADMIN_PASSWORD=mot-de-passe-admin-fort
SEED_ADMIN_ROLE=SUPER_ADMIN
```

### Frontend

Créer `frontend/.env.production` ou définir ces variables dans l’environnement du service :

```env
API_BASE_URL=https://api.amena-consulting.com/api
NEXT_PUBLIC_API_URL=https://api.amena-consulting.com/api
NEXT_PUBLIC_SITE_URL=https://www.amena-consulting.com
```

## 3. Préparer MySQL

Créer la base et l’utilisateur avant le premier démarrage :

```sql
CREATE DATABASE amena_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'amena_user'@'localhost' IDENTIFIED BY 'mot_de_passe_mysql_fort';
GRANT ALL PRIVILEGES ON amena_consulting.* TO 'amena_user'@'localhost';
FLUSH PRIVILEGES;
```

## 4. Installation des dépendances

Depuis la racine du dépôt :

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

## 5. Build de production

```bash
cd frontend
npm run build
```

## 6. Lancement manuel (test de prod local)

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run start -- --hostname 127.0.0.1 --port 3000
```

## 7. Création du premier compte administrateur

Après connexion à la base et démarrage initial du backend, créer l’admin :

```bash
cd backend
npm run seed:admin
```

Ou avec des arguments explicites :

```bash
npm run seed:admin -- --email=admin@amena-consulting.com --password='MotDePasseTresFort!'
```

L’API de connexion admin est : `POST /api/auth/login`

## 8. Lancement avec PM2

Depuis la racine du dépôt :

```bash
pm2 start "npm start" --name amena-backend --cwd ./backend
pm2 start "npm run start -- --hostname 127.0.0.1 --port 3000" --name amena-frontend --cwd ./frontend
pm2 save
pm2 startup
```

## 9. Reverse proxy Nginx

Exemple de configuration :

Utiliser directement le fichier fourni : `deploy/nginx/amena-consulting.conf`

Activer ensuite le SSL avec Certbot.

## 10. Vérifications après déploiement

- `curl http://127.0.0.1:5000/health`
- ouvrir `https://www.amena-consulting.com`
- ouvrir `https://www.amena-consulting.com/admin/login`
- tester `https://api.amena-consulting.com/health`
- vérifier qu’un login admin fonctionne
- vérifier qu’une modification dans `/admin` est bien persistée en base

## 11. Points d’attention spécifiques à ce projet

1. **Fallback du contenu**
   - le frontend sait retomber sur du contenu statique si l’API n’est pas joignable pendant le build
   - cela évite de bloquer totalement `next build`

2. **Synchronisation Sequelize**
   - au moment actuel, le backend exécute `sequelize.sync()` au démarrage
   - la propriété `dbSync` est forcée à `true` dans `backend/src/config/env.js`
   - en production, il faut être prudent avant toute évolution de schéma

3. **CORS**
   - `CORS_ORIGIN` doit pointer vers `https://www.amena-consulting.com`

4. **URLs publiques**
   - `NEXT_PUBLIC_SITE_URL` doit être `https://www.amena-consulting.com`
   - l’URL API recommandée est `https://api.amena-consulting.com/api`

## 12. Déploiement d’une nouvelle version

```bash
git pull
cd backend && npm ci
cd ../frontend && npm ci && npm run build
pm2 restart amena-backend
pm2 restart amena-frontend
```

## 13. Recommandations complémentaires

- sauvegarder régulièrement la base MySQL
- utiliser un `JWT_SECRET` long et unique
- changer immédiatement le mot de passe admin seedé
- limiter l’accès SSH au serveur
- surveiller les logs `pm2 logs`