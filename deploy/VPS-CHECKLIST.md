# Checklist VPS — AMENA Consulting

## 1. Préparer le serveur

- créer un utilisateur non-root
- configurer l’accès SSH par clé
- activer le firewall (`ufw allow OpenSSH`, `ufw allow 80`, `ufw allow 443`)
- installer les paquets : `git`, `curl`, `nginx`, `mysql-server`

## 1 bis. Vérifier le DNS

- domaine principal : `amena-consulting.com`
- domaine web canonique : `www.amena-consulting.com`
- sous-domaine API : `api.amena-consulting.com`
- IP du serveur : `173.249.24.245`
- créer / vérifier les enregistrements `A` suivants :
  - `@` → `173.249.24.245`
  - `www` → `173.249.24.245`
  - `api` → `173.249.24.245`

## 2. Installer Node.js 20+

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

## 3. Installer PM2

```bash
sudo npm install -g pm2
pm2 -v
```

## 4. Cloner le projet

```bash
cd /opt
sudo git clone <URL_DU_REPO> amena
sudo chown -R $USER:$USER /opt/amena
cd /opt/amena
```

## 5. Créer la base MySQL

- créer la base `amena_consulting`
- créer un utilisateur dédié
- attribuer les droits sur cette base

## 6. Créer les fichiers d’environnement

### Racine du projet : `.env`

- configurer `PORT=5000`
- configurer `NODE_ENV=production`
- configurer les variables MySQL
- configurer `JWT_SECRET`
- configurer `CORS_ORIGIN=https://www.amena-consulting.com`
- configurer `BACKEND_PUBLIC_URL=https://api.amena-consulting.com`

### Frontend : `frontend/.env.production`

- configurer `API_BASE_URL=https://api.amena-consulting.com/api`
- configurer `NEXT_PUBLIC_API_URL=https://api.amena-consulting.com/api`
- configurer `NEXT_PUBLIC_SITE_URL=https://www.amena-consulting.com`

## 7. Installer les dépendances

```bash
cd /opt/amena/backend && npm ci
cd /opt/amena/frontend && npm ci
```

## 8. Construire le frontend

```bash
cd /opt/amena/frontend
npm run build
```

## 9. Lancer avec PM2

```bash
cd /opt/amena
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 10. Créer l’admin initial

```bash
cd /opt/amena/backend
npm run seed:admin
```

## 11. Installer la config Nginx

```bash
sudo cp /opt/amena/deploy/nginx/amena-consulting.conf /etc/nginx/sites-available/amena-consulting
sudo ln -s /etc/nginx/sites-available/amena-consulting /etc/nginx/sites-enabled/amena-consulting
sudo rm -f /etc/nginx/sites-enabled/default
```

## 12. Installer le SSL Certbot

### Étape 12.1 — Vérifier les prérequis avant le certificat

- vérifier que les DNS pointent bien vers `173.249.24.245`
- vérifier que les ports `80` et `443` sont ouverts
- vérifier que Nginx est installé : `nginx -v`
- vérifier que Certbot n’est pas déjà présent : `certbot --version`

### Étape 12.2 — Installer Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
```

### Étape 12.3 — Arrêter Nginx temporairement

Le fichier Nginx de production référence déjà les chemins du certificat SSL. Tant que le certificat n’existe pas encore, `nginx -t` peut échouer. Le plus simple est donc :

```bash
sudo systemctl stop nginx
```

### Étape 12.4 — Générer le certificat Let’s Encrypt

Remplacer `admin@amena-consulting.com` par ton vrai email de réception des alertes SSL.

```bash
sudo certbot certonly --standalone \
  -d amena-consulting.com \
  -d www.amena-consulting.com \
  -d api.amena-consulting.com \
  --agree-tos \
  -m admin@amena-consulting.com \
  --no-eff-email
```

### Étape 12.5 — Vérifier que les certificats existent

```bash
sudo ls -la /etc/letsencrypt/live/amena-consulting.com/
```

Tu dois voir notamment :

- `fullchain.pem`
- `privkey.pem`

### Étape 12.6 — Tester la configuration Nginx

```bash
sudo nginx -t
```

Si la configuration est valide, tu dois obtenir un message du type :

- `syntax is ok`
- `test is successful`

### Étape 12.7 — Redémarrer Nginx

```bash
sudo systemctl start nginx
sudo systemctl reload nginx
```

### Étape 12.8 — Vérifier que le HTTPS répond bien

```bash
curl -I https://www.amena-consulting.com
curl -I https://api.amena-consulting.com/health
```

### Étape 12.9 — Vérifier le renouvellement automatique

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

Si `certbot.timer` n’est pas actif, activer le timer :

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 13. Vérifications finales

- `pm2 status`
- `pm2 logs amena-backend`
- `pm2 logs amena-frontend`
- `curl http://127.0.0.1:5000/health`
- ouvrir `https://www.amena-consulting.com`
- ouvrir `https://www.amena-consulting.com/admin/login`
- ouvrir `https://api.amena-consulting.com/health`
- tester un login admin
- tester une modification de contenu depuis `/admin`
- vérifier qu’un upload image est accessible via `https://api.amena-consulting.com/uploads/...`

## 14. Déploiement d’une mise à jour

```bash
cd /opt/amena
git pull
cd backend && npm ci
cd ../frontend && npm ci && npm run build
cd ..
pm2 restart ecosystem.config.js
```