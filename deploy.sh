#!/bin/bash

# SiteClone AI Deployment Script
# Bu script projeyi sunucuya deploy eder

echo "🚀 SiteClone AI Deployment Başlatılıyor..."

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kontroller
echo -e "${YELLOW}📋 Kontroller yapılıyor...${NC}"

# Node.js kontrol
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js kurulu değil!${NC}"
    echo "Kurulum: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 18+ gerekli! Mevcut: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# .env kontrol
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env dosyası bulunamadı!${NC}"
    echo "Örnek .env dosyası oluşturuluyor..."
    cat > .env << EOF
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo -e "${GREEN}✅ .env dosyası oluşturuldu${NC}"
    echo -e "${YELLOW}⚠️  Lütfen .env dosyasını düzenleyin!${NC}"
fi

# Bağımlılıklar
echo -e "${YELLOW}📦 Bağımlılıklar yükleniyor...${NC}"
npm install

# Prisma
echo -e "${YELLOW}🗄️  Veritabanı hazırlanıyor...${NC}"
npx prisma generate
npx prisma db push

# Build
echo -e "${YELLOW}🔨 Build alınıyor...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build başarılı!${NC}"

# PM2 kontrol
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📥 PM2 yükleniyor...${NC}"
    npm install -g pm2
fi

# Uygulamayı başlat
echo -e "${YELLOW}🚀 Uygulama başlatılıyor...${NC}"
pm2 delete siteclone 2>/dev/null || true
pm2 start npm --name "siteclone" -- start
pm2 save

echo -e "${GREEN}✅ Deployment tamamlandı!${NC}"
echo ""
echo -e "${GREEN}🌐 Uygulama çalışıyor:${NC}"
echo "  - Local: http://localhost:3000"
echo ""
echo -e "${YELLOW}📊 Durum kontrolü:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}📝 Logları görüntüle:${NC}"
echo "  pm2 logs siteclone"
echo ""
echo -e "${YELLOW}🛑 Durdur:${NC}"
echo "  pm2 stop siteclone"
echo ""
echo -e "${YELLOW}🔄 Yeniden başlat:${NC}"
echo "  pm2 restart siteclone"
