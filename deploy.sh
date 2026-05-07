#!/bin/bash
set -e

echo "Waiting for other apt operations to finish..."
while sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do sleep 5; done
while sudo fuser /var/lib/dpkg/lock >/dev/null 2>&1; do sleep 5; done

echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE USER showroomjr WITH PASSWORD 'showroomjr';" || true
sudo -u postgres psql -c "CREATE DATABASE showroomjr;" || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE showroomjr TO showroomjr;" || true
sudo -u postgres psql -d showroomjr -c "ALTER SCHEMA public OWNER TO showroomjr;" || true

cd /root/Web-Catalogo

echo "Installing dependencies..."
npm install

echo "Generating Prisma client and running migrations..."
npx prisma generate
npx prisma db push
npm install -D ts-node
npx ts-node prisma/seed.ts || true

echo "Building Next.js app..."
npm run build

echo "Setting up PM2..."
npm install -g pm2
pm2 stop showroom-jr || true
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true
env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u root --hp /root || true

echo "Configuring Nginx..."
cp /root/Web-Catalogo/nginx.conf /etc/nginx/sites-available/shwrmjr.pro || true
ln -sf /etc/nginx/sites-available/shwrmjr.pro /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
systemctl reload nginx

echo "Setting up SSL with Certbot..."
certbot --nginx -d shwrmjr.pro -d www.shwrmjr.pro --non-interactive --agree-tos -m admin@shwrmjr.pro || true

echo "Deployment finished!"
