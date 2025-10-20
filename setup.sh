#!/bin/bash

echo "🚀 CRM Setup Script"
echo "===================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""

# Email (Optional for demo)
RESEND_API_KEY=""

# Encryption (HIPAA compliance)
ENCRYPTION_KEY=""

# App
APP_URL="http://localhost:3000"
EOF
    
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to set the following:"
    echo "   1. DATABASE_URL - Your PostgreSQL connection string"
    echo "   2. NEXTAUTH_SECRET - Generate with: openssl rand -base64 32"
    echo "   3. ENCRYPTION_KEY - Generate with: openssl rand -hex 32"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run db:generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with database credentials"
echo "2. Run: npm run db:push (to create database tables)"
echo "3. Run: npm run db:seed (to populate with demo data)"
echo "4. Run: npm run dev (to start the development server)"
echo ""
echo "📚 See README.md for more details"

