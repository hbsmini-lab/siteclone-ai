# FTP ve Sunucu Deployment Rehberi

## ⚠️ Önemli Bilgi

Bu proje **Next.js full-stack uygulamasıdır** ve şunları içerir:
- Node.js sunucusu (API routes)
- SQLite veritabanı
- NextAuth.js kimlik doğrulama
- Gerçek zamanlı işlemler

**Statik FTP hosting (sadece HTML/CSS/JS) bu uygulamayı çalıştıramaz!**

---

## 🚀 Deployment Seçenekleri

### Seçenek 1: Node.js Sunucu (Önerilen)
VPS, Dedicated Server veya Node.js destekleyen hosting

**Gereksinimler:**
- Node.js 18+ 
- NPM veya Yarn
- SQLite desteği

**Adımlar:**

1. **Sunucuya bağlanın:**
```bash
ssh kullanici@sunucu-ip
```

2. **Projeyi yükleyin:**
```bash
cd /var/www
git clone [proje-url]
cd yenidahs
```

3. **Bağımlılıkları yükleyin:**
```bash
npm install
```

4. **Ortam değişkenlerini ayarlayın:**
```bash
nano .env
```

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="gizli-anahtar-buraya"
NEXTAUTH_URL="https://siteniz.com"
```

5. **Veritabanını hazırlayın:**
```bash
npx prisma generate
npx prisma db push
```

6. **Build alın:**
```bash
npm run build
```

7. **PM2 ile başlatın:**
```bash
npm install -g pm2
pm2 start npm --name "siteclone" -- start
pm2 save
pm2 startup
```

---

### Seçenek 2: Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build ve çalıştır:**
```bash
docker build -t siteclone .
docker run -p 3000:3000 -v $(pwd)/prisma:/app/prisma siteclone
```

---

### Seçenek 3: Railway / Render / Heroku (Ücretsiz/Ücretli)

**Railway:**
1. railway.app adresine gidin
2. GitHub repo bağlayın
3. Deploy edin
4. Ortam değişkenlerini ekleyin

**Render:**
1. render.com'a kaydolun
2. "New Web Service" seçin
3. GitHub repo bağlayın
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm start`

---

### Seçenek 4: cPanel / Shared Hosting (Node.js destekleyen)

Bazı cPanel hostingler Node.js uygulamalarını destekler:

1. cPanel → "Setup Node.js App"
2. Node.js 18+ seçin
3. Application root: `yenidahs`
4. Application URL: `siteniz.com`
5. "Run NPM Install" tıklayın
6. "Restart" tıklayın

---

## 📁 Manuel FTP Yükleme (Sadece Frontend)

Eğer sadece statik dosyaları (HTML/CSS/JS) FTP'ye yüklemek isterseniz:

**Not:** API, database ve auth çalışmaz!

```bash
# Sadece statik export
npm run build
```

Çıkan `out` klasöründeki dosyaları FTP'ye yükleyin.

---

## 🔧 Nginx Yapılandırması (VPS için)

```nginx
server {
    listen 80;
    server_name siteniz.com www.siteniz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔄 Otomatik Deployment (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          script: |
            cd /var/www/yenidahs
            git pull
            npm install
            npx prisma generate
            npm run build
            pm2 restart siteclone
```

---

## 📋 Deployment Kontrol Listesi

- [ ] Node.js 18+ kurulu
- [ ] `.env` dosyası oluşturuldu
- [ ] `NEXTAUTH_SECRET` ayarlandı
- [ ] `NEXTAUTH_URL` ayarlandı
- [ ] Veritabanı migrate edildi
- [ ] Build başarılı
- [ ] PM2 çalışıyor
- [ ] Domain DNS ayarları yapıldı
- [ ] SSL sertifikası kuruldu (Let's Encrypt)

---

## 🆘 Yardım

Sorun yaşarsanız:
1. Logları kontrol edin: `pm2 logs`
2. Port kontrolü: `netstat -tlnp`
3. Firewall ayarları: `ufw allow 3000`
