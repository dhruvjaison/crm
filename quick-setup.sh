#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║       🚀 Enterprise CRM - Quick Setup Script             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        echo ""
    else
        rm .env.local
    fi
fi

if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creating .env.local file...${NC}"
    echo ""
    
    # Get database URL
    echo -e "${YELLOW}Database Setup:${NC}"
    echo "You need a PostgreSQL database. Options:"
    echo "  1. Neon (FREE, recommended): https://neon.tech"
    echo "  2. Local PostgreSQL: postgresql://postgres:password@localhost:5432/crm_db"
    echo ""
    read -p "Enter your DATABASE_URL: " DB_URL
    echo ""
    
    # Generate secrets
    echo -e "${BLUE}🔐 Generating security secrets...${NC}"
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo -e "${GREEN}✅ Secrets generated${NC}"
    echo ""
    
    # Create .env.local
    cat > .env.local << EOF
# Database
DATABASE_URL="${DB_URL}"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# Encryption (HIPAA)
ENCRYPTION_KEY="${ENCRYPTION_KEY}"

# App URL
APP_URL="http://localhost:3000"

# Email (Optional)
RESEND_API_KEY=""
EOF
    
    echo -e "${GREEN}✅ .env.local created successfully${NC}"
    echo ""
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma Client
echo -e "${BLUE}🔨 Generating Prisma Client...${NC}"
npm run db:generate --silent
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Push database schema
echo -e "${BLUE}🗄️  Creating database tables...${NC}"
npm run db:push --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema created${NC}"
    echo ""
else
    echo -e "${RED}❌ Database connection failed${NC}"
    echo "Please check your DATABASE_URL in .env.local"
    echo ""
    exit 1
fi

# Seed database
echo -e "${BLUE}🌱 Seeding demo data...${NC}"
npm run db:seed
echo -e "${GREEN}✅ Demo data loaded${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                  🎉 Setup Complete!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Your CRM is ready to run!${NC}"
echo ""
echo "To start the development server:"
echo -e "  ${BLUE}npm run dev${NC}"
echo ""
echo "Then visit: ${BLUE}http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📝 Demo Login Credentials:${NC}"
echo ""
echo "Super Admin (all tenants):"
echo "  📧 superadmin@crmplatform.com"
echo "  🔑 superadmin123"
echo ""
echo "Demo Clients:"
echo "  📧 admin@abc-healthcare.com / demo1234"
echo "  📧 admin@xyz-legal.com / demo1234"
echo "  📧 admin@123-realestate.com / demo1234"
echo ""
echo -e "${GREEN}Ready to demo! 🚀${NC}"
echo ""

