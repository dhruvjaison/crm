// Production seed script - creates only Super Admin, no demo data
// For demo data, use: npm run db:seed:demo

import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcrypt'
import { generateSecurePassword } from '../lib/password-policy'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production database seed...')
  console.log('📝 This will create only a Super Admin account')
  console.log('💡 For demo data, use: npm run db:seed:demo\n')

  // Create a default system tenant for Super Admin
  console.log('📦 Creating system tenant...')
  
  const systemTenant = await prisma.tenant.upsert({
    where: { slug: 'system' },
    update: {},
    create: {
      name: 'System',
      slug: 'system',
      planTier: 'enterprise',
      maxUsers: 1,
    },
  })

  console.log('  ✅ System tenant created')

  // Create Super Admin user
  console.log('\n👤 Creating Super Admin account...')
  const superAdminPassword = generateSecurePassword(16)
  const hashedPassword = await hash(superAdminPassword, 10)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@crm.local' },
    update: {},
    create: {
      email: 'admin@crm.local',
      name: 'System Administrator',
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: systemTenant.id,
      isActive: true,
      emailVerified: new Date(),
    },
  })

  console.log('  ✅ Super Admin created')

  console.log(`\n✅ Production database seed completed!`)
  console.log(`\n🔐 ═══════════════════════════════════════════════════════════════`)
  console.log(`🔐 Super Admin Login Credentials`)
  console.log(`🔐 ═══════════════════════════════════════════════════════════════\n`)
  console.log(`   📧 Email:    admin@crm.local`)
  console.log(`   🔑 Password: ${superAdminPassword}`)
  console.log(``)
  console.log(`🔐 ═══════════════════════════════════════════════════════════════`)
  console.log(`💡 IMPORTANT NOTES:`)
  console.log(`   - Save these credentials in a secure location`)
  console.log(`   - Change password after first login`)
  console.log(`   - New users should sign up via /login`)
  console.log(`   - For demo data: npm run db:seed:demo`)
  console.log(`🔐 ═══════════════════════════════════════════════════════════════\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
