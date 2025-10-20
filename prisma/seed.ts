import { PrismaClient, UserRole, ContactStatus, DealStatus, ActivityType } from '@prisma/client'
import { hash } from 'bcrypt'
import {
  generateRandomContact,
  generateRandomCall,
  generateRandomDeal,
  generateRandomTask,
} from '../lib/mock-data'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create 3 demo tenants
  const tenants = [
    {
      name: 'ABC Healthcare',
      slug: 'abc-healthcare',
      planTier: 'professional',
      maxUsers: 15,
      primaryColor: '#06b6d4', // cyan
    },
    {
      name: 'XYZ Legal Services',
      slug: 'xyz-legal',
      planTier: 'enterprise',
      maxUsers: 50,
      primaryColor: '#8b5cf6', // purple
    },
    {
      name: '123 Real Estate',
      slug: '123-realestate',
      planTier: 'starter',
      maxUsers: 5,
      primaryColor: '#10b981', // green
    },
  ]

  for (const tenantData of tenants) {
    console.log(`\n📁 Creating tenant: ${tenantData.name}`)

    // Create tenant
    const tenant = await prisma.tenant.upsert({
      where: { slug: tenantData.slug },
      update: {},
      create: tenantData,
    })

    // Create pipeline stages for this tenant
    const stages = [
      { name: 'New Lead', order: 1, probability: 10, color: '#gray' },
      { name: 'Qualified', order: 2, probability: 30, color: '#blue' },
      { name: 'Demo Scheduled', order: 3, probability: 50, color: '#yellow' },
      { name: 'Proposal Sent', order: 4, probability: 70, color: '#orange' },
      { name: 'Negotiation', order: 5, probability: 85, color: '#purple' },
      { name: 'Closed Won', order: 6, probability: 100, color: '#green' },
    ]

    const createdStages = []
    for (const stageData of stages) {
      const stage = await prisma.pipelineStage.upsert({
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
      createdStages.push(stage)
    }

    // Create users for this tenant
    const hashedPassword = await hash('demo1234', 10)

    const adminUser = await prisma.user.upsert({
      where: { email: `admin@${tenantData.slug}.com` },
      update: {},
      create: {
        email: `admin@${tenantData.slug}.com`,
        name: `${tenantData.name} Admin`,
        password: hashedPassword,
        role: UserRole.CLIENT_ADMIN,
        tenantId: tenant.id,
        isActive: true,
      },
    })

    const regularUser = await prisma.user.upsert({
      where: { email: `user@${tenantData.slug}.com` },
      update: {},
      create: {
        email: `user@${tenantData.slug}.com`,
        name: `${tenantData.name} User`,
        password: hashedPassword,
        role: UserRole.CLIENT_USER,
        tenantId: tenant.id,
        isActive: true,
      },
    })

    console.log(`  ✅ Created users for ${tenantData.name}`)
    console.log(`     Admin: admin@${tenantData.slug}.com / demo1234`)
    console.log(`     User: user@${tenantData.slug}.com / demo1234`)

    // Create contacts
    console.log(`  👥 Creating contacts...`)
    const contactCount = Math.floor(Math.random() * 20) + 30 // 30-50 contacts

    for (let i = 0; i < contactCount; i++) {
      const contactData = generateRandomContact()
      const contact = await prisma.contact.create({
        data: {
          ...contactData,
          tenantId: tenant.id,
        },
      })

      // Create activity log for contact creation
      await prisma.activity.create({
        data: {
          type: ActivityType.CONTACT_CREATED,
          description: `Contact ${contact.firstName} ${contact.lastName} was added`,
          tenantId: tenant.id,
          contactId: contact.id,
          userId: adminUser.id,
        },
      })

      // Generate 1-5 calls for some contacts (50% chance)
      if (Math.random() > 0.5) {
        const callCount = Math.floor(Math.random() * 4) + 1
        for (let j = 0; j < callCount; j++) {
          const callData = generateRandomCall(contact.id, tenant.id)
          const call = await prisma.call.create({
            data: callData,
          })

          // Create activity for call
          await prisma.activity.create({
            data: {
              type: ActivityType.CALL,
              description: `${callData.direction === 'INBOUND' ? 'Incoming' : 'Outgoing'} call - ${call.sentiment} sentiment`,
              tenantId: tenant.id,
              contactId: contact.id,
              callId: call.id,
            },
          })

          // Generate task if follow-up needed
          if (call.followUpNeeded && Math.random() > 0.3) {
            const taskData = generateRandomTask(contact.id, tenant.id, regularUser.id)
            await prisma.task.create({
              data: taskData,
            })
          }
        }
      }

      // Create deals for qualified contacts (30% chance)
      if (contact.status === ContactStatus.QUALIFIED || Math.random() > 0.7) {
        const randomStage = createdStages[Math.floor(Math.random() * createdStages.length)]
        const dealData = generateRandomDeal(contact.id, tenant.id, randomStage.id)
        const deal = await prisma.deal.create({
          data: {
            ...dealData,
            ownerId: adminUser.id,
          },
        })

        // Create activity for deal
        await prisma.activity.create({
          data: {
            type: ActivityType.DEAL_CREATED,
            description: `Deal "${deal.title}" created for $${deal.value}`,
            tenantId: tenant.id,
            contactId: contact.id,
            dealId: deal.id,
            userId: adminUser.id,
          },
        })
      }
    }

    console.log(`  ✅ Created ${contactCount} contacts with calls, deals, and tasks`)

    // Create email templates
    const emailTemplates = [
      {
        name: 'Welcome Email',
        subject: 'Welcome to {{companyName}}!',
        body: '<p>Hi {{firstName}},</p><p>Thank you for your interest in our services...</p>',
        variables: ['firstName', 'companyName'],
      },
      {
        name: 'Follow-up After Call',
        subject: 'Great speaking with you, {{firstName}}!',
        body: '<p>Hi {{firstName}},</p><p>It was wonderful speaking with you today...</p>',
        variables: ['firstName'],
      },
    ]

    for (const templateData of emailTemplates) {
      await prisma.emailTemplate.create({
        data: {
          ...templateData,
          tenantId: tenant.id,
        },
      })
    }

    console.log(`  ✅ Created email templates`)
  }

  // Create super admin user (can access all tenants)
  const superAdminPassword = await hash('superadmin123', 10)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@crmplatform.com' },
    update: {},
    create: {
      email: 'superadmin@crmplatform.com',
      name: 'Super Administrator',
      password: superAdminPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: (await prisma.tenant.findFirst())!.id, // Associate with first tenant
      isActive: true,
    },
  })

  console.log(`\n👑 Super Admin created:`)
  console.log(`   Email: superadmin@crmplatform.com / superadmin123`)
  console.log(`\n✅ Database seeding completed!`)
  console.log(`\n📝 Login credentials summary:`)
  console.log(`   Super Admin: superadmin@crmplatform.com / superadmin123`)
  console.log(`   ABC Healthcare Admin: admin@abc-healthcare.com / demo1234`)
  console.log(`   XYZ Legal Admin: admin@xyz-legal.com / demo1234`)
  console.log(`   123 Real Estate Admin: admin@123-realestate.com / demo1234`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

