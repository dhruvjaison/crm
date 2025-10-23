// Demo data seed script - only use for testing/demo purposes
// To use: npm run db:seed:demo

import { PrismaClient, UserRole, ContactStatus, DealStatus, ActivityType } from '@prisma/client'
import { hash } from 'bcrypt'
import {
  generateRandomContact,
  generateRandomCall,
  generateRandomDeal,
  generateRandomTask,
} from '../lib/mock-data'
import { generateSecurePassword } from '../lib/password-policy'

const prisma = new PrismaClient()

const generatedCredentials: Array<{ email: string; password: string; role: string }> = []

async function main() {
  console.log('🌱 Starting DEMO database seed...')
  console.log('🔐 Generating secure passwords for demo accounts...')

  // Create demo tenants with sample data
  const demoTenants = [
    {
      name: 'ABC Healthcare',
      slug: 'abc-healthcare',
      industry: 'Healthcare',
    },
    {
      name: 'XYZ Legal Services',
      slug: 'xyz-legal',
      industry: 'Legal',
    },
    {
      name: '123 Real Estate',
      slug: '123-realestate',
      industry: 'Real Estate',
    },
  ]

  for (const tenantData of demoTenants) {
    console.log(`\n📦 Creating tenant: ${tenantData.name}`)
    
    const tenant = await prisma.tenant.upsert({
      where: { slug: tenantData.slug },
      update: {},
      create: {
        name: tenantData.name,
        slug: tenantData.slug,
        planTier: 'starter',
        maxUsers: 10,
      },
    })

    // Create pipeline stages
    const stages = [
      { name: 'New Lead', order: 1, probability: 10, color: '#gray' },
      { name: 'Qualified', order: 2, probability: 30, color: '#blue' },
      { name: 'Proposal', order: 3, probability: 50, color: '#yellow' },
      { name: 'Negotiation', order: 4, probability: 75, color: '#orange' },
      { name: 'Closed Won', order: 5, probability: 100, color: '#green' },
    ]

    for (const stageData of stages) {
      await prisma.pipelineStage.upsert({
        where: {
          tenantId_order: {
            tenantId: tenant.id,
            order: stageData.order,
          },
        },
        update: {},
        create: {
          ...stageData,
          tenantId: tenant.id,
        },
      })
    }

    // Create users for this tenant
    const adminPassword = generateSecurePassword(16)
    const userPassword = generateSecurePassword(16)
    
    const hashedAdminPassword = await hash(adminPassword, 10)
    const hashedUserPassword = await hash(userPassword, 10)

    const adminUser = await prisma.user.upsert({
      where: { email: `admin@${tenantData.slug}.com` },
      update: {},
      create: {
        email: `admin@${tenantData.slug}.com`,
        name: `${tenantData.name} Admin`,
        password: hashedAdminPassword,
        role: UserRole.CLIENT_ADMIN,
        tenantId: tenant.id,
        isActive: true,
        forcePasswordChange: true,
        passwordChangedAt: new Date(),
      },
    })

    const regularUser = await prisma.user.upsert({
      where: { email: `user@${tenantData.slug}.com` },
      update: {},
      create: {
        email: `user@${tenantData.slug}.com`,
        name: `${tenantData.name} User`,
        password: hashedUserPassword,
        role: UserRole.CLIENT_USER,
        tenantId: tenant.id,
        isActive: true,
        forcePasswordChange: true,
        passwordChangedAt: new Date(),
      },
    })

    generatedCredentials.push({
      email: `admin@${tenantData.slug}.com`,
      password: adminPassword,
      role: 'Admin',
    })
    generatedCredentials.push({
      email: `user@${tenantData.slug}.com`,
      password: userPassword,
      role: 'User',
    })

    console.log(`  ✅ Created users for ${tenantData.name}`)

    // Generate demo data
    console.log(`  📝 Generating contacts...`)
    const contactCount = Math.floor(Math.random() * 15) + 10
    const contacts = []
    for (let i = 0; i < contactCount; i++) {
      const contactData = generateRandomContact()
      const contact = await prisma.contact.create({
        data: {
          ...contactData,
          tenantId: tenant.id,
        },
      })
      contacts.push(contact)
    }

    // Generate calls for contacts
    console.log(`  📞 Generating calls...`)
    for (const contact of contacts.slice(0, Math.floor(contacts.length * 0.7))) {
      const callCount = Math.floor(Math.random() * 4) + 1
      for (let i = 0; i < callCount; i++) {
        const callData = generateRandomCall(contact.id, tenant.id)
        await prisma.call.create({
          data: callData,
        })
      }
    }

    // Generate deals
    console.log(`  💼 Generating deals...`)
    const allStages = await prisma.pipelineStage.findMany({
      where: { tenantId: tenant.id },
    })
    
    const dealCount = Math.floor(Math.random() * 10) + 5
    for (let i = 0; i < dealCount; i++) {
      const contact = contacts[Math.floor(Math.random() * contacts.length)]
      const stage = allStages[Math.floor(Math.random() * allStages.length)]
      const dealData = generateRandomDeal(contact.id, tenant.id, stage.id)
      await prisma.deal.create({
        data: {
          ...dealData,
          ownerId: adminUser.id,
        },
      })
    }

    // Generate tasks
    console.log(`  ✅ Generating tasks...`)
    const taskCount = Math.floor(Math.random() * 15) + 5
    for (let i = 0; i < taskCount; i++) {
      const contact = contacts[Math.floor(Math.random() * contacts.length)]
      const taskData = generateRandomTask(contact.id, tenant.id, adminUser.id)
      await prisma.task.create({
        data: taskData,
      })
    }

    console.log(`  ✅ Completed ${tenantData.name}`)
  }

  // Create super admin user
  const superAdminPlainPassword = generateSecurePassword(16)
  const superAdminPassword = await hash(superAdminPlainPassword, 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@crmplatform.com' },
    update: {},
    create: {
      email: 'superadmin@crmplatform.com',
      name: 'Super Administrator',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: (await prisma.tenant.findFirst())!.id,
      isActive: true,
      forcePasswordChange: true,
      passwordChangedAt: new Date(),
    },
  })

  generatedCredentials.unshift({
    email: 'superadmin@crmplatform.com',
    password: superAdminPlainPassword,
    role: 'Super Admin',
  })

  console.log(`\n✅ DEMO database seeding completed!`)
  console.log(`\n🔐 ═══════════════════════════════════════════════════════════════`)
  console.log(`🔐 DEMO Login Credentials (SAVE THESE!)`)
  console.log(`🔐 ═══════════════════════════════════════════════════════════════\n`)
  
  generatedCredentials.forEach(cred => {
    console.log(`   ${cred.role}:`)
    console.log(`   📧 Email:    ${cred.email}`)
    console.log(`   🔑 Password: ${cred.password}`)
    console.log(``)
  })
  
  console.log(`🔐 ═══════════════════════════════════════════════════════════════`)
  console.log(`⚠️  DEMO DATA NOTES:`)
  console.log(`   - This is DEMO data with sample contacts, deals, and calls`)
  console.log(`   - All accounts require password change on first login`)
  console.log(`   - For production, use 'npm run db:seed' instead`)
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

