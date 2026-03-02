# Railway.app Deployment Rehberi (siber.site için)

## Adım 1: GitHub Repo Oluşturun

1. github.com'a gidin
2. "New Repository" oluşturun (örn: "siteclone-ai")
3. Bu projedeki tüm dosyaları yükleyin:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/kullaniciadi/siteclone-ai.git
git push -u origin main
```

## Adım 2: Railway.app'a Kaydolun

1. railway.app adresine gidin
2. GitHub hesabınızla giriş yapın
3. "New Project" → "Deploy from GitHub repo"
4. Repo'nuzu seçin

## Adım 3: Ortam Değişkenlerini Ayarlayın

Railway dashboard'da "Variables" sekmesine ekleyin:

```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_SECRET=rastgele-bir-sifre-buraya-yaz
NEXTAUTH_URL=https://siteclone-ai-production.up.railway.app
```

## Adım 4: Build Ayarları

Railway otomatik olarak şunu kullanır:
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npm start`

## Adım 5: Deploy

"Deploy" butonuna tıklayın. 2-3 dakika içinde hazır olacak.

## Adım 6: siber.site Domainini Bağlayın

1. Railway dashboard → Settings → Domains
2. "Add Custom Domain"
3. `siber.site` yazın
4. Size verilen DNS kayıtlarını alan adı sağlayıcınıza ekleyin:
   - CNAME kaydı veya
   - A kaydı

## Adım 7: Veritabanı

Railway'de SQLite yerine PostgreSQL kullanmanız önerilir:
1. "New" → "Database" → "Add PostgreSQL"
2. DATABASE_URL otomatik olarak güncellenecektir

## Hazır!

Site: https://siber.site
