# Checklist VPS — AMENA Consulting

## 1. Préparer le serveur

- créer un utilisateur non-root
- configurer l’accès SSH par clé
- activer le firewall (`ufw allow OpenSSH`, `ufw allow 80`, `ufw allow 443`)
- installer les paquets : `git`, `curl`, `nginx`, `mysql-server`

## 1 bis. Vérifier le DNS

- domaine principal : `amena-consulting.com`
- sous-domaine API : `api.amena-consulting.com`
- IP du serveur : `173.249.24.245`
- créer / vérifier les enregistrements `A` suivants :
  - `@` → `173.249.24.245`
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
cd /var/www
sudo git clone <URL_DU_REPO> amena-consulting
sudo chown -R $USER:$USER /var/www/amena-consulting
cd /var/www/amena-consulting
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
- configurer `CORS_ORIGIN=https://amena-consulting.com`

### Frontend : `frontend/.env.production`

- configurer `API_BASE_URL=https://api.amena-consulting.com/api`
- configurer `NEXT_PUBLIC_API_URL=https://api.amena-consulting.com/api`
- configurer `NEXT_PUBLIC_SITE_URL=https://amena-consulting.com`

## 7. Installer les dépendances

```bash
cd /var/www/amena-consulting/backend && npm ci
cd /var/www/amena-consulting/frontend && npm ci
```

## 8. Construire le frontend

```bash
cd /var/www/amena-consulting/frontend
npm run build
```

## 9. Lancer avec PM2

```bash
cd /var/www/amena-consulting
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 10. Créer l’admin initial

```bash
cd /var/www/amena-consulting/backend
npm run seed:admin
```

## 11. Installer la config Nginx

```bash
sudo cp /var/www/amena-consulting/deploy/nginx/amena-consulting.conf /etc/nginx/sites-available/amena-consulting
sudo ln -s /etc/nginx/sites-available/amena-consulting /etc/nginx/sites-enabled/amena-consulting
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 12. Installer le SSL Certbot

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d amena-consulting.com -d api.amena-consulting.com
```

## 13. Vérifications finales

- `pm2 status`
- `pm2 logs amena-backend`
- `pm2 logs amena-frontend`
- `curl http://127.0.0.1:5000/health`
- ouvrir `https://amena-consulting.com`
- ouvrir `https://amena-consulting.com/admin/login`
- ouvrir `https://api.amena-consulting.com/health`
- tester un login admin
- tester une modification de contenu depuis `/admin`

## 14. Déploiement d’une mise à jour

```bash
cd /var/www/amena-consulting
git pull
cd backend && npm ci
cd ../frontend && npm ci && npm run build
cd ..
pm2 restart ecosystem.config.js
```